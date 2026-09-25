'use client';

import { BaseCard } from '@/components/base';
import { cn } from '@/lib/utils';
import { ZONE_COLORS } from '@/constants/tokens';

import type { DashboardZoneDistributionDto } from '@/types';

const ZONE_BAR: Record<string, string> = {
  Thrive: 'bg-secondary-green-1',
  Momentum: 'bg-secondary-yellow-1',
  Function: 'bg-secondary-orange-1',
  Survive: 'bg-secondary-red-1',
};

function getZoneKey(key: string): keyof typeof ZONE_COLORS {
  const norm = key.toLowerCase();
  const found = (Object.keys(ZONE_COLORS) as (keyof typeof ZONE_COLORS)[]).find(
    (k) => k.toLowerCase() === norm,
  );
  return found ?? 'Function';
}

export function PlatformPerformanceBar({
  distribution,
  className,
}: {
  distribution?: DashboardZoneDistributionDto[];
  className?: string;
}) {
  if (!distribution || distribution.length === 0) {
    return (
      <BaseCard
        title="Platform Performance"
        subtitle="Score range distribution this period."
        isEmpty
        className={cn('flex h-full min-h-[260px] flex-col', className)}
      />
    );
  }

  return (
    <BaseCard
      title="Platform Performance"
      subtitle="Score range distribution this period."
      className={cn('flex h-full flex-col', className)}
    >
      <div>
        <div className="mb-4 flex h-[22px] w-full overflow-hidden rounded-md bg-neutral-grey-7">
          {distribution.map((item) => {
            const zoneKey = getZoneKey(item.key);
            const zone = ZONE_COLORS[zoneKey];
            const percentage = item.percentage ?? null;
            if (!zone || percentage === null || percentage <= 0) return null;
            return (
              <div
                key={item.key}
                className={cn('h-full', ZONE_BAR[zoneKey])}
                style={{ width: `${percentage}%` }}
                title={`${zone.label}: ${percentage}%`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-1">
        {distribution.map((item) => {
          const zoneKey = getZoneKey(item.key);
          const zone = ZONE_COLORS[zoneKey];
          if (!zone) return null;
          return (
            <div key={item.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 shrink-0 rounded-[2px]', ZONE_BAR[zoneKey])} />
                <span className="body-14-bold text-neutral-grey-2">{zone.label}</span>
                <span className="body-12-medium text-neutral-grey-3">{zone.range}</span>
              </div>
              <span className="body-14-bold text-neutral-grey-1">
                {item.percentage ?? '—'}
                {item.percentage !== null && item.percentage !== undefined ? '%' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}
