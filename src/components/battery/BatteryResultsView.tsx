'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { calculateBatteryScore, getBatteryZone } from '@/lib/battery';
import type { BatteryAreaScore } from '@/types/battery';
import { BatteryRechargeAccordion } from './BatteryRechargeAccordion';
import { BatteryResultsHero } from './BatteryResultsHero';
import { BatteryScoreBreakdown } from './BatteryScoreBreakdown';

export function BatteryResultsView({
  clientSlug,
  departmentSlug,
  areas,
  resultToken,
}: {
  clientSlug: string;
  departmentSlug: string;
  areas: BatteryAreaScore[];
  resultToken?: string;
}) {
  const average = calculateBatteryScore(areas.map((a) => a.score));
  const zone = getBatteryZone(average);
  const emailMutation = useMutation({
    mutationFn: (email: string) =>
      batteryCheckApi.sendResultsEmail(clientSlug, departmentSlug, email, resultToken),
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send results'),
  });

  if (average === null || zone === null) return null;
  return (
    <main className="mx-auto min-h-screen max-w-lg bg-neutral-grey-8 pb-10">
      <BatteryResultsHero average={average} zone={zone} areas={areas} />
      <div className="mt-4">
        <BatteryScoreBreakdown areas={areas} />
      </div>
      <BatteryRechargeAccordion
        areas={areas}
        onSubmitEmail={(email) => emailMutation.mutateAsync(email).then(() => {})}
      />
    </main>
  );
}
