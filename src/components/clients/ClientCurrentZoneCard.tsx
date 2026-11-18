'use client';

import { CurrentZoneWaveIcon } from '@/components/icons';
import { ZONE_BADGE_TEXT_COLOR, ZONE_COLORS } from '@/constants/tokens';
import { resolveZoneKey } from '@/lib/battery';
import { cn } from '@/lib/utils';

export interface ClientCurrentZoneCardProps {
  zoneName?: string;
  title?: string;
  className?: string;
}

export function ClientCurrentZoneCard({
  zoneName = '',
  title = 'Current zone',
  className,
}: ClientCurrentZoneCardProps) {
  const zoneKey = resolveZoneKey(zoneName);
  const zoneBgClass = zoneKey ? ZONE_COLORS[zoneKey].bgClass : 'bg-secondary-orange-1';

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl bg-brand-green-4 pt-4 shadow-none',
        className,
      )}
    >
      <div className="body-14-medium relative z-10 text-center text-neutral-grey-1">{title}</div>

      <div className="relative mt-2 flex w-full flex-col items-center justify-end">
        <CurrentZoneWaveIcon className="h-[90px] w-full" />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span
            className={cn(
              'body-14-bold inline-block rounded-full px-5 py-1.5 shadow-[0px_0px_0px_2px_#EBD34399]',
              zoneBgClass,
            )}
            style={{ color: ZONE_BADGE_TEXT_COLOR }}
          >
            {zoneName || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClientCurrentZoneCard;
