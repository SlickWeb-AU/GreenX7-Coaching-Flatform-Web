'use client';

import { Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';

import { BaseButton, BaseHeader, BaseLoading } from '@/components/base';
import {
  BatteryScoreBanner,
  HistoricalTrendChart,
  PlatformPerformanceBar,
  WellbeingGrid,
} from '@/components/dashboard';
import { reportSessionKey } from '@/lib/report-auth';
import type { ReportViewDto } from '@/types/reports';

export default function ReportViewPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading report..." fullScreen />}>
      <ReportViewContent />
    </Suspense>
  );
}

function ReportViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const report = useMemo<ReportViewDto | null>(() => {
    if (!token || typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(reportSessionKey(token));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ReportViewDto;
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (!token || !report) {
      router.replace(token ? `/report/login?token=${encodeURIComponent(token)}` : '/report/login');
    }
  }, [token, report, router]);

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h2 className="heading-28-bold mb-4 text-neutral-grey-1">Report Not Found</h2>
        <p className="body-14-medium mb-6 text-neutral-grey-3">
          This report may have expired or requires password verification.
        </p>
        <BaseButton onClick={() => router.push(`/report/login?token=${encodeURIComponent(token)}`)}>
          Go to Password Login
        </BaseButton>
      </div>
    );
  }

  const overview = {
    averageBatteryScore: report.averageBatteryScore,
    change: report.vsPrevious?.changePercent ?? report.vsPrevious?.change ?? report.change ?? 0,
    clientCount: 0,
    participantCount: 0,
    departmentCount: 0,
    industryCount: 0,
  };

  const formattedAreas = (report.wellbeingAreas ?? []).map((areaItem) => ({
    area: areaItem.area,
    label: 'label' in areaItem && areaItem.label ? areaItem.label : areaItem.area,
    score: areaItem.score ?? 0,
    change:
      'vsPrevious' in areaItem && areaItem.vsPrevious
        ? (areaItem.vsPrevious.changePercent ?? areaItem.vsPrevious.change ?? 0)
        : 'change' in areaItem && typeof areaItem.change === 'number'
          ? areaItem.change
          : 0,
  }));

  return (
    <div className="min-h-screen bg-neutral-grey-8 p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <BaseHeader
          title={`${report.clientName || 'Wellbeing'} Report`}
          actions={
            <BaseButton
              variant="secondary"
              pill
              startIcon={<Download size={16} aria-hidden />}
              onClick={() => window.print()}
            >
              Export PDF
            </BaseButton>
          }
        />

        <div className="mb-8">
          <BatteryScoreBanner
            overview={overview}
            industryName={report.departmentName || report.clientName}
          />
        </div>

        <div className="mb-8">
          <WellbeingGrid areas={formattedAreas} title="Wellbeing Areas Breakdown" />
        </div>

        {(report.zoneDistribution || report.historicalTrend) && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {report.zoneDistribution && (
              <PlatformPerformanceBar distribution={report.zoneDistribution} />
            )}
            {report.historicalTrend && (
              <HistoricalTrendChart data={report.historicalTrend} title="Historical Trend" />
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="body-14-medium text-neutral-grey-3">
            © {new Date().getFullYear()} GreenX7 Platform. Confidential Wellbeing Report.
          </p>
        </div>
      </div>
    </div>
  );
}
