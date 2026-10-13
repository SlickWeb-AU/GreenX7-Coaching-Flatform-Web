'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import type { BatterySubmitResult } from '@/types/battery';
import { BreakdownDecorWheel } from '@/components/icons';
import { BatteryEmailCard } from './BatteryEmailCard';
import { BatteryRechargeAccordion } from './BatteryRechargeAccordion';
import { BatteryResultsHero } from './BatteryResultsHero';
import { BatteryScoreBreakdown } from './BatteryScoreBreakdown';

export interface BatteryResultsViewProps {
  result: BatterySubmitResult;
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
}

export function BatteryResultsView({
  result,
  clientName,
  departmentName,
  clientLogoUrl,
}: BatteryResultsViewProps) {
  const emailMutation = useMutation({
    mutationFn: (email: string) => batteryCheckApi.sendResultsEmail(email, result.resultToken),
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send results'),
  });

  return (
    <main className="min-h-screen w-full overflow-x-clip text-neutral-grey-1">
      <section className="w-full bg-brand-green-2">
        <div className="mx-auto w-full max-w-[1256px]">
          <BatteryResultsHero
            average={result.batteryScore}
            zoneKey={result.zoneKey}
            zoneLabel={result.zoneLabel}
            zoneDescription={result.zoneDescription}
            introMessage={result.introMessage}
            strongestAreas={result.strongestAreas}
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
          />
        </div>
      </section>

      {/* Score Breakdown Section */}
      <section className="relative w-full overflow-hidden bg-brand-green-2">
        <div className="relative z-10 mx-auto w-full max-w-[1256px]">
          <div className="pointer-events-none absolute left-0 right-0 top-32 z-0 select-none lg:hidden">
            <BreakdownDecorWheel className="h-auto w-full" />
          </div>
          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            <BatteryScoreBreakdown areas={result.areaScores} average={result.batteryScore} />
          </div>
        </div>
      </section>

      {/* Recharge Tips Section */}
      <section className="w-full bg-forest-light">
        <div className="mx-auto w-full max-w-full md:max-w-none lg:max-w-2xl xl:max-w-3xl">
          <div className="px-10 pb-10 pt-4 md:px-10 md:pt-2 lg:pt-10">
            <BatteryRechargeAccordion tips={result.rechargeTips} />
          </div>
        </div>
      </section>

      <section className="w-full bg-brand-green-1">
        <div className="mx-auto w-full max-w-full md:max-w-none lg:max-w-2xl xl:max-w-3xl">
          <BatteryEmailCard
            onSubmitEmail={async (email) => {
              await emailMutation.mutateAsync(email);
            }}
            isPending={emailMutation.isPending}
            disabled={!result.resultToken}
          />
        </div>
      </section>
    </main>
  );
}
