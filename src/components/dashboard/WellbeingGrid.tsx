'use client';

import { AnimatedNumber, BaseCard, BaseTrend } from '@/components/base';
import { BoltIcon } from '@/components/icons';
import {
  AREA_BADGE,
  AREA_BAR_COLORS,
  AREA_COLOR,
  AREA_ICON_MAP,
  FIXED_WELLBEING_AREAS,
} from '@/constants/dashboard';
import { useAnimationTrigger } from '@/hooks/useAnimationTrigger';
import { cn, formatScoreToPercent } from '@/lib/utils';

import type { DashboardWellbeingAreaDto } from '@/types';

function getAreaKey(area: string): string {
  const norm = area.toLowerCase();
  return (
    Object.keys(AREA_ICON_MAP).find((k) => k.toLowerCase() === norm) ??
    FIXED_WELLBEING_AREAS[0].area
  );
}

function WellbeingGridItem({ item, active }: { item: DashboardWellbeingAreaDto; active: boolean }) {
  const areaKey = getAreaKey(item.area);
  const score = formatScoreToPercent(item.score);
  const rawChange =
    item.vsPrevious?.changePercent ?? item.vsPrevious?.change ?? item.change ?? null;
  const change = rawChange !== null && rawChange !== undefined ? Math.round(rawChange) : null;
  const Icon = AREA_ICON_MAP[areaKey] ?? AREA_ICON_MAP[FIXED_WELLBEING_AREAS[0].area];

  return (
    <div className="flex flex-col bg-white p-3">
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
            <div className="body-16-bold text-neutral-grey-1">{item.label}</div>
            <BaseTrend value={change} active={active} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-neutral-grey-1">
          <AnimatedNumber value={score} active={active} className="body-16-bold" />
          <BoltIcon aria-hidden="true" />
        </div>
      </div>
      <div
        className={cn(
          'h-2 w-full overflow-hidden rounded-full',
          AREA_BADGE[areaKey] ?? 'bg-neutral-grey-7',
        )}
      >
        <div
          className={cn(
            'linear h-full rounded-full transition-all duration-[3000ms]',
            AREA_BAR_COLORS[areaKey] ?? 'bg-brand-green-2',
          )}
          style={{ width: active ? `${Math.min(100, Math.max(0, score ?? 0))}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export function WellbeingGrid({
  areas,
  title = 'Average by Battery Area',
  className,
  active: controlledActive,
}: {
  areas?: DashboardWellbeingAreaDto[];
  title?: string;
  className?: string;
  active?: boolean;
}) {
  const active = useAnimationTrigger([areas], controlledActive);

  if (!areas || areas.length === 0) {
    return <BaseCard title={title} isEmpty className={className} />;
  }

  return (
    <BaseCard title={title} className={className}>
      <div className="grid grid-cols-1 gap-px bg-neutral-grey-7 lg:grid-cols-2 xl:grid-cols-4">
        {areas.map((item) => (
          <WellbeingGridItem key={item.area} item={item} active={active} />
        ))}
      </div>
    </BaseCard>
  );
}
