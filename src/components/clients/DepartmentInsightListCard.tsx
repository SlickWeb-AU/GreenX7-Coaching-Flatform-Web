'use client';

import type { ComponentType, SVGProps } from 'react';

import { BaseCard } from '@/components/base';
import { cn } from '@/lib/utils';

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
  titleColorClass = 'text-brand-green-2',
  items,
  className,
}: DepartmentInsightListCardProps) {
  return (
    <BaseCard
      className={cn('flex flex-col justify-start p-6', className)}
      title={<div className={cn('heading-20-bold', titleColorClass)}>{title}</div>}
    >
      <div className="flex flex-col gap-3 pt-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <div className="body-14-medium text-neutral-grey-2">
                <span>{item.label}: </span>
                <span className="body-14-bold text-neutral-grey-1">{item.score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}

export default DepartmentInsightListCard;
