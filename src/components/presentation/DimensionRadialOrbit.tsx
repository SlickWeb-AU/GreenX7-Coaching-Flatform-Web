import { EightAreasBatterySvg, EightAreasHaloSvg } from '@/components/icons';
import { ORBIT_ITEMS } from '@/constants/presentation';
import { DASHBOARD_COLORS } from '@/constants/tokens';
import { cn } from '@/lib/utils';

export function DimensionRadialOrbit({ className }: { className?: string }) {
  const radius = 220;

  return (
    <div className={cn('relative flex h-[580px] w-[580px] items-center justify-center', className)}>
      <EightAreasHaloSvg className="pointer-events-none absolute h-[490px] w-[490px] select-none" />

      <EightAreasBatterySvg className="relative z-10 h-[165px] w-[109px] select-none drop-shadow-2xl" />

      {ORBIT_ITEMS.map((item) => {
        const rad = ((item.angle - 90) * Math.PI) / 180;
        const x = Math.round(radius * Math.cos(rad));
        const y = Math.round(radius * Math.sin(rad));
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="dimension-orbit-badge absolute z-20 flex h-[136.5px] w-[136.5px] items-center justify-center rounded-full shadow-2xl drop-shadow-2xl transition-transform hover:scale-110"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div
              className={cn(
                'flex h-full w-full items-center justify-center rounded-full text-white',
                item.bg,
              )}
            >
              <Icon size={70} color={DASHBOARD_COLORS.neutral.whiteSolid} aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
