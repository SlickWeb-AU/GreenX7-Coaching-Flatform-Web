import { BatteryWheelChart } from '@/components/dashboard/BatteryWheelChart';
import { BoltIcon, HeartIcon } from '@/components/icons';
import { AREA_BADGE, AREA_BAR_COLORS, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { cn } from '@/lib/utils';
import type { BatteryAreaScore } from '@/types/battery';

export interface BatteryScoreBreakdownProps {
  areas: BatteryAreaScore[];
  average?: number | null;
}

export function BatteryScoreBreakdown({ areas, average }: BatteryScoreBreakdownProps) {
  return (
    <div className="flex w-full flex-col rounded-[20px] bg-white p-6 text-neutral-grey-1 shadow-none">
      <h3 className="heading-24-bold mb-2 block text-[#005943]">Score breakdown</h3>

      <div className="mb-2 flex justify-center">
        <BatteryWheelChart
          score={average ?? null}
          items={areas.map((a) => ({
            area: a.area,
            label: a.area,
            score: a.score,
            vsPreviousMonth: null,
            vsFirstCheck: null,
          }))}
          size={256}
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-grey-6/40 pt-4">
        {areas.map((item) => {
          const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
          const barColor = AREA_BAR_COLORS[item.area] ?? 'bg-brand-green-2';
          const badgeBg = AREA_BADGE[item.area] ?? 'bg-neutral-grey-7';
          const iconColor = AREA_COLOR[item.area];
          const itemScore =
            item.score === null || item.score === undefined ? null : Math.round(item.score);
          const label = item.area === 'Physical' ? 'Physical health' : item.area;

          return (
            <div key={item.area} className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                      badgeBg,
                    )}
                  >
                    <Icon size={12} color={iconColor} aria-hidden="true" />
                  </div>
                  <span className="body-16-medium text-neutral-grey-1">{label}</span>
                </div>
                <div className="flex items-center gap-1 text-[16px] font-black leading-none text-neutral-grey-1">
                  <span>{itemScore ?? '—'}</span>
                  <BoltIcon size={14} aria-hidden="true" />
                </div>
              </div>

              <div className={cn('h-2 w-full overflow-hidden rounded-full', badgeBg)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-500', barColor)}
                  style={{ width: `${Math.min(100, Math.max(0, (itemScore ?? 0) * 10))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
