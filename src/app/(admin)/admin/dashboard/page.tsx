'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BaseButton, BaseHeader, BaseLoading, BaseSelectInside } from '@/components/base';
import { useExportPdf } from '@/hooks/useExportPdf';
import { toApiError } from '@/lib/api-error';
import { calculateAverageBatteryScore, cn } from '@/lib/utils';

import {
  BatteryScoreBanner,
  HistoricalTrendChart,
  PlatformPerformanceBar,
  WellbeingGrid,
} from '@/components/dashboard';
import { dashboardApi } from '@/features/admin-dashboard';
import { settingsApi } from '@/features/admin-settings';
import { buildDashboardQuery } from '@/lib/dashboard';
import { ALL_FILTER_VALUE, FIXED_WELLBEING_AREAS, FIXED_ZONES } from '@/constants';
import {
  clampMonthToAvailableRange,
  clampYearToAvailableRange,
  getAvailableMonthOptions,
  getAvailableYearOptions,
  sortIndustryOptions,
} from '@/lib/period';
import { queryKeys } from '@/lib/query-client';
import { mergeSearchParams } from '@/lib/search-params';

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const year = Number(searchParams.get('year')) || new Date().getFullYear();
  const industry = searchParams.get('industry') || ALL_FILTER_VALUE;

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = mergeSearchParams(searchParams.toString(), { [key]: value });
      if (next === null) return;
      router.replace(next ? `${pathname}?${next}` : pathname);
    },
    [pathname, router, searchParams],
  );

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
    return sortIndustryOptions([{ value: ALL_FILTER_VALUE, label: 'All Industries' }, ...list]);
  }, [industriesQuery.data]);

  const selectedIndustryLabel = useMemo(() => {
    if (industry === ALL_FILTER_VALUE) return null;
    return industryOptions.find((opt) => opt.value === industry)?.label ?? null;
  }, [industry, industryOptions]);

  const query = buildDashboardQuery({ month, year, industry });
  const { exporting, exportPdf } = useExportPdf();
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: queryKeys.adminDashboard.metrics(month, year, industry),
    queryFn: () => dashboardApi.getDashboard(query),
    placeholderData: keepPreviousData,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(toApiError(error).message);
    }
  }, [error]);

  const overview = useMemo(() => {
    let avgBatteryScore = data?.averageBatteryScore ?? data?.overview?.averageBatteryScore ?? null;

    if (avgBatteryScore === null && data?.wellbeingAreas && data.wellbeingAreas.length > 0) {
      avgBatteryScore = calculateAverageBatteryScore(data.wellbeingAreas.map((a) => a.score));
    }

    return {
      averageBatteryScore: avgBatteryScore,
      change:
        data?.vsPrevious?.changePercent ??
        data?.vsPrevious?.change ??
        data?.overview?.change ??
        null,
      clientCount: data?.clientCount ?? data?.overview?.clientCount ?? null,
      participantCount: data?.participantCount ?? data?.overview?.participantCount ?? null,
      departmentCount: data?.departmentCount ?? data?.overview?.departmentCount ?? null,
      industryCount: data?.industryCount ?? data?.overview?.industryCount ?? null,
    };
  }, [data]);

  const wellbeingAreas = useMemo(() => {
    const apiAreaMap = new Map(
      (data?.wellbeingAreas ?? []).map((item) => [
        item.area.toUpperCase(),
        {
          score: item.score ?? null,
          change: item.vsPrevious?.changePercent ?? item.vsPrevious?.change ?? item.change ?? null,
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
        score: match?.score ?? null,
        change: match?.change ?? null,
        vsPrevious: match?.vsPrevious,
        vsFirstCheck: match?.vsFirstCheck,
      };
    });
  }, [data?.wellbeingAreas]);

  const zoneDistribution = useMemo(() => {
    const apiZoneMap = new Map(
      (data?.zoneDistribution ?? []).map((z) => [
        z.key.toUpperCase(),
        {
          count: z.count ?? null,
          percentage: z.percentage ?? null,
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
        count: match?.count ?? null,
        percentage: match?.percentage ?? null,
        min: match?.min,
        max: match?.max,
      };
    });
  }, [data?.zoneDistribution]);

  const availablePeriods = data?.availablePeriods;

  const yearOptions = useMemo(() => getAvailableYearOptions(availablePeriods), [availablePeriods]);

  const monthOptions = useMemo(
    () => getAvailableMonthOptions(year, availablePeriods),
    [year, availablePeriods],
  );

  const handleYearChange = (newYear: string) => {
    const clampedYear = clampYearToAvailableRange(Number(newYear), availablePeriods);
    const clamped = clampMonthToAvailableRange(month, clampedYear, availablePeriods);
    const next = mergeSearchParams(searchParams.toString(), {
      year: String(clampedYear),
      month: String(clamped),
    });
    if (next === null) return;
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  useEffect(() => {
    if (!availablePeriods) return;
    const clampedYear = clampYearToAvailableRange(year, availablePeriods);
    const clamped = clampMonthToAvailableRange(month, clampedYear, availablePeriods);
    if (clampedYear !== year || clamped !== month) {
      const next = mergeSearchParams(searchParams.toString(), {
        year: String(clampedYear),
        month: String(clamped),
      });
      if (next === null) return;
      router.replace(next ? `${pathname}?${next}` : pathname);
    }
  }, [availablePeriods, month, year, pathname, router, searchParams]);

  const [trendYear, setTrendYear] = useState<number>(() => year);
  useEffect(() => {
    setTrendYear((prev) => (prev === year ? prev : year));
  }, [year]);

  const historicalTrend = useMemo(
    () => (data?.historicalTrend ?? []).filter((point) => point.year === trendYear),
    [data?.historicalTrend, trendYear],
  );

  if (isLoading && !data) {
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
              options={monthOptions}
              onChange={(v) => setParam('month', v)}
            />
            <BaseSelectInside
              label="Year"
              placeholder="Select year"
              value={String(year)}
              options={yearOptions}
              onChange={handleYearChange}
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
              startIcon={<Download size={16} aria-hidden />}
              loading={exporting}
              onClick={() =>
                exportPdf(`/exports/dashboard.pdf?${query}`, {
                  fallbackName: `GreenX7 Dashboard ${month}-${year}.pdf`,
                })
              }
            >
              Export PDF
            </BaseButton>
          </>
        }
      />
      <div
        className={cn(
          'relative transition-opacity duration-200',
          isFetching && 'pointer-events-none opacity-60',
        )}
      >
        <div className="mb-10">
          <BatteryScoreBanner
            overview={overview}
            industryName={selectedIndustryLabel}
            industryCount={overview.industryCount}
          />
        </div>
        <div className="mb-4">
          <WellbeingGrid areas={wellbeingAreas} title="Average by Battery Area" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlatformPerformanceBar distribution={zoneDistribution} />
          <HistoricalTrendChart
            data={historicalTrend}
            title="Platform Historical Trend"
            selectedYear={trendYear}
            onYearChange={(y) => setTrendYear(Number(y))}
            yearOptions={yearOptions}
          />
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
