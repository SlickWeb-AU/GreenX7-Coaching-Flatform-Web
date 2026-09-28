'use client';

import { BatteryIcon } from '@/components/icons';
import { cn, formatNumber, formatScoreToPercent } from '@/lib/utils';

import type { DashboardOverviewDto } from '@/types';

export function BatteryScoreBanner({
  overview,
  industryName,
  industryCount,
}: {
  overview?: DashboardOverviewDto | null;
  industryName?: string | null;
  industryCount?: number | null;
}) {
  const score = formatScoreToPercent(overview?.averageBatteryScore);
  const rawChange = overview?.change ?? null;
  const change = rawChange !== null && rawChange !== undefined ? Math.round(rawChange) : null;
  const isPositive = (change ?? 0) >= 0;
  const hasChange = change !== null && change !== undefined;
  const clientCount = overview?.clientCount ?? null;
  const participantCount = overview?.participantCount ?? null;
  const departmentCount = overview?.departmentCount ?? null;
  const industryLabel = industryName || `${formatNumber(industryCount)} Industries`;
  const clientLabel = industryName ? `Clients in ${industryName}` : 'Total Clients';

  return (
    <div className="rounded-2xl bg-brand-green-2 p-6 text-white shadow-none">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div className="body-14-bold mb-2 text-white/80">Average Battery Score</div>
          <div className="mb-4 flex items-center gap-4">
            <BatteryIcon percentage={score ?? 0} aria-hidden="true" />
            <div className="flex items-stretch gap-1">
              <span className="heading-48-bold leading-none text-white">{score ?? '—'}</span>
              <span className="self-start text-3xl font-bold leading-none text-white">%</span>
              <span className="body-16-medium self-end leading-none text-white">/100</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'body-14-bold rounded-[99px] px-1 text-white',
                hasChange && !isPositive ? 'bg-secondary-red-4' : 'bg-secondary-green-4',
              )}
            >
              {hasChange ? (isPositive ? `+${change}%` : `${change}%`) : '—'}
            </span>
            <span className="body-14-medium text-white/60">from previous period</span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/20 pt-6 lg:col-span-7 lg:border-l lg:border-t-0 lg:pt-0">
          <div className="flex h-full flex-col justify-end gap-2 px-4 lg:px-6">
            <div className="body-14-medium min-h-[20px] text-white/60">{industryLabel}</div>
            <div className="body-32-bold text-white">{formatNumber(clientCount)}</div>
            <div className="body-16-medium text-white/80">{clientLabel}</div>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 border-l border-white/20 px-4 lg:px-6">
            <div className="body-32-bold text-white">{formatNumber(participantCount)}</div>
            <div className="body-16-medium text-white/80">Participants</div>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 border-l border-white/20 px-4 lg:px-6">
            <div className="body-32-bold text-white">{formatNumber(departmentCount)}</div>
            <div className="body-16-medium text-white/80">Departments</div>
          </div>
        </div>
      </div>
    </div>
  );
}
