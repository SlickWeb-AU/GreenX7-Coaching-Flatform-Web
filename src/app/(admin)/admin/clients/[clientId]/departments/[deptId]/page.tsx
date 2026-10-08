'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Presentation, SlidersHorizontal } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { BaseButton, BaseLoading } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { MONTH_NAMES } from '@/constants';
import { CLIENT_STATUSES } from '@/constants/clients';
import { CHART_COLORS } from '@/constants/tokens';
import { clientsApi, useDepartmentShareLinks } from '@/features/admin-clients';
import { useExportPdf } from '@/hooks/useExportPdf';
import { queryKeys } from '@/lib/query-client';
import { toInsightItems } from '@/lib/insights';
import { normalizeUrl } from '@/lib/utils';
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
} from '@/components/clients';
import { HistoricalTrendChart } from '@/components/dashboard';
import type { AreaScoreDto, WellbeingItemData } from '@/types';

function mapWellbeingAreas(areas?: AreaScoreDto[]): WellbeingItemData[] | undefined {
  if (!areas || areas.length === 0) return undefined;
  return areas.map((a) => ({
    area: a.label || a.area,
    score: a.score ?? 0,
    vsPreviousMonth: a.vsPrevious?.change ?? 0,
    vsFirstCheck: a.vsFirstCheck?.change ?? 0,
  }));
}

export default function DepartmentDetailPage() {
  const router = useRouter();
  const params = useParams<{ clientId: string; deptId: string }>();
  const clientId = params.clientId;
  const deptId = params.deptId;

  const searchParams = useSearchParams();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    () => searchParams.get('month') || String(now.getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(
    () => searchParams.get('year') || String(now.getFullYear()),
  );
  const { exporting, exportPdf } = useExportPdf();

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
  const liveUrl = deptDashboard?.liveUrl || '';
  const presentationUrl = deptDashboard?.presentationUrl || '';

  const { data: shareLinks, isLoading: isShareLinksLoading } = useDepartmentShareLinks(
    clientId,
    deptId,
  );

  // Synchronize department header into persistent layout shell
  // Memoized so header effect only re-syncs when async URLs actually change
  const headerActions = useMemo(
    () => (
      <>
        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<SlidersHorizontal size={16} aria-hidden />}
          onClick={() => {
            router.push(`${ROUTES.admin.clientEdit(clientId)}?scrollTo=departments`, {
              scroll: false,
            });
          }}
        >
          Manage Department
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="medium"
          pill
          startIcon={<Download size={16} aria-hidden />}
          loading={exporting}
          onClick={() =>
            exportPdf(`/exports/clients/${clientId}/departments/${deptId}/dashboard.pdf`, {
              params: { month: selectedMonth, year: selectedYear, trendMonths: 6 },
              fallbackName: `${departmentName} ${selectedMonth}-${selectedYear}.pdf`,
            })
          }
        >
          Export PDF
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="medium"
          pill
          disabled={!presentationUrl}
          loading={isShareLinksLoading}
          startIcon={<Presentation size={16} />}
          onClick={() => {
            window.open(normalizeUrl(presentationUrl), '_blank', 'noopener,noreferrer');
          }}
        >
          Launch presentation
        </BaseButton>

        <ShareBatteryCheckPopover
          departmentName={departmentName}
          shareLinks={shareLinks}
          isLoading={isShareLinksLoading}
        />
      </>
    ),
    [
      clientId,
      deptId,
      departmentName,
      presentationUrl,
      router,
      shareLinks,
      isShareLinksLoading,
      exporting,
      exportPdf,
      selectedMonth,
      selectedYear,
    ],
  );

  useClientHeader({
    title: departmentName,
    breadcrumbLabel: `${departmentName} Department`,
    actions: headerActions,
  });

  if (isClientLoading || isDeptDashboardLoading) {
    return <BaseLoading message="Loading department..." fullScreen />;
  }

  const monthIdx = Math.max(0, Math.min(11, Number(selectedMonth) - 1));
  const prevMonthIdx = (monthIdx - 1 + 12) % 12;
  const previousMonthName = MONTH_NAMES[prevMonthIdx];

  const effectiveScore = deptDashboard?.batteryScore ?? department.batteryScore ?? null;
  const effectiveZone = deptDashboard?.zone?.label ?? deptDashboard?.zone?.name ?? '';
  const effectiveParticipants =
    deptDashboard?.participantCount ?? department.participantCount ?? null;
  const effectiveStrengths = toInsightItems(deptDashboard?.strengths);
  const effectiveFocus = toInsightItems(deptDashboard?.focus);
  const effectiveWellbeing = mapWellbeingAreas(deptDashboard?.wellbeingAreas);
  const effectiveTrend =
    deptDashboard?.historicalTrend && deptDashboard.historicalTrend.length > 0
      ? deptDashboard.historicalTrend.map((t) => ({
          year: t.year,
          month: t.month,
          // null = tháng chưa có bài nộp: để trống trên biểu đồ, không vẽ thành 0%
          score: t.score,
          label: t.label,
        }))
      : [];

  const openUntilLabel = deptDashboard?.openUntil
    ? `Open until ${new Date(deptDashboard.openUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-12 items-stretch gap-2">
        <div className="col-span-12 2xl:col-span-5">
          <ClientBatteryCard
            title="Current Battery Score"
            badgeText={openUntilLabel}
            score={effectiveScore}
            periodLabel={`${MONTH_NAMES[monthIdx]} ${selectedYear}`}
            changeVsLastMonth={deptDashboard?.vsPrevious?.change ?? null}
            lastMonthLabel={previousMonthName}
            changeVsFirstCheck={deptDashboard?.vsFirstCheck?.change ?? null}
            firstCheckLabel={deptDashboard?.firstCheck?.label}
            className="h-full py-4"
          />
        </div>

        <div className="col-span-4 2xl:col-span-2">
          <ClientCurrentZoneCard zoneName={effectiveZone} className="h-full" />
        </div>

        <div className="col-span-4 2xl:col-span-2">
          <DepartmentLiveDataCard
            participantCount={effectiveParticipants}
            dashboardHref={liveUrl}
            className="h-full"
          />
        </div>

        <div className="col-span-4 2xl:col-span-3">
          <ClientPeriodFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            className="h-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-12">
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
