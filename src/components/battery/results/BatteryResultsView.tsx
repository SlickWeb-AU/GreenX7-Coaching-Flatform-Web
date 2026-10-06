'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { calculateBatteryScore, getBatteryZone } from '@/lib/battery';
import type { BatteryAreaScore } from '@/types/battery';
import { BatteryEmailCard } from './BatteryEmailCard';
import { BatteryRechargeAccordion } from './BatteryRechargeAccordion';
import { BatteryResultsHero } from './BatteryResultsHero';
import { BatteryScoreBreakdown } from './BatteryScoreBreakdown';

export interface BatteryResultsViewProps {
  clientSlug: string;
  departmentSlug: string;
  areas: BatteryAreaScore[];
  resultToken?: string;
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
}

export function BatteryResultsView({
  clientSlug,
  departmentSlug,
  areas,
  resultToken,
  clientName,
  departmentName,
  clientLogoUrl,
}: BatteryResultsViewProps) {
  const average = calculateBatteryScore(areas.map((a) => a.score));
  const zone = getBatteryZone(average);

  const emailMutation = useMutation({
    mutationFn: (email: string) =>
      batteryCheckApi.sendResultsEmail(clientSlug, departmentSlug, email, resultToken),
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send results'),
  });

  if (average === null || zone === null) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2 bg-forest-light px-6 text-center">
        <h1 className="body-24-bold text-brand-green-1">Could not calculate your score</h1>
        <p className="body-14-medium text-neutral-grey-2">Please retake the Battery Check.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full text-neutral-grey-1">
      <section className="w-full bg-brand-green-1">
        <div className="mx-auto w-full max-w-md">
          <BatteryResultsHero
            average={average}
            zone={zone}
            areas={areas}
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
          />
        </div>
      </section>

      <section className="w-full bg-forest-light">
        <div className="mx-auto w-full max-w-md">
          <div className="p-4">
            <BatteryScoreBreakdown areas={areas} average={average} />
          </div>

          <div className="px-[40px] pb-[40px]">
            <BatteryRechargeAccordion areas={areas} />
          </div>
        </div>
      </section>

      <section className="w-full bg-brand-green-1">
        <div className="mx-auto w-full max-w-md">
          <BatteryEmailCard
            onSubmitEmail={async (email) => {
              await emailMutation.mutateAsync(email);
            }}
            isPending={emailMutation.isPending}
          />
        </div>
      </section>
    </main>
  );
}
