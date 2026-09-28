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

import type { DashboardWellbeingAreaDto } from '@/types';

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

interface AreaIconConfig {
  Icon: ComponentType<{ size?: number | string; color?: string } & SVGProps<SVGSVGElement>>;
}

const AREA_ICON_MAP: Record<string, AreaIconConfig> = {
  Physical: { Icon: HeartIcon },
  Sleep: { Icon: CloudIcon },
  Nutrition: { Icon: NutritionIcon },
  Fun: { Icon: FunIcon },
  Mindset: { Icon: MindsetIcon },
  Friendships: { Icon: FriendshipsIcon },
  Relationships: { Icon: RelationshipsIcon },
  Purpose: { Icon: PurposeIcon },
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

function getAreaKey(area: string): string {
  const norm = area.toLowerCase();
  return Object.keys(AREA_ICON_MAP).find((k) => k.toLowerCase() === norm) ?? 'Physical';
}

export function WellbeingGrid({
  areas,
  title = 'Average by Battery Area',
  className,
}: {
  areas?: DashboardWellbeingAreaDto[];
  title?: string;
  className?: string;
}) {
  if (!areas || areas.length === 0) {
    return <BaseCard title={title} isEmpty className={className} />;
  }

  return (
    <BaseCard title={title} className={className}>
      <div className="grid grid-cols-1 gap-px bg-neutral-grey-7 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((item) => {
          const areaKey = getAreaKey(item.area);
          const score = formatScoreToPercent(item.score);
          const rawChange =
            item.vsPrevious?.changePercent ?? item.vsPrevious?.change ?? item.change ?? null;
          const change =
            rawChange !== null && rawChange !== undefined ? Math.round(rawChange) : null;
          const { Icon } = AREA_ICON_MAP[areaKey] ?? AREA_ICON_MAP.Physical;

          return (
            <div key={item.area} className="flex flex-col bg-white p-3">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      AREA_BADGE[areaKey] ?? 'bg-neutral-grey-7',
                    )}
                  >
                    <Icon size={20} color={AREA_COLOR[areaKey]} aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="body-16-bold leading-snug text-neutral-grey-1">
                      {item.label}
                    </div>
                    <BaseTrend value={change} />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-neutral-grey-1">
                  <span className="body-16-bold">{score ?? '—'}</span>
                  <BoltIcon aria-hidden="true" />
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-grey-7">
                <div
                  className={cn('h-full rounded-full', AREA_BAR[areaKey] ?? 'bg-brand-green-2')}
                  style={{ width: `${Math.min(100, Math.max(0, score ?? 0))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}
