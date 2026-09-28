'use client';

import type { ComponentType, SVGProps } from 'react';

import { cn, formatScoreToPercent } from '@/lib/utils';

export interface InsightItem {
  key: string;
  label: string;
  score: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface DepartmentInsightListCardProps {
  title: string;
  titleColorClass?: string;
  items: InsightItem[];
  className?: string;
}

export function DepartmentInsightListCard({
  title,
  titleColorClass = 'text-secondary-green-4',
  items,
  className,
}: DepartmentInsightListCardProps) {
  return (
    <div className={cn('flex flex-col rounded-2xl bg-white p-6 shadow-none', className)}>
      {/* Title Header with bottom border 12px below title (within card padding) */}
      <div className="border-b border-neutral-grey-6 pb-3">
        <h3 className={cn('body-20-bold', titleColorClass)}>{title}</h3>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-3 pt-4">
        {items.map((item) => {
          const Icon = item.icon;
          const displayScore = formatScoreToPercent(item.score);
          return (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="body-16-medium text-neutral-grey-1">{item.label}</span>
              </div>
              <span className="body-16-bold text-neutral-grey-1">{displayScore ?? '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DepartmentInsightListCard;
