import { BatteryWheelChart } from '@/components/dashboard/BatteryWheelChart';
import { BoltIcon } from '@/components/icons';
import { AREA_BAR_COLORS, AREA_ICON_MAP } from '@/constants/dashboard';
import { cn } from '@/lib/utils';
import type { BatteryAreaScore } from '@/types/battery';

export function BatteryScoreBreakdown({ areas }: { areas: BatteryAreaScore[] }) {
  return (
    <section className="mx-4 rounded-2xl border border-neutral-grey-7 bg-white p-6">
      <h2 className="body-16-bold text-neutral-grey-1">Score breakdown</h2>
      <div className="mt-4 flex justify-center">
        <BatteryWheelChart
          items={areas.map((a) => ({
            area: a.area,
            label: a.area,
            score: a.score,
            vsPreviousMonth: null,
            vsFirstCheck: null,
          }))}
          size={200}
        />
      </div>
      <ul className="mt-4 space-y-3">
        {areas.map((a) => {
          const Icon = AREA_ICON_MAP[a.area];
          return (
            <li key={a.area}>
              <div className="flex items-center justify-between">
                <span className="body-14-medium flex items-center gap-2 text-neutral-grey-1">
                  {Icon && <Icon size={20} />}
                  {a.area}
                </span>
                <span className="body-14-bold flex items-center gap-1 text-neutral-grey-1">
                  {a.score} <BoltIcon size={14} />
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-neutral-grey-7">
                <div
                  className={cn('h-full rounded-full', AREA_BAR_COLORS[a.area])}
                  style={{ width: `${(a.score ?? 0) * 10}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
