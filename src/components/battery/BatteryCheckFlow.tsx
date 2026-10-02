'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { BATTERY_QUESTION_AREAS, BATTERY_STEPS, type BatteryStep } from '@/constants/battery';
import { useBatteryLive } from '@/features/battery-check';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { toApiError } from '@/lib/api-error';
import { buildSubmissionMarkerKey, calculateBatteryScore, isDraftFresh } from '@/lib/battery';
import { resolveLiveNames, resolvePeriodLabel } from '@/lib/live';
import { BatteryClosedScreen } from './BatteryClosedScreen';
import { BatteryLanding } from './BatteryLanding';
import { BatteryLoadingStep } from './BatteryLoadingStep';
import { BatteryOnboardingModal } from './BatteryOnboardingModal';
import { BatteryQuestionStep } from './BatteryQuestionStep';
import { BatteryResultsView } from './BatteryResultsView';

interface Draft {
  savedAt: number;
  index: number;
  scores: (number | null)[];
}

export function BatteryCheckFlow({
  clientSlug,
  departmentSlug,
}: {
  clientSlug: string;
  departmentSlug: string;
}) {
  const { data } = useBatteryLive(clientSlug, departmentSlug, { refetchInterval: false });
  const names = resolveLiveNames(data, clientSlug, departmentSlug);
  const draftKey = useMemo(() => `gx7-bc-draft-${departmentSlug}`, [departmentSlug]);
  const [step, setStep] = useState<BatteryStep>(BATTERY_STEPS.LANDING);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<(number | null)[]>(Array(8).fill(null));
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [locked, setLocked] = useState(false);
  const [resultToken, setResultToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (isDraftFresh(draft.savedAt) && draft.scores.length === 8) {
        setScores(draft.scores);
        setIndex(Math.min(draft.index, 7));
        setStep(BATTERY_STEPS.QUESTIONS);
      } else {
        window.localStorage.removeItem(draftKey);
      }
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    if (step !== BATTERY_STEPS.QUESTIONS) return;
    window.localStorage.setItem(draftKey, JSON.stringify({ savedAt: Date.now(), index, scores }));
  }, [step, index, scores, draftKey]);

  const submitMutation = useMutation({
    mutationFn: () => {
      let deviceId = window.localStorage.getItem('gx7-device-id');
      if (!deviceId) {
        deviceId =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `dev-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        window.localStorage.setItem('gx7-device-id', deviceId);
      }
      return batteryCheckApi.submit(clientSlug, departmentSlug, {
        scores: BATTERY_QUESTION_AREAS.map((area, i) => ({ area, score: scores[i] as number })),
        deviceId,
      });
    },
    onSuccess: (res) => {
      if (res?.resultToken) {
        setResultToken(res.resultToken);
      }
      const period = resolvePeriodLabel(data) ?? 'current';
      const key = buildSubmissionMarkerKey(departmentSlug, period);
      window.localStorage.setItem(key, '1');
      document.cookie = `${key}=1; path=/; max-age=31536000`;
      window.localStorage.removeItem(draftKey);
      setStep(BATTERY_STEPS.RESULTS);
    },
    onError: (err: unknown) => {
      const apiErr = toApiError(err);
      if (apiErr.statusCode === 403 || apiErr.statusCode === 410) {
        setLocked(true);
      }
    },
  });

  const finishQuestions = useCallback(() => {
    if (calculateBatteryScore(scores) === null) return;
    setStep(BATTERY_STEPS.LOADING);
    submitMutation.mutate();
  }, [scores, submitMutation]);

  if (locked) return <BatteryClosedScreen nextOpensLabel={data?.period?.label} />;

  if (step === BATTERY_STEPS.LANDING) {
    return (
      <>
        <BatteryLanding
          clientName={names.clientName}
          departmentName={names.departmentName}
          onStart={() => setStep(BATTERY_STEPS.QUESTIONS)}
          onHowItWorks={() => setShowHowItWorks(true)}
        />
        <BatteryOnboardingModal
          open={showHowItWorks}
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
        onChange={(v) =>
          setScores((s) => {
            const next = [...s];
            next[index] = v;
            return next;
          })
        }
        onBack={() => (index === 0 ? setStep(BATTERY_STEPS.LANDING) : setIndex(index - 1))}
        onNext={() => (index === 7 ? finishQuestions() : setIndex(index + 1))}
      />
    );
  }

  if (step === BATTERY_STEPS.LOADING) {
    const preview = calculateBatteryScore(scores) ?? 0;
    return (
      <BatteryLoadingStep
        score={preview}
        onDone={() => {
          if (!submitMutation.isPending && !submitMutation.isError) setStep(BATTERY_STEPS.RESULTS);
        }}
      />
    );
  }

  return (
    <BatteryResultsView
      clientSlug={clientSlug}
      departmentSlug={departmentSlug}
      areas={BATTERY_QUESTION_AREAS.map((area, i) => ({ area, score: scores[i] }))}
      resultToken={resultToken}
    />
  );
}
