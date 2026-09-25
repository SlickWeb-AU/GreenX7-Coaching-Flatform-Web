'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface DepartmentLiveDataCardProps {
  participantCount?: number;
  dashboardHref?: string;
  className?: string;
}

export function DepartmentLiveDataCard({
  participantCount = 91,
  dashboardHref = '#',
  className,
}: DepartmentLiveDataCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 rounded-2xl border-2 border-secondary-green-2 bg-white p-5 text-center shadow-none',
        className,
      )}
    >
      {/* Top: Live data badge */}
      <div className="caption-12-bold inline-flex items-center gap-1.5 rounded-full bg-secondary-green-2 px-3 py-0.5 text-secondary-green-4">
        <span className="h-2 w-2 rounded-full bg-secondary-green-4" aria-hidden="true" />
        <span>LIVE DATA</span>
      </div>

      {/* Middle: Participant count */}
      <div className="my-auto flex flex-col items-center justify-center">
        <div className="body-14-medium text-neutral-grey-1">
          <span className="heading-24-bold text-neutral-grey-1">{participantCount}</span>{' '}
          participants
        </div>
        <span className="body-12-medium text-neutral-grey-3">received</span>
      </div>

      {/* Bottom: Open dashboard link */}
      <Link
        href={dashboardHref}
        className="body-14-bold inline-flex items-center gap-1 text-brand-green-2 transition-colors hover:underline"
      >
        <span>Open dashboard</span>
        <ExternalLink size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default DepartmentLiveDataCard;
