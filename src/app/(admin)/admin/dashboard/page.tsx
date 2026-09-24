'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import { BaseButton, BaseHeader, BaseLoading, BaseSelectInside } from '@/components/base';
import { ExportIcon } from '@/components/icons';
import { get } from '@/lib/axios';

import { BatteryScoreBanner } from '@/features/admin-dashboard/BatteryScoreBanner';
import { HistoricalTrendChart } from '@/features/admin-dashboard/HistoricalTrendChart';
import { PlatformPerformanceBar } from '@/features/admin-dashboard/PlatformPerformanceBar';
import { WellbeingGrid } from '@/features/admin-dashboard/WellbeingGrid';
import { buildDashboardQuery } from '@/features/admin-dashboard/query';
import type { AdminDashboardDto } from '@/features/admin-dashboard/types';
import {
  DASHBOARD_INDUSTRY_OPTIONS,
  DASHBOARD_MONTH_OPTIONS,
  DASHBOARD_YEAR_OPTIONS,
  FIXED_WELLBEING_AREAS,
  FIXED_ZONES,
} from '@/constants/dashboard';

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const year = Number(searchParams.get('year')) || new Date().getFullYear();
  const industry = searchParams.get('industry') || 'ALL';

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const query = buildDashboardQuery({ month, year, industry });
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-dashboard', month, year, industry],
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
    return (
      <>
        <BaseHeader title="Dashboard" />
        <BaseLoading message="Loading dashboard..." fullScreen={false} />
      </>
    );
  }

  return (
    <>
      <BaseHeader
        title="Dashboard"
        actions={
          <>
            <BaseSelectInside
              label="Month"
              value={String(month)}
              options={DASHBOARD_MONTH_OPTIONS}
              onChange={(v) => setParam('month', v)}
            />
            <BaseSelectInside
              label="Year"
              value={String(year)}
              options={DASHBOARD_YEAR_OPTIONS}
              onChange={(v) => setParam('year', v)}
            />
            <BaseSelectInside
              label="Industry"
              value={industry}
              options={DASHBOARD_INDUSTRY_OPTIONS}
              onChange={(v) => setParam('industry', v)}
            />
            <BaseButton
              variant="secondary"
              pill
              size="medium"
              className="border-neutral-grey-5 text-brand-green-2 hover:text-brand-green-2"
              startIcon={<ExportIcon aria-hidden />}
              onClick={() => window.print()}
            >
              Export
            </BaseButton>
          </>
        }
      />
      <div className="mb-8">
        <BatteryScoreBanner
          overview={overview}
          industryName={industry !== 'ALL' ? industry : null}
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
    <Suspense fallback={<BaseLoading message="Loading dashboard..." fullScreen={false} />}>
      <DashboardContent />
    </Suspense>
  );
}
