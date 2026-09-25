'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tv } from 'lucide-react';
import { useParams } from 'next/navigation';

import { BaseButton, BaseLoading } from '@/components/base';
import {
  CloudIcon,
  ExportIcon,
  FriendshipsIcon,
  FunIcon,
  HeartIcon,
  MindsetIcon,
  NutritionIcon,
  PurposeIcon,
  RelationshipsIcon,
  SlidersIcon,
} from '@/components/icons';
import { clientsApi } from '@/features/admin-clients';
import {
  ClientBatteryCard,
  ClientCurrentZoneCard,
  ClientPeriodFilter,
  ClientWellbeingCard,
  DepartmentInsightListCard,
  DepartmentLiveDataCard,
  ShareBatteryCheckPopover,
  useClient,
  useClientHeader,
  type InsightItem,
  type WellbeingItemData,
} from '@/components/clients';
import { HistoricalTrendChart } from '@/components/dashboard';
import type { AreaScoreDto } from '@/types';

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

const ICON_BY_AREA: Record<string, typeof HeartIcon> = {
  PHYSICAL: HeartIcon,
  Physical: HeartIcon,
  SLEEP: CloudIcon,
  Sleep: CloudIcon,
  NUTRITION: NutritionIcon,
  Nutrition: NutritionIcon,
  FUN: FunIcon,
  Fun: FunIcon,
  MINDSET: MindsetIcon,
  Mindset: MindsetIcon,
  FRIENDSHIPS: FriendshipsIcon,
  Friendships: FriendshipsIcon,
  RELATIONSHIPS: RelationshipsIcon,
  Relationships: RelationshipsIcon,
  PURPOSE: PurposeIcon,
  Purpose: PurposeIcon,
};

const STRENGTHS_ITEMS: InsightItem[] = [
  { key: 'friendships', label: 'Friendships', score: 73, icon: FriendshipsIcon },
  { key: 'relationships', label: 'Relationships', score: 71, icon: RelationshipsIcon },
];

const FOCUS_ITEMS: InsightItem[] = [
  { key: 'physical', label: 'Physical', score: 61, icon: HeartIcon },
  { key: 'sleep', label: 'Sleep', score: 64, icon: CloudIcon },
];

const DEFAULT_TREND_DATA = [
  { year: 2026, month: 1, score: 55, label: 'Jan' },
  { year: 2026, month: 2, score: 58, label: 'Feb' },
  { year: 2026, month: 3, score: 60, label: 'Mar' },
  { year: 2026, month: 4, score: 68, label: 'Apr' },
  { year: 2026, month: 5, score: 66, label: 'May' },
  { year: 2026, month: 6, score: 73, label: 'Jun' },
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

function mapInsightItems(items?: AreaScoreDto[], fallback: InsightItem[] = []): InsightItem[] {
  if (!items || items.length === 0) return fallback;
  return items.map((it) => ({
    key: it.area.toLowerCase(),
    label: it.label || it.area,
    score: it.score ?? 0,
    icon: ICON_BY_AREA[it.area] ?? ICON_BY_AREA[it.label] ?? HeartIcon,
  }));
}

export default function DepartmentDetailPage() {
  const params = useParams<{ clientId: string; deptId: string }>();
  const clientId = params.clientId;
  const deptId = params.deptId;

  const [selectedMonth, setSelectedMonth] = useState('7'); // July
  const [selectedYear, setSelectedYear] = useState('2026');

  // Consume client from layout context
  const { client, isLoading: isClientLoading } = useClient();

  // Fetch department full dashboard (GET /clients/{id}/departments/{childId}/dashboard)
  const { data: deptDashboard, isLoading: isDeptDashboardLoading } = useQuery({
    queryKey: ['admin-dept-dashboard', clientId, deptId, selectedYear, selectedMonth],
    queryFn: () =>
      clientsApi.getDepartmentDashboard(clientId, deptId, {
        year: Number(selectedYear),
        month: Number(selectedMonth),
        trendMonths: 6,
      }),
    retry: false,
  });

  const department = client?.departments?.find((d) => d.id === deptId) || {
    id: deptId,
    name: deptDashboard?.departmentName || 'Construction',
    status: 'Active',
    participantCount: deptDashboard?.participantCount ?? 91,
    batteryScore: deptDashboard?.batteryScore ?? 68,
  };

  const departmentName = deptDashboard?.departmentName || department.name;

  // Synchronize department header into persistent layout shell
  useClientHeader({
    title: departmentName,
    breadcrumbLabel: `${departmentName} Department`,
    actions: (
      <>
        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<SlidersIcon size={16} />}
          onClick={() => {
            // Manage department action
          }}
        >
          Manage Department
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<ExportIcon size={16} />}
          onClick={() => {
            // PDF export
          }}
        >
          Export PDF
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<Tv size={16} />}
          onClick={() => {
            if (deptDashboard?.presentationUrl) {
              window.open(deptDashboard.presentationUrl, '_blank');
            }
          }}
        >
          Launch presentation
        </BaseButton>

        <ShareBatteryCheckPopover
          departmentName={departmentName}
          shareUrl={deptDashboard?.shareUrl}
          liveUrl={deptDashboard?.liveUrl}
          presentationUrl={deptDashboard?.presentationUrl}
        />
      </>
    ),
  });

  if (isClientLoading || isDeptDashboardLoading) {
    return <BaseLoading message="Loading department..." fullScreen />;
  }

  const monthIdx = Math.max(0, Math.min(11, Number(selectedMonth) - 1));
  const prevMonthIdx = (monthIdx - 1 + 12) % 12;
  const previousMonthName = MONTH_NAMES[prevMonthIdx];

  const effectiveScore = deptDashboard?.batteryScore ?? department.batteryScore ?? 68;
  const effectiveZone = deptDashboard?.zone?.name ?? 'Function Zone';
  const effectiveParticipants =
    deptDashboard?.participantCount ?? department.participantCount ?? 91;
  const effectiveStrengths = mapInsightItems(deptDashboard?.strengths, STRENGTHS_ITEMS);
  const effectiveFocus = mapInsightItems(deptDashboard?.focus, FOCUS_ITEMS);
  const effectiveWellbeing = mapWellbeingAreas(deptDashboard?.wellbeingAreas);
  const effectiveTrend =
    deptDashboard?.historicalTrend && deptDashboard.historicalTrend.length > 0
      ? deptDashboard.historicalTrend.map((t) => ({
          year: t.year,
          month: t.month,
          score: t.score ?? 0,
          label: t.label,
        }))
      : DEFAULT_TREND_DATA;

  const openUntilLabel = deptDashboard?.openUntil
    ? `Open until ${new Date(deptDashboard.openUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
    : 'Open until 20 July';

  return (
    <div className="flex flex-col gap-6">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
        {/* Card 1: Battery Score */}
        <div className="lg:col-span-5">
          <ClientBatteryCard
            title="Current Battery Score"
            badgeText={openUntilLabel}
            score={effectiveScore}
            changeVsLastMonth={deptDashboard?.vsPrevious?.change ?? -1}
            lastMonthLabel={previousMonthName}
            changeVsFirstCheck={deptDashboard?.vsFirstCheck?.change ?? 3}
            firstCheckLabel="first check"
            className="h-full"
          />
        </div>

        {/* Card 2: Current Zone */}
        <div className="lg:col-span-2">
          <ClientCurrentZoneCard zoneName={effectiveZone} className="h-full" />
        </div>

        {/* Card 3: Live Data & Participants */}
        <div className="lg:col-span-2">
          <DepartmentLiveDataCard
            participantCount={effectiveParticipants}
            dashboardHref={deptDashboard?.liveUrl || '#'}
            className="h-full"
          />
        </div>

        {/* Card 4: Month & Year Filter */}
        <div className="lg:col-span-3">
          <ClientPeriodFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="h-full"
          />
        </div>
      </div>

      {/* Deep-Dive Insights Grid */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        {/* Left: Wellbeing areas */}
        <div className="lg:col-span-8">
          <ClientWellbeingCard
            items={effectiveWellbeing}
            previousMonthLabel={previousMonthName}
            className="h-full"
          />
        </div>

        {/* Right: Our Strengths & Our Focus */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          <DepartmentInsightListCard
            title="Our Strengths"
            titleColorClass="text-brand-green-2"
            items={effectiveStrengths}
            className="flex-1"
          />
          <DepartmentInsightListCard
            title="Our Focus"
            titleColorClass="text-secondary-orange-1"
            items={effectiveFocus}
            className="flex-1"
          />
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="w-full">
        <HistoricalTrendChart
          title="Historical trend"
          data={effectiveTrend}
          lineColor="#DF863B"
          dotColor="#DF863B"
          className="w-full"
        />
      </div>
    </div>
  );
}
