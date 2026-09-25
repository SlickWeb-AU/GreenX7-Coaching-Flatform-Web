'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, SlidersHorizontal, Tv } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { BaseButton, BaseLoading } from '@/components/base';
import {
  CloudIcon,
  FriendshipsIcon,
  FunIcon,
  HeartIcon,
  MindsetIcon,
  NutritionIcon,
  PurposeIcon,
  RelationshipsIcon,
} from '@/components/icons';
import { ROUTES } from '@/config/routes';
import { MONTH_NAMES } from '@/constants';
import { CLIENT_STATUSES, CLIENT_TABS } from '@/constants/clients';
import { CHART_COLORS } from '@/constants/tokens';
import { clientsApi } from '@/features/admin-clients';
import { queryKeys } from '@/lib/query-client';
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
  const router = useRouter();
  const params = useParams<{ clientId: string; deptId: string }>();
  const clientId = params.clientId;
  const deptId = params.deptId;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  // Consume client from layout context
  const { client, isLoading: isClientLoading } = useClient();

  // Fetch department full dashboard (GET /clients/{id}/departments/{childId}/dashboard)
  const { data: deptDashboard, isLoading: isDeptDashboardLoading } = useQuery({
    queryKey: queryKeys.adminClients.departmentDashboard(
      clientId,
      deptId,
      selectedYear,
      selectedMonth,
    ),
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
    name: deptDashboard?.departmentName ?? 'Department',
    status: CLIENT_STATUSES.ACTIVE,
    participantCount: deptDashboard?.participantCount ?? 0,
    batteryScore: deptDashboard?.batteryScore ?? null,
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
          startIcon={<SlidersHorizontal size={16} aria-hidden />}
          onClick={() => {
            router.push(`${ROUTES.admin.clientDetail(clientId)}?tab=${CLIENT_TABS.DEPARTMENTS}`);
          }}
        >
          Manage Department
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<Download size={16} aria-hidden />}
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
          clientId={clientId}
          departmentId={deptId}
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

  const effectiveScore = deptDashboard?.batteryScore ?? department.batteryScore ?? 0;
  const effectiveZone = deptDashboard?.zone?.name ?? '';
  const effectiveParticipants = deptDashboard?.participantCount ?? department.participantCount ?? 0;
  const effectiveStrengths = mapInsightItems(deptDashboard?.strengths);
  const effectiveFocus = mapInsightItems(deptDashboard?.focus);
  const effectiveWellbeing = mapWellbeingAreas(deptDashboard?.wellbeingAreas);
  const effectiveTrend =
    deptDashboard?.historicalTrend && deptDashboard.historicalTrend.length > 0
      ? deptDashboard.historicalTrend.map((t) => ({
          year: t.year,
          month: t.month,
          score: t.score ?? 0,
          label: t.label,
        }))
      : [];

  const openUntilLabel = deptDashboard?.openUntil
    ? `Open until ${new Date(deptDashboard.openUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ClientBatteryCard
            title="Current Battery Score"
            badgeText={openUntilLabel}
            score={effectiveScore}
            periodLabel={`${MONTH_NAMES[monthIdx]} ${selectedYear}`}
            changeVsLastMonth={deptDashboard?.vsPrevious?.change ?? 0}
            lastMonthLabel={previousMonthName}
            changeVsFirstCheck={deptDashboard?.vsFirstCheck?.change ?? 0}
            firstCheckLabel={deptDashboard?.firstCheck?.label}
            className="h-full"
          />
        </div>

        <div className="lg:col-span-2">
          <ClientCurrentZoneCard zoneName={effectiveZone} className="h-full" />
        </div>

        <div className="lg:col-span-2">
          <DepartmentLiveDataCard
            participantCount={effectiveParticipants}
            dashboardHref={deptDashboard?.liveUrl || '#'}
            className="h-full"
          />
        </div>

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

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ClientWellbeingCard
            items={effectiveWellbeing}
            previousMonthLabel={previousMonthName}
            className="h-full"
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <DepartmentInsightListCard
            title="Our Strengths"
            titleColorClass="text-secondary-green-4"
            items={effectiveStrengths}
            className="flex-1"
          />
          <DepartmentInsightListCard
            title="Our Focus"
            titleColorClass="text-secondary-red-4"
            items={effectiveFocus}
            className="flex-1"
          />
        </div>
      </div>

      <div className="w-full">
        <HistoricalTrendChart
          title="Historical trend"
          data={effectiveTrend}
          lineColor={CHART_COLORS.trendLine}
          dotColor={CHART_COLORS.trendLine}
          className="w-full"
        />
      </div>
    </div>
  );
}
