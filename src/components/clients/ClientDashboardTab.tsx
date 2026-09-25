'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

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

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_TREND_DATA = [
  { year: 2026, month: 1, score: 62, label: 'Jan' },
  { year: 2026, month: 2, score: 63, label: 'Feb' },
  { year: 2026, month: 3, score: 65, label: 'Mar' },
  { year: 2026, month: 4, score: 68, label: 'Apr' },
  { year: 2026, month: 5, score: 67, label: 'May' },
  { year: 2026, month: 6, score: 71, label: 'Jun' },
];

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
  participantCount = 182,
  batteryScore = 68,
  className,
}: ClientDashboardTabProps) {
  const [selectedMonth, setSelectedMonth] = useState('7'); // July
  const [selectedYear, setSelectedYear] = useState('2026');

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

  const effectiveScore = data?.batteryScore ?? batteryScore ?? 68;
  const effectiveZoneName = data?.zone?.name ?? 'Function Zone';
  const effectiveParticipants = data?.participantCount ?? participantCount;
  const effectiveTrend =
    data?.historicalTrend && data.historicalTrend.length > 0
      ? data.historicalTrend.map((t) => ({
          year: t.year,
          month: t.month,
          score: t.score ?? 0,
          label: t.label,
        }))
      : DEFAULT_TREND_DATA;

  const wellbeingItems = mapWellbeingAreas(data?.wellbeingAreas);
  const firstCheckLabel = data?.firstCheck?.label ?? 'Jan 2026';

  return (
    <div className={`flex flex-col gap-6 ${className ?? ''}`}>
      {/* Row 1: 4 Summary / KPI / Filter Cards */}
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
        {/* Card 1: Battery Score */}
        <div className="lg:col-span-6">
          <ClientBatteryCard
            score={effectiveScore}
            periodLabel={`${currentMonthName} ${selectedYear}`}
            changeVsLastMonth={data?.vsPrevious?.change ?? 3}
            lastMonthLabel={`${previousMonthName} ${selectedYear}`}
            changeVsFirstCheck={data?.vsFirstCheck?.change ?? -1}
            firstCheckLabel={data?.firstCheck ? `${firstCheckLabel}` : 'February 2026'}
            className="h-full"
          />
        </div>

        {/* Card 2: Current Zone */}
        <div className="lg:col-span-2">
          <ClientCurrentZoneCard zoneName={effectiveZoneName} className="h-full" />
        </div>

        {/* Card 3: Month/Year Selector */}
        <div className="lg:col-span-2">
          <ClientPeriodFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="h-full"
          />
        </div>

        {/* Card 4: Participants Count */}
        <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 shadow-none lg:col-span-2">
          <div className="body-32-bold text-brand-green-2">{effectiveParticipants}</div>
          <div className="body-14-medium text-neutral-grey-3">Participants</div>
        </div>
      </div>

      {/* Row 2: Deep Dive Cards (Wellbeing areas & Historical trend) */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        {/* Wellbeing Areas */}
        <div className="lg:col-span-6">
          <ClientWellbeingCard
            items={wellbeingItems}
            previousMonthLabel={previousMonthName}
            className="h-full"
          />
        </div>

        {/* Historical Trend Chart */}
        <div className="lg:col-span-6">
          <HistoricalTrendChart
            title="Historical trend"
            data={effectiveTrend}
            lineColor="#E58A3C"
            dotColor="#E58A3C"
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
