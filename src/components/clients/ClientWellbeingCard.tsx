'use client';

import { BaseCard, BaseTrend } from '@/components/base';
import { BoltIcon, HeartIcon } from '@/components/icons';
import { AREA_BADGE, AREA_BAR_COLORS, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { cn, formatScoreToPercent } from '@/lib/utils';
import type { WellbeingItemData } from '@/types';

export interface ClientWellbeingCardProps {
  items?: WellbeingItemData[];
  previousMonthLabel?: string;
  className?: string;
  /** `pill`: viên đặc "+2%" như màn báo cáo gửi khách (17); mặc định mũi tên như màn quản trị */
  deltaVariant?: 'arrow' | 'pill';
}

function DeltaPill({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) {
    return <span className="body-12-bold text-neutral-grey-3">—</span>;
  }
  return (
    <span
      className={cn(
        'body-12-bold rounded-pill px-1.5 py-0.5 text-white',
        value < 0 ? 'bg-secondary-red-4' : 'bg-secondary-green-4',
      )}
    >
      {value > 0 ? '+' : ''}
      {value}%
    </span>
  );
}

export function ClientWellbeingCard({
  items,
  previousMonthLabel = '',
  className,
  deltaVariant = 'arrow',
}: ClientWellbeingCardProps) {
  const Delta = deltaVariant === 'pill' ? DeltaPill : BaseTrend;
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
          const Icon = AREA_ICON_MAP[areaKey] ?? HeartIcon;
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
                  <div
                    className={cn(
                      'h-1.5 flex-1 overflow-hidden rounded-full',
                      AREA_BADGE[areaKey] ?? 'bg-neutral-grey-7',
                    )}
                  >
                    <div
                      className={cn(
                        'h-full rounded-full',
                        AREA_BAR_COLORS[areaKey] ?? 'bg-brand-green-2',
                      )}
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
                  <Delta value={item.vsPreviousMonth} />
                </div>

                <div className="flex w-24 items-center justify-center">
                  <Delta value={item.vsFirstCheck} />
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
