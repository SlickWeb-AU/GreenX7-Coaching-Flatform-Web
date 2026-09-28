'use client';

import type { ComponentType, SVGProps } from 'react';

import { BaseCard, BaseTrend } from '@/components/base';
import {
  BoltIcon,
  CloudIcon,
  FriendshipsIcon,
  FunIcon,
  HeartIcon,
  MindsetIcon,
  NutritionIcon,
  PurposeIcon,
  RelationshipsIcon,
} from '@/components/icons';
import { DASHBOARD_COLORS } from '@/constants/tokens';
import { cn, formatScoreToPercent } from '@/lib/utils';

export interface WellbeingItemData {
  area: string;
  label?: string;
  score: number;
  vsPreviousMonth: number;
  vsFirstCheck: number;
}

const AREA_BADGE: Record<string, string> = {
  Physical: 'bg-secondary-orange-2',
  Sleep: 'bg-secondary-cyan-2',
  Nutrition: 'bg-secondary-green-2',
  Fun: 'bg-secondary-yellow-2',
  Mindset: 'bg-secondary-violet-2',
  Friendships: 'bg-secondary-rose-2',
  Relationships: 'bg-secondary-red-2',
  Purpose: 'bg-secondary-teal-2',
};

const AREA_COLOR: Record<string, string> = {
  Physical: DASHBOARD_COLORS.secondary.orange1,
  Sleep: DASHBOARD_COLORS.secondary.cyan1,
  Nutrition: DASHBOARD_COLORS.secondary.green1,
  Fun: DASHBOARD_COLORS.secondary.yellow1,
  Mindset: DASHBOARD_COLORS.secondary.violet1,
  Friendships: DASHBOARD_COLORS.secondary.rose1,
  Relationships: DASHBOARD_COLORS.secondary.red1,
  Purpose: DASHBOARD_COLORS.secondary.teal1,
};

const AREA_BAR: Record<string, string> = {
  Physical: 'bg-secondary-orange-1',
  Sleep: 'bg-secondary-cyan-1',
  Nutrition: 'bg-secondary-green-1',
  Fun: 'bg-secondary-yellow-1',
  Mindset: 'bg-secondary-violet-1',
  Friendships: 'bg-secondary-rose-1',
  Relationships: 'bg-secondary-red-1',
  Purpose: 'bg-secondary-teal-1',
};

const AREA_ICON_MAP: Record<
  string,
  { Icon: ComponentType<{ size?: number | string; color?: string } & SVGProps<SVGSVGElement>> }
> = {
  Physical: { Icon: HeartIcon },
  Sleep: { Icon: CloudIcon },
  Nutrition: { Icon: NutritionIcon },
  Fun: { Icon: FunIcon },
  Mindset: { Icon: MindsetIcon },
  Friendships: { Icon: FriendshipsIcon },
  Relationships: { Icon: RelationshipsIcon },
  Purpose: { Icon: PurposeIcon },
};

export interface ClientWellbeingCardProps {
  items?: WellbeingItemData[];
  previousMonthLabel?: string;
  className?: string;
}

export function ClientWellbeingCard({
  items,
  previousMonthLabel = '',
  className,
}: ClientWellbeingCardProps) {
  if (!items || items.length === 0) {
    return <BaseCard title="Wellbeing areas" isEmpty className={cn('flex flex-col', className)} />;
  }

  return (
    <BaseCard title="Wellbeing areas" className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="body-12-bold mb-2 flex items-center justify-between text-neutral-grey-3">
        <div className="flex-1">Area</div>
        <div className="flex items-center gap-3">
          <div className="w-20 text-center">
            {previousMonthLabel ? `vs. ${previousMonthLabel}` : 'vs. Previous'}
          </div>
          <div className="w-24 text-center">vs. First Check</div>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const areaKey = item.area;
          const { Icon } = AREA_ICON_MAP[areaKey] ?? AREA_ICON_MAP.Physical;
          const displayScore = formatScoreToPercent(item.score);

          return (
            <div key={item.area} className="flex items-center justify-between">
              {/* Area Info & Progress bar */}
              <div className="flex flex-1 items-center gap-4 pr-12">
                {/* 24px icon + label (gap 8px) */}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                      AREA_BADGE[areaKey] ?? 'bg-neutral-grey-7',
                    )}
                  >
                    <Icon size={14} color={AREA_COLOR[areaKey]} aria-hidden="true" />
                  </div>

                  <div className="body-14-bold w-24 shrink-0 text-neutral-grey-1">
                    {item.label ?? item.area}
                  </div>
                </div>

                {/* Progress bar + Score cluster (gap 8px) */}
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-grey-7">
                    <div
                      className={cn('h-full rounded-full', AREA_BAR[areaKey] ?? 'bg-brand-green-2')}
                      style={{ width: `${Math.min(100, Math.max(0, displayScore ?? 0))}%` }}
                    />
                  </div>

                  {/* Score + Bolt icon (gap 4px, size 10) */}
                  <div className="body-14-bold flex shrink-0 items-center gap-1 text-neutral-grey-1">
                    <span>{displayScore ?? '—'}</span>
                    <BoltIcon size={10} aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Comparison columns (gap 12px) */}
              <div className="flex items-center gap-3">
                <div className="flex w-20 items-center justify-center">
                  <BaseTrend value={item.vsPreviousMonth} />
                </div>

                <div className="flex w-24 items-center justify-center">
                  <BaseTrend value={item.vsFirstCheck} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}

export default ClientWellbeingCard;
