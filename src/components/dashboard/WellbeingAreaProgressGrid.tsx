import { BaseCard, BaseTrend } from '@/components/base';
import { BoltIcon, HeartIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { WellbeingItemData } from '@/types';
import { AREA_BADGE, AREA_BAR_COLORS, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';

export interface WellbeingAreaProgressGridProps {
  items: WellbeingItemData[];
  previousMonthLabel?: string | null;
  className?: string;
}

function TrendIndicator({ value, label }: { value: number | null; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <BaseTrend value={value} />
      <span className="body-14-medium text-neutral-grey-2">{label}</span>
    </span>
  );
}

function AreaProgressRow({
  item,
  previousMonthLabel,
}: {
  item: WellbeingItemData;
  previousMonthLabel?: string | null;
}) {
  const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
  const barColor = AREA_BAR_COLORS[item.area] ?? 'bg-brand-green-2';
  const badgeBg = AREA_BADGE[item.area] ?? 'bg-neutral-grey-7';
  const iconColor = AREA_COLOR[item.area];
  const displayScore =
    item.score === null || item.score === undefined ? null : Math.round(item.score);

  return (
    <div className="flex w-full flex-col py-2">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              badgeBg,
            )}
          >
            <Icon size={20} color={iconColor} aria-hidden="true" />
          </div>
          <span className="body-16-bold text-neutral-grey-1">{item.label ?? item.area}</span>
        </div>
        <div className="flex items-center gap-1 text-neutral-grey-1">
          <span className="body-18-bold leading-none">{displayScore ?? '—'}</span>
          <BoltIcon size={14} aria-hidden="true" />
        </div>
      </div>

      <div className={cn('h-1.5 w-full overflow-hidden rounded-full', badgeBg)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(100, Math.max(0, displayScore ?? 0))}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-4">
        <TrendIndicator
          value={item.vsPreviousMonth}
          label={previousMonthLabel ? `vs ${previousMonthLabel}` : 'vs previous'}
        />
        <TrendIndicator value={item.vsFirstCheck} label="since first check" />
      </div>
    </div>
  );
}

export function WellbeingAreaProgressGrid({
  items,
  previousMonthLabel,
  className,
}: WellbeingAreaProgressGridProps) {
  if (!items || items.length === 0) {
    return <BaseCard title="Wellbeing areas" isEmpty className={className} />;
  }

  return (
    <div className={cn('grid w-full grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2', className)}>
      {items.map((item) => (
        <AreaProgressRow key={item.area} item={item} previousMonthLabel={previousMonthLabel} />
      ))}
    </div>
  );
}
