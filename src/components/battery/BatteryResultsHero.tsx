import { BatteryIcon, Gx7BadgeLogo } from '@/components/icons';
import { ZONE_COLORS } from '@/constants/tokens';
import { getStrongestAreas } from '@/lib/battery';
import type { BatteryAreaScore, BatteryZone } from '@/types/battery';

export function BatteryResultsHero({
  average,
  zone,
  areas,
}: {
  average: number;
  zone: BatteryZone;
  areas: BatteryAreaScore[];
}) {
  const strongest = getStrongestAreas(areas);
  const zoneStyle = ZONE_COLORS[zone];
  return (
    <section className="bg-white px-6 py-8 text-center">
      <div className="flex justify-center">
        <Gx7BadgeLogo className="text-brand-green-1" />
      </div>
      <p className="body-16-regular mt-4 text-neutral-grey-2">Well done 👍</p>
      <p className="body-16-medium text-neutral-grey-2">Your battery score:</p>
      <div className="mt-2 flex justify-center">
        <BatteryIcon percentage={average} />
      </div>
      <p className="heading-64-bold text-brand-green-2">{`${average}%`}</p>
      <p className="heading-24-bold mt-2 text-neutral-grey-1">
        You are in the <span style={{ color: zoneStyle?.color }}>{zone.toLowerCase()} zone</span>
      </p>
      <h2 className="body-16-bold mt-6 text-neutral-grey-1">Strongest areas</h2>
      <ul className="mt-3 flex justify-center gap-4">
        {strongest.map((s) => (
          <li key={s.area} className="body-14-medium text-neutral-grey-2">
            {s.area}
          </li>
        ))}
      </ul>
    </section>
  );
}
