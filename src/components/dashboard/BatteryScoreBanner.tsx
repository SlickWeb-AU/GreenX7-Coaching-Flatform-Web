'use client';

import { BatteryIcon } from '@/components/icons';

import type { DashboardOverviewDto } from '@/types';

export function BatteryScoreBanner({
  overview,
  industryName,
  industryCount,
}: {
  overview?: DashboardOverviewDto | null;
  industryName?: string | null;
  industryCount?: number;
}) {
  const score = overview?.averageBatteryScore ?? 0;
  const change = overview?.change ?? 0;
  const isPositive = change >= 0;
  const clientCount = overview?.clientCount ?? 0;
  const participantCount = overview?.participantCount ?? 0;
  const departmentCount = overview?.departmentCount ?? 0;
  const industryLabel = industryName || `${industryCount ?? 0} Industries`;
  const clientLabel = industryName ? `Clients in ${industryName}` : 'Total Clients';

  return (
    <div className="rounded-2xl bg-brand-green-2 p-6 text-white shadow-none">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div className="body-14-bold mb-2 text-white/80">Average Battery Score</div>
          <div className="mb-4 flex items-center gap-4">
            <BatteryIcon percentage={score} aria-hidden="true" />
            <div className="flex items-stretch gap-1">
              <span className="heading-48-bold leading-none text-white">{score}</span>
              <span className="self-start text-3xl font-bold leading-none text-white">%</span>
              <span className="body-16-medium self-end leading-none text-white">/100</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="body-14-bold rounded-[99px] bg-secondary-green-4 px-1 text-white">
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="body-14-medium text-white/60">from previous period</span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-white/20 pt-6 lg:col-span-7 lg:border-l lg:border-t-0 lg:pt-0">
          <div className="flex h-full flex-col justify-end gap-2 px-4 lg:px-6">
            <div className="body-14-medium min-h-[20px] text-white/60">{industryLabel}</div>
            <div className="body-32-bold text-white">{clientCount}</div>
            <div className="body-16-medium text-white/80">{clientLabel}</div>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 border-l border-white/20 px-4 lg:px-6">
            <div className="body-32-bold text-white">{participantCount}</div>
            <div className="body-16-medium text-white/80">Participants</div>
          </div>
          <div className="flex h-full flex-col justify-end gap-2 border-l border-white/20 px-4 lg:px-6">
            <div className="body-32-bold text-white">{departmentCount}</div>
            <div className="body-16-medium text-white/80">Departments</div>
          </div>
        </div>
      </div>
    </div>
  );
}
