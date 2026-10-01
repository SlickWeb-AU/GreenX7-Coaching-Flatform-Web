'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { BaseLoading } from '@/components/base';
import { LiveDashboardHeader } from '@/components/dashboard/LiveDashboardHeader';
import { LiveSummaryPanel } from '@/components/dashboard/LiveSummaryPanel';
import { TeamBatteryCard } from '@/components/dashboard/TeamBatteryCard';
import { PresentationMobileWarning } from '@/components/presentation/PresentationMobileWarning';
import { MONTH_NAMES } from '@/constants';
import { useBatteryLive } from '@/features/battery-check';
import { resolveLiveLogoUrl, resolveLiveNames, resolvePeriodLabel } from '@/lib/live';

function LiveDashboardContent() {
  const { clientSlug, departmentSlug } = useParams<{
    clientSlug: string;
    departmentSlug: string;
  }>();
  const { data, score, items, isLoading } = useBatteryLive(clientSlug, departmentSlug);

  if (isLoading && !data) {
    return <BaseLoading message="Loading live dashboard..." fullScreen />;
  }

  const { clientName, departmentName } = resolveLiveNames(data, clientSlug, departmentSlug);
  const clientLogoUrl = resolveLiveLogoUrl(data);
  const periodLabel = resolvePeriodLabel(data);
  const previousMonthLabel = data?.period?.month
    ? MONTH_NAMES[(data.period.month - 2 + 12) % 12]
    : null;
  const dashboardTitle = `${clientName.toUpperCase()} — LIVE DASHBOARD`;

  return (
    <>
      <PresentationMobileWarning
        title="Open this dashboard on a desktop"
        description="Live Dashboard is designed for desktop screens. Copy this link and open on a larger screen for the best viewing experience."
        badgeLabel="Live Dashboard"
        presentationTitle={dashboardTitle}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        copyButtonText="Copy dashboard link"
      />

      <div className="hidden min-h-screen w-full flex-col justify-between bg-brand-green-2 lg:flex">
        <LiveDashboardHeader periodLabel={periodLabel} />

        <main className="mx-auto grid w-full max-w-1440 flex-1 grid-cols-1 content-center items-center gap-y-8 px-6 py-6 md:px-10 lg:grid-cols-[1fr_2fr] lg:gap-x-10 lg:gap-y-10 xl:gap-x-16 xl:px-[120px] 2xl:gap-x-20">
          <LiveSummaryPanel
            clientName={clientName}
            clientLogoUrl={clientLogoUrl}
            departmentName={departmentName}
            score={score}
            zoneLabel={data?.zone?.label}
            participantCount={data?.participantCount}
            changeVsPreviousMonth={data?.vsPrevious?.change}
            changeVsFirstCheck={data?.vsFirstCheck?.change}
            previousMonthLabel={previousMonthLabel}
          />
          <TeamBatteryCard score={score} items={items} previousMonthLabel={previousMonthLabel} />
        </main>

        <footer className="w-full border-t border-white/10 px-10 py-2 text-left">
          <span className="body-16-regular text-white/60">
            Results update as participant responses are submitted.
          </span>
        </footer>
      </div>
    </>
  );
}

export default function LiveDashboardPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading live dashboard..." fullScreen />}>
      <LiveDashboardContent />
    </Suspense>
  );
}
