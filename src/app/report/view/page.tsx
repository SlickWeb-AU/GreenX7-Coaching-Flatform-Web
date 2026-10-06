'use client';

import { Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BaseButton, BaseLoading } from '@/components/base';
import { ClientBatteryCard } from '@/components/clients/ClientBatteryCard';
import { ClientCurrentZoneCard } from '@/components/clients/ClientCurrentZoneCard';
import { ClientPeriodFilter } from '@/components/clients/ClientPeriodFilter';
import { ClientWellbeingCard } from '@/components/clients/ClientWellbeingCard';
import { HistoricalTrendChart } from '@/components/dashboard';
import { MONTH_NAMES } from '@/constants';
import { CHART_COLORS } from '@/constants/tokens';
import { reportApi } from '@/features/report';
import { useExportPdf } from '@/hooks/useExportPdf';
import { toApiError } from '@/lib/api-error';
import { reportPasswordKey, reportSessionKey } from '@/lib/report-auth';
import { cn, resolveImageUrl } from '@/lib/utils';
import type { ClientDashboardDto, DepartmentDashboardDto } from '@/types';
import type { ReportContentDto } from '@/types/reports';

/**
 * Màn 17 — báo cáo gửi khách, mở bằng token + mật khẩu.
 *
 * Bố cục như dashboard khách hàng (màn 05) nhưng không có menu quản trị: logo
 * công ty ở giữa, một tab Overall + một tab cho mỗi phòng ban. Đổi tháng/năm là
 * gọi lại /view với `period`; Export PDF xuất đúng tab + kỳ đang xem.
 *
 * Chênh lệch hiển thị theo % (changePercent), khớp với file PDF của màn này.
 */

const OVERALL = 'overall';

export default function ReportViewPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading report..." fullScreen />}>
      <ReportViewContent />
    </Suspense>
  );
}

function readSession(token: string): ReportContentDto | null {
  if (!token || typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(reportSessionKey(token));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ReportContentDto;
    // Phiên lưu từ bản cũ của trang (dạng dữ liệu khác) thì coi như chưa mở khoá
    return Array.isArray(parsed?.departments) ? parsed : null;
  } catch {
    return null;
  }
}

function ReportViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { exporting, exportPdf } = useExportPdf();

  // Đọc sessionStorage SAU khi mount: đọc ngay lúc render thì HTML máy chủ (không
  // có sessionStorage) và trình duyệt lệch nhau -> lỗi hydration React #418.
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<ReportContentDto | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [tab, setTab] = useState<string>(OVERALL);
  const [loadingPeriod, setLoadingPeriod] = useState(false);

  useEffect(() => {
    const saved = readSession(token);
    setContent(saved);
    setPassword(sessionStorage.getItem(reportPasswordKey(token)));
    setTab(saved?.overall ? OVERALL : (saved?.departments[0]?.departmentId ?? OVERALL));
    setReady(true);
  }, [token]);

  useEffect(() => {
    if (ready && (!token || !content)) {
      router.replace(
        token ? `/report/password?token=${encodeURIComponent(token)}` : '/report/password',
      );
    }
  }, [ready, token, content, router]);

  const tabs = useMemo(() => {
    if (!content) return [];
    return [
      ...(content.overall ? [{ key: OVERALL, label: 'Overall' }] : []),
      ...content.departments.map((d) => ({ key: d.departmentId, label: d.departmentName })),
    ];
  }, [content]);

  const activeTab = tabs.some((t) => t.key === tab) ? tab : (tabs[0]?.key ?? OVERALL);
  const data: ClientDashboardDto | DepartmentDashboardDto | null = !content
    ? null
    : activeTab === OVERALL
      ? content.overall
      : (content.departments.find((d) => d.departmentId === activeTab) ?? null);

  if (!content || !data) {
    return <BaseLoading message="Loading report..." fullScreen />;
  }

  const month = content.periodMonth;
  const year = content.periodYear;
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const periodKey = `${year}-${String(month).padStart(2, '0')}`;

  const changePeriod = async (nextMonth: string, nextYear: string) => {
    if (!password) {
      router.push(`/report/password?token=${encodeURIComponent(token)}`);
      return;
    }
    const period = `${nextYear}-${String(Number(nextMonth)).padStart(2, '0')}`;
    if (period === periodKey) return;
    setLoadingPeriod(true);
    try {
      const next = await reportApi.viewReport(token, password, period);
      sessionStorage.setItem(reportSessionKey(token), JSON.stringify(next));
      setContent(next);
    } catch (e) {
      toast.error(toApiError(e).message);
    } finally {
      setLoadingPeriod(false);
    }
  };

  const handleExport = () => {
    if (!password) {
      // Phiên mở báo cáo cũ (trước khi có nút xuất) chưa lưu mật khẩu: nhập lại
      router.push(`/report/password?token=${encodeURIComponent(token)}`);
      return;
    }
    void exportPdf(`/reports/${token}/pdf`, {
      method: 'post',
      data: {
        password,
        period: periodKey,
        ...(activeTab === OVERALL ? {} : { departmentId: activeTab }),
      },
      requiresAuth: false,
      fallbackName: `${content.businessName} Report.pdf`,
    });
  };

  const logo = resolveImageUrl(content.darkLogoUrl);
  const wellbeingItems = data.wellbeingAreas.map((a) => ({
    area: a.label || a.area,
    label: a.label,
    score: a.score ?? 0,
    vsPreviousMonth: a.vsPrevious?.changePercent ?? null,
    vsFirstCheck: a.vsFirstCheck?.changePercent ?? null,
  }));
  // Tháng chưa có bài nộp (score null) bỏ khỏi biểu đồ — vẽ thành 0% là sai số liệu
  const trend = data.historicalTrend
    .filter((t) => t.score !== null)
    .map((t) => ({ year: t.year, month: t.month, label: t.label, score: t.score as number }));

  return (
    <div className="min-h-screen bg-neutral-grey-8">
      <header className="flex h-[78px] items-center bg-brand-green-1 px-6 md:px-[167px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/greenx7-logo-light.svg" alt="GreenX7" className="h-10 w-auto" />
      </header>

      <main className="mx-auto max-w-[1666px] px-6 pb-16 pt-12 md:px-[167px]">
        <div className="mb-10 flex items-center justify-center">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={content.businessName} className="h-[72px] w-auto object-contain" />
          ) : (
            <h1 className="heading-48-bold text-neutral-grey-1">{content.businessName}</h1>
          )}
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-grey-6">
          <div className="flex gap-8" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={t.key === activeTab}
                onClick={() => setTab(t.key)}
                className={cn(
                  'body-16-bold -mb-px border-b-2 pb-3 transition-colors',
                  t.key === activeTab
                    ? 'border-brand-green-2 text-brand-green-2'
                    : 'border-transparent text-neutral-grey-2 hover:text-neutral-grey-1',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <BaseButton
            variant="secondary"
            pill
            className="mb-2"
            startIcon={<Download size={16} aria-hidden />}
            loading={exporting}
            onClick={handleExport}
          >
            Export PDF
          </BaseButton>
        </div>

        <div
          className={cn('flex flex-col gap-6 transition-opacity', loadingPeriod && 'opacity-60')}
        >
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ClientBatteryCard
                score={data.batteryScore}
                periodLabel={`${MONTH_NAMES[month - 1]} ${year}`}
                changeVsLastMonth={data.vsPrevious?.changePercent ?? null}
                lastMonthLabel={`${MONTH_NAMES[prevMonth - 1]} ${prevYear}`}
                changeVsFirstCheck={data.vsFirstCheck?.changePercent ?? null}
                firstCheckLabel={
                  data.firstCheck
                    ? `${MONTH_NAMES[data.firstCheck.month - 1]} ${data.firstCheck.year}`
                    : null
                }
                className="h-full"
              />
            </div>
            <div className="lg:col-span-2">
              <ClientCurrentZoneCard
                zoneName={data.zone?.label ?? data.zone?.name}
                className="h-full"
              />
            </div>
            <div className="lg:col-span-2">
              <ClientPeriodFilter
                selectedMonth={String(month)}
                onMonthChange={(m) => void changePeriod(m, String(year))}
                selectedYear={String(year)}
                onYearChange={(y) => void changePeriod(String(month), y)}
                className="h-full"
              />
            </div>
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 lg:col-span-2">
              <div className="body-32-bold text-brand-green-2">{data.participantCount}</div>
              <div className="body-14-medium text-neutral-grey-3">Participants</div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ClientWellbeingCard
                items={wellbeingItems}
                previousMonthLabel={MONTH_NAMES[prevMonth - 1]}
                deltaVariant="pill"
                className="h-full"
              />
            </div>
            <div className="lg:col-span-6">
              <HistoricalTrendChart
                title="Historical trend"
                data={trend}
                lineColor={CHART_COLORS.trendLine}
                dotColor={CHART_COLORS.trendLine}
                footerNote={
                  data.firstCheck ? (
                    <div className="body-14-medium flex items-center gap-2 text-neutral-grey-2">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full bg-brand-green-2"
                        aria-hidden="true"
                      />
                      First valid check: {MONTH_NAMES[data.firstCheck.month - 1].slice(0, 3)}{' '}
                      {data.firstCheck.year}
                    </div>
                  ) : undefined
                }
              />
            </div>
          </div>
        </div>

        <p className="body-14-medium mt-12 text-center text-neutral-grey-3">
          © {new Date().getFullYear()} GreenX7. Confidential wellbeing report.
        </p>
      </main>
    </div>
  );
}
