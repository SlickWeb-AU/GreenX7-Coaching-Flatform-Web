'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import { BaseButton, BaseHeader, BaseLoading, BaseSelectInside } from '@/components/base';
import { ExportIcon } from '@/components/icons';
import { get } from '@/lib/axios';

import {
  BatteryScoreBanner,
  HistoricalTrendChart,
  PlatformPerformanceBar,
  WellbeingGrid,
} from '@/components/dashboard';
import { settingsApi } from '@/features/admin-settings';
import { buildDashboardQuery } from '@/lib/dashboard';
import { queryKeys } from '@/lib/query-client';
import type { AdminDashboardDto } from '@/types';
import {
  ALL_FILTER_VALUE,
  DASHBOARD_MONTH_OPTIONS,
  DASHBOARD_YEAR_OPTIONS,
  FIXED_WELLBEING_AREAS,
  FIXED_ZONES,
} from '@/constants';

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const year = Number(searchParams.get('year')) || new Date().getFullYear();
  const industry = searchParams.get('industry') || ALL_FILTER_VALUE;

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const industriesQuery = useQuery({
    queryKey: queryKeys.industries.all,
    queryFn: settingsApi.getIndustries,
    retry: false,
  });

  const industryOptions = useMemo(() => {
    const list = (industriesQuery.data ?? []).map((ind) => ({
      value: ind.id,
      label: ind.name,
    }));
    return [{ value: ALL_FILTER_VALUE, label: 'All Industries' }, ...list];
  }, [industriesQuery.data]);

  const selectedIndustryLabel = useMemo(() => {
    if (industry === ALL_FILTER_VALUE) return null;
    return industryOptions.find((opt) => opt.value === industry)?.label ?? null;
  }, [industry, industryOptions]);

  const query = buildDashboardQuery({ month, year, industry });
  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminDashboard.metrics(month, year, industry),
    queryFn: async () => {
      try {
        return await get<AdminDashboardDto>(`/dashboard?${query}`);
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const overview = useMemo(
    () => ({
      averageBatteryScore: data?.averageBatteryScore ?? data?.overview?.averageBatteryScore ?? 0,
      change:
        data?.vsPrevious?.changePercent ?? data?.vsPrevious?.change ?? data?.overview?.change ?? 0,
      clientCount: data?.clientCount ?? data?.overview?.clientCount ?? 0,
      participantCount: data?.participantCount ?? data?.overview?.participantCount ?? 0,
      departmentCount: data?.departmentCount ?? data?.overview?.departmentCount ?? 0,
      industryCount: data?.industryCount ?? data?.overview?.industryCount ?? 0,
    }),
    [data],
  );

  const wellbeingAreas = useMemo(() => {
    if (!data?.wellbeingAreas || data.wellbeingAreas.length === 0) return [];
    const apiAreaMap = new Map(
      data.wellbeingAreas.map((item) => [
        item.area.toUpperCase(),
        {
          score: item.score ?? 0,
          change: item.vsPrevious?.changePercent ?? item.vsPrevious?.change ?? item.change ?? 0,
          vsPrevious: item.vsPrevious,
          vsFirstCheck: item.vsFirstCheck,
        },
      ]),
    );
    return FIXED_WELLBEING_AREAS.map((def) => {
      const match = apiAreaMap.get(def.area.toUpperCase());
      return {
        area: def.area,
        label: def.label,
        score: match?.score ?? 0,
        change: match?.change ?? 0,
        vsPrevious: match?.vsPrevious,
        vsFirstCheck: match?.vsFirstCheck,
      };
    });
  }, [data?.wellbeingAreas]);

  const zoneDistribution = useMemo(() => {
    if (!data?.zoneDistribution || data.zoneDistribution.length === 0) return [];
    const apiZoneMap = new Map(
      data.zoneDistribution.map((z) => [
        z.key.toUpperCase(),
        {
          count: z.count ?? 0,
          percentage: z.percentage ?? 0,
          min: z.min,
          max: z.max,
        },
      ]),
    );
    return FIXED_ZONES.map((def) => {
      const match = apiZoneMap.get(def.key.toUpperCase());
      return {
        key: def.key,
        label: def.label,
        count: match?.count ?? 0,
        percentage: match?.percentage ?? 0,
        min: match?.min,
        max: match?.max,
      };
    });
  }, [data?.zoneDistribution]);

  const historicalTrend = data?.historicalTrend ?? [];

  if ((isLoading || isFetching) && !data) {
    return <BaseLoading message="Loading dashboard..." fullScreen />;
  }

  return (
    <>
      <BaseHeader
        title="Dashboard"
        actions={
          <>
            <BaseSelectInside
              label="Month"
              placeholder="Select month"
              value={String(month)}
              options={DASHBOARD_MONTH_OPTIONS}
              onChange={(v) => setParam('month', v)}
            />
            <BaseSelectInside
              label="Year"
              placeholder="Select year"
              value={String(year)}
              options={DASHBOARD_YEAR_OPTIONS}
              onChange={(v) => setParam('year', v)}
            />
            <BaseSelectInside
              label="Industry"
              placeholder="Select industry"
              value={industry}
              options={industryOptions}
              onChange={(v) => setParam('industry', v)}
            />
            <BaseButton
              variant="secondary"
              pill
              startIcon={<ExportIcon aria-hidden />}
              onClick={() => window.print()}
            >
              Export PDF
            </BaseButton>
          </>
        }
      />
      <div className="mb-8">
        <BatteryScoreBanner
          overview={overview}
          industryName={selectedIndustryLabel}
          industryCount={overview.industryCount}
        />
      </div>
      <div className="mb-4">
        <WellbeingGrid areas={wellbeingAreas} title="Average by Battery Area" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mb-4 lg:mb-0 lg:mr-4">
          <PlatformPerformanceBar distribution={zoneDistribution} />
        </div>
        <div>
          <HistoricalTrendChart data={historicalTrend} title="Platform Historical Trend" />
        </div>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading dashboard..." fullScreen />}>
      <DashboardContent />
    </Suspense>
  );
}
