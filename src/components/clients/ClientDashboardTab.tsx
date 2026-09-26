'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { MONTH_NAMES } from '@/constants';
import { CHART_COLORS } from '@/constants/tokens';
import { clientsApi } from '@/features/admin-clients';
import { queryKeys } from '@/lib/query-client';
import type { AreaScoreDto } from '@/types';
import { HistoricalTrendChart } from '@/components/dashboard';

import { ClientBatteryCard } from './ClientBatteryCard';
import { ClientCurrentZoneCard } from './ClientCurrentZoneCard';
import { ClientPeriodFilter } from './ClientPeriodFilter';
import { ClientWellbeingCard, type WellbeingItemData } from './ClientWellbeingCard';

export interface ClientDashboardTabProps {
  clientId: string;
  participantCount?: number;
  batteryScore?: number | null;
  className?: string;
}

function mapWellbeingAreas(areas?: AreaScoreDto[]): WellbeingItemData[] | undefined {
  if (!areas || areas.length === 0) return undefined;
  return areas.map((a) => ({
    area: a.label || a.area,
    score: a.score ?? 0,
    vsPreviousMonth: a.vsPrevious?.change ?? 0,
    vsFirstCheck: a.vsFirstCheck?.change ?? 0,
  }));
}

export function ClientDashboardTab({
  clientId,
  participantCount,
  batteryScore,
  className,
}: ClientDashboardTabProps) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const { data } = useQuery({
    queryKey: queryKeys.adminClients.dashboard(clientId, selectedYear, selectedMonth),
    queryFn: () =>
      clientsApi.getDashboard(clientId, {
        year: Number(selectedYear),
        month: Number(selectedMonth),
        trendMonths: 6,
      }),
    retry: false,
  });

  const monthIdx = Math.max(0, Math.min(11, Number(selectedMonth) - 1));
  const currentMonthName = MONTH_NAMES[monthIdx];
  const prevMonthIdx = (monthIdx - 1 + 12) % 12;
  const previousMonthName = MONTH_NAMES[prevMonthIdx];

  const effectiveScore = data?.batteryScore ?? batteryScore ?? null;
  const effectiveZoneName = data?.zone?.label ?? data?.zone?.name;
  const effectiveParticipants = data?.participantCount ?? participantCount ?? null;
  const effectiveTrend =
    data?.historicalTrend && data.historicalTrend.length > 0
      ? data.historicalTrend.map((t) => ({
          year: t.year,
          month: t.month,
          score: t.score ?? 0,
          label: t.label,
        }))
      : [];

  const wellbeingItems = mapWellbeingAreas(data?.wellbeingAreas);
  const firstCheckLabel = data?.firstCheck?.label;

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`}>
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ClientBatteryCard
            score={effectiveScore}
            periodLabel={`${currentMonthName} ${selectedYear}`}
            changeVsLastMonth={data?.vsPrevious?.change ?? null}
            lastMonthLabel={`${previousMonthName} ${selectedYear}`}
            changeVsFirstCheck={data?.vsFirstCheck?.change ?? null}
            firstCheckLabel={firstCheckLabel}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-2">
          <ClientCurrentZoneCard zoneName={effectiveZoneName} className="h-full" />
        </div>

        <div className="lg:col-span-2">
          <ClientPeriodFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="h-full"
          />
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-none lg:col-span-2">
          <div className="body-32-bold text-brand-green-2">
            {effectiveParticipants !== null ? effectiveParticipants : '—'}
          </div>
          <div className="body-14-medium text-neutral-grey-3">Participants</div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ClientWellbeingCard
            items={wellbeingItems}
            previousMonthLabel={previousMonthName}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-6">
          <HistoricalTrendChart
            title="Historical trend"
            data={effectiveTrend}
            lineColor={CHART_COLORS.trendLine}
            dotColor={CHART_COLORS.trendLine}
            footerNote={
              <div className="body-14-medium flex items-center gap-2 text-neutral-grey-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-full bg-brand-green-2"
                  aria-hidden="true"
                />
                <span>First valid check: {firstCheckLabel}</span>
              </div>
            }
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
