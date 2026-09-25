'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { BaseTag } from '@/components/base';
import { cn } from '@/lib/utils';

export interface DepartmentLiveDataCardProps {
  participantCount?: number;
  dashboardHref?: string;
  className?: string;
}

export function DepartmentLiveDataCard({
  participantCount = 0,
  dashboardHref = '#',
  className,
}: DepartmentLiveDataCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between rounded-2xl border-4 border-brand-green-4 bg-white p-3 text-center shadow-none',
        className,
      )}
    >
      {/* Top cluster: Live data badge + Participant count */}
      <div className="flex flex-col items-center">
        <div className="mb-[14px]">
          <BaseTag variant="green" className="gap-2 px-2.5 py-1 text-secondary-green-4">
            <span
              className="relative flex h-2 w-2 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green-3 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green-3 shadow-live-dot" />
            </span>
            <span>LIVE DATA</span>
          </BaseTag>
        </div>

        <div className="body-14-bold flex flex-col items-center justify-center text-center text-neutral-grey-1">
          <span>{participantCount} participants</span>
          <span>received</span>
        </div>
      </div>

      {/* Bottom cluster: Divider & Open dashboard link */}
      <div className="flex w-full flex-col items-center">
        <div className="w-full border-t border-neutral-grey-6" />
        <div className="mt-3">
          <Link
            href={dashboardHref}
            className="body-14-bold inline-flex items-center gap-1 text-brand-green-2 transition-colors hover:underline"
          >
            <span>Open dashboard</span>
            <ExternalLink size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DepartmentLiveDataCard;
