'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import type { BatterySubmitResult } from '@/types/battery';
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
  const areas = result.areaScores.map((a) => ({ area: a.area, score: a.score }));

  const emailMutation = useMutation({
    mutationFn: (email: string) => batteryCheckApi.sendResultsEmail(email, result.resultToken),
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to send results'),
  });

  return (
    <main className="min-h-screen w-full overflow-x-clip text-neutral-grey-1">
      <section className="w-full bg-brand-green-2">
        <div className="mx-auto w-full max-w-md">
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

      <section className="w-full bg-forest-light">
        <div className="mx-auto w-full max-w-md">
          <div className="p-4">
            <BatteryScoreBreakdown areas={areas} average={result.batteryScore} />
          </div>

          <div className="px-[40px] pb-[40px]">
            <BatteryRechargeAccordion tips={result.rechargeTips} />
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
            disabled={!result.resultToken}
          />
        </div>
      </section>
    </main>
  );
}
