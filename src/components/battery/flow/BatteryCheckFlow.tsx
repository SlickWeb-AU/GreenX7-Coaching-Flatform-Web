'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { BATTERY_QUESTION_AREAS, BATTERY_STEPS, type BatteryStep } from '@/constants/battery';
import { useBatteryLive } from '@/features/battery-check';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { toApiError } from '@/lib/api-error';
import {
  buildDraftKey,
  buildSubmissionMarkerKey,
  calculateBatteryScore,
  getOrCreateDeviceId,
  isDraftFresh,
} from '@/lib/battery';
import { resolveLiveLogoUrl, resolveLiveNames, resolvePeriodLabel } from '@/lib/live';
import {
  BatteryLanding,
  BatteryLoadingStep,
  BatteryStatusScreen,
} from '@/components/battery/screens';
import { BatteryResultsView } from '@/components/battery/results';
import { BatteryOnboardingModal } from '@/components/battery/flow/BatteryOnboardingModal';
import { BatteryQuestionStep } from '@/components/battery/flow/BatteryQuestionStep';
import type { BatteryCheckStateDto } from '@/types/battery';

export interface BatteryCheckFlowProps {
  clientSlug: string;
  departmentSlug: string;
  stateData?: BatteryCheckStateDto;
}

export function BatteryCheckFlow({ clientSlug, departmentSlug, stateData }: BatteryCheckFlowProps) {
  const { data } = useBatteryLive(clientSlug, departmentSlug, { refetchInterval: false });
  const names = resolveLiveNames(data, clientSlug, departmentSlug);
  const clientName = stateData?.branding.clientName ?? names.clientName;
  const departmentName = stateData?.branding.departmentName ?? names.departmentName;
  const clientLogoUrl = stateData?.branding.darkLogoUrl ?? resolveLiveLogoUrl(data);

  const [step, setStep] = useState<BatteryStep>(BATTERY_STEPS.LANDING);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<(number | null)[]>(Array(8).fill(null));
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [submissionState, setSubmissionState] = useState<'CLOSED' | 'ALREADY_SUBMITTED' | null>(
    null,
  );
  const [resultToken, setResultToken] = useState<string | undefined>(undefined);
  const [animDone, setAnimDone] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const periodLabel = stateData?.periodMonth
    ? `${stateData.periodYear ?? ''}-${stateData.periodMonth}`
    : (resolvePeriodLabel(data) ?? 'current');
  const draftStorageKey = buildDraftKey(clientSlug, departmentSlug, periodLabel);

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
        if (Array.isArray(parsed.scores) && parsed.scores.length === 8) {
          setScores(parsed.scores);
          if (typeof parsed.index === 'number' && parsed.index >= 0 && parsed.index < 8) {
            setIndex(parsed.index);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [draftStorageKey]);

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
        scores: BATTERY_QUESTION_AREAS.map((area, i) => ({
          area: area.toUpperCase(),
          score: scores[i] as number,
        })),
        deviceId,
      });
    },
    onSuccess: (res) => {
      if (res?.resultToken) {
        setResultToken(res.resultToken);
      }
      const key = buildSubmissionMarkerKey(departmentSlug, periodLabel);
      try {
        window.localStorage.setItem(key, '1');
        document.cookie = `${key}=1; path=/; max-age=31536000`;
        window.localStorage.removeItem(draftStorageKey);
      } catch {
        // Ignore storage errors
      }
      setSubmitFailed(false);
    },
    onError: (err: unknown) => {
      const apiErr = toApiError(err);
      if (apiErr.statusCode === 409) {
        setSubmissionState('ALREADY_SUBMITTED');
      } else if (
        apiErr.statusCode === 400 ||
        apiErr.statusCode === 403 ||
        apiErr.statusCode === 410
      ) {
        setSubmissionState('CLOSED');
      } else {
        setSubmitFailed(true);
      }
    },
  });

  const finishQuestions = useCallback(() => {
    if (submitMutation.isPending || submitMutation.isSuccess) return;
    if (calculateBatteryScore(scores) === null) return;
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
    const area = BATTERY_QUESTION_AREAS[index];
    return (
      <BatteryQuestionStep
        index={index}
        area={area}
        value={scores[index]}
        onChange={(v) => updateScoreAt(index, v)}
        onBack={() => (index === 0 ? setStep(BATTERY_STEPS.LANDING) : setIndex(index - 1))}
        onNext={() => (index === 7 ? finishQuestions() : setIndex(index + 1))}
      />
    );
  }

  if (step === BATTERY_STEPS.LOADING) {
    const preview = calculateBatteryScore(scores) ?? 0;
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

  return (
    <BatteryResultsView
      clientSlug={clientSlug}
      departmentSlug={departmentSlug}
      areas={BATTERY_QUESTION_AREAS.map((area, i) => ({ area, score: scores[i] }))}
      resultToken={resultToken}
      clientName={clientName}
      departmentName={departmentName}
      clientLogoUrl={clientLogoUrl}
    />
  );
}
