'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { BATTERY_QUESTION_AREAS, BATTERY_STEPS, type BatteryStep } from '@/constants/battery';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { toApiError } from '@/lib/api-error';
import {
  buildDraftKey,
  calculateBatteryScore,
  getOrCreateDeviceId,
  isDraftFresh,
} from '@/lib/battery';
import { formatSlugLabel } from '@/lib/utils';
import {
  BatteryLanding,
  BatteryLoadingStep,
  BatteryStatusScreen,
} from '@/components/battery/screens';
import { BatteryResultsView } from '@/components/battery/results';
import { BatteryOnboardingModal } from '@/components/battery/flow/BatteryOnboardingModal';
import { BatteryQuestionStep } from '@/components/battery/flow/BatteryQuestionStep';
import type { BatteryCheckStateDto, BatterySubmitResult } from '@/types/battery';

export interface BatteryCheckFlowProps {
  clientSlug: string;
  departmentSlug: string;
  stateData?: BatteryCheckStateDto;
}

export function BatteryCheckFlow({ clientSlug, departmentSlug, stateData }: BatteryCheckFlowProps) {
  const clientName = stateData?.branding.clientName ?? formatSlugLabel(clientSlug);
  const departmentName = stateData?.branding.departmentName ?? formatSlugLabel(departmentSlug);
  const clientLogoUrl = stateData?.branding.darkLogoUrl ?? null;

  const prompts = useMemo(
    () =>
      (stateData?.areas?.length
        ? [...stateData.areas].sort((a, b) => a.order - b.order)
        : BATTERY_QUESTION_AREAS.map((area, i) => ({
            area,
            label: area,
            title: area,
            question: '',
            order: i,
          }))
      ).map((p) => ({ ...p, area: p.area })),
    [stateData],
  );
  const total = prompts.length;
  const scoreMin = stateData?.scoreMin ?? 1;
  const scoreMax = stateData?.scoreMax ?? 10;

  const [step, setStep] = useState<BatteryStep>(BATTERY_STEPS.LANDING);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [submissionState, setSubmissionState] = useState<'CLOSED' | 'ALREADY_SUBMITTED' | null>(
    null,
  );
  const [submitResult, setSubmitResult] = useState<BatterySubmitResult | null>(null);
  const [animDone, setAnimDone] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const periodLabel = stateData?.periodMonth
    ? `${stateData.periodYear ?? ''}-${stateData.periodMonth}`
    : 'current';
  const draftStorageKey = buildDraftKey(clientSlug, departmentSlug, periodLabel);

  // Reset scores when the question set changes (e.g. different period)
  useEffect(() => {
    setScores(Array(total).fill(null));
    setIndex(0);
  }, [total, draftStorageKey]);

  // Initialize scores and draft on mount (60-minute resume window)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // ponytail: stale draft (>60m) is discarded, no migration
        if (parsed?.updatedAt && !isDraftFresh(parsed.updatedAt)) {
          window.localStorage.removeItem(draftStorageKey);
          return;
        }
        if (Array.isArray(parsed.scores) && parsed.scores.length === total) {
          setScores(parsed.scores);
          if (typeof parsed.index === 'number' && parsed.index >= 0 && parsed.index < total) {
            setIndex(parsed.index);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [draftStorageKey, total]);

  // Persist scores whenever they change
  const updateScoreAt = useCallback(
    (qIndex: number, val: number) => {
      setScores((prev) => {
        const next = [...prev];
        next[qIndex] = val;
        try {
          window.localStorage.setItem(
            draftStorageKey,
            JSON.stringify({ scores: next, index: qIndex, updatedAt: Date.now() }),
          );
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    },
    [draftStorageKey],
  );

  const submitMutation = useMutation({
    mutationFn: () => {
      const deviceId = getOrCreateDeviceId();
      return batteryCheckApi.submit(clientSlug, departmentSlug, {
        scores: prompts.map((p, i) => ({
          area: p.area.toUpperCase(),
          score: scores[i] as number,
        })),
        deviceId,
      });
    },
    onSuccess: (res) => {
      setSubmitResult(res);
      try {
        window.localStorage.removeItem(draftStorageKey);
      } catch {
        // Ignore storage errors
      }
      setSubmitFailed(false);
    },
    onError: (err: unknown) => {
      const apiErr = toApiError(err);
      if (apiErr.statusCode === 409 || apiErr.errorCode === 'CONFLICT') {
        setSubmissionState('ALREADY_SUBMITTED');
      } else if (apiErr.errorCode === 'BAD_REQUEST') {
        setSubmissionState('CLOSED');
      } else {
        setSubmitFailed(true);
      }
    },
  });

  const finishQuestions = useCallback(() => {
    if (submitMutation.isPending || submitMutation.isSuccess) return;
    if (scores.some((s) => s === null || s === undefined)) return;
    setAnimDone(false);
    setSubmitFailed(false);
    setStep(BATTERY_STEPS.LOADING);
    submitMutation.mutate();
  }, [scores, submitMutation]);

  // Advance to results only when both animation and submit succeed
  useEffect(() => {
    if (step === BATTERY_STEPS.LOADING && animDone && submitMutation.isSuccess) {
      setStep(BATTERY_STEPS.RESULTS);
    }
  }, [step, animDone, submitMutation.isSuccess]);

  if (submissionState === 'ALREADY_SUBMITTED') {
    return (
      <BatteryStatusScreen
        variant="submitted"
        clientName={clientName}
        departmentName={departmentName}
        clientLogoUrl={clientLogoUrl}
        periodMonth={stateData?.periodMonth}
        periodYear={stateData?.periodYear}
      />
    );
  }

  if (submissionState === 'CLOSED') {
    return (
      <BatteryStatusScreen
        variant="closed"
        clientName={clientName}
        departmentName={departmentName}
        clientLogoUrl={clientLogoUrl}
        nextOpensAt={stateData?.nextOpensAt}
        timeZone={stateData?.timeZone}
      />
    );
  }

  if (step === BATTERY_STEPS.LANDING) {
    return (
      <>
        <BatteryLanding
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          onStart={() => setStep(BATTERY_STEPS.QUESTIONS)}
          onHowItWorks={() => setShowHowItWorks(true)}
        />
        <BatteryOnboardingModal
          open={showHowItWorks}
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          onClose={() => setShowHowItWorks(false)}
          onStart={() => {
            setShowHowItWorks(false);
            setStep(BATTERY_STEPS.QUESTIONS);
          }}
        />
      </>
    );
  }

  if (step === BATTERY_STEPS.QUESTIONS) {
    const prompt = prompts[index];
    if (!prompt) return null;
    return (
      <BatteryQuestionStep
        index={index}
        total={total}
        prompt={prompt}
        scoreMin={scoreMin}
        scoreMax={scoreMax}
        value={scores[index]}
        onChange={(v) => updateScoreAt(index, v)}
        onBack={() => (index === 0 ? setStep(BATTERY_STEPS.LANDING) : setIndex(index - 1))}
        onNext={() => (index === total - 1 ? finishQuestions() : setIndex(index + 1))}
      />
    );
  }

  if (step === BATTERY_STEPS.LOADING) {
    // ponytail: preview-only average for animation; server score is source of truth
    const filled = scores.filter((s): s is number => s !== null && s !== undefined);
    const preview =
      filled.length === total && total > 0
        ? Math.round(
            ((filled.reduce((a, b) => a + b, 0) / total - scoreMin) /
              Math.max(1, scoreMax - scoreMin)) *
              100,
          )
        : (calculateBatteryScore(scores) ?? 0);
    return (
      <>
        <BatteryLoadingStep
          score={preview}
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          onDone={() => setAnimDone(true)}
        />
        {submitFailed && (
          <div className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit max-w-[90vw] items-center gap-3 rounded-xl bg-neutral-grey-1 px-4 py-3 text-white shadow-lg">
            <span className="body-14-medium">Could not submit. Check connection.</span>
            <button
              type="button"
              onClick={() => {
                setSubmitFailed(false);
                submitMutation.mutate();
              }}
              className="body-14-bold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}
      </>
    );
  }

  if (!submitResult) return null;

  return (
    <BatteryResultsView
      result={submitResult}
      clientName={clientName}
      departmentName={departmentName}
      clientLogoUrl={clientLogoUrl}
    />
  );
}
