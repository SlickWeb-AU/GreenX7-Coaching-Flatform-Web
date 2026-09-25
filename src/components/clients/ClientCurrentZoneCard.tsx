'use client';

import { CurrentZoneWaveIcon } from '@/components/icons';
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
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl bg-secondary-green-2 pt-4 shadow-none',
        className,
      )}
    >
      <div className="body-14-medium relative z-10 text-center text-neutral-grey-1">{title}</div>

      <div className="relative mt-2 flex w-full flex-col items-center justify-end">
        <CurrentZoneWaveIcon className="h-[90px] w-full" />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="body-14-bold inline-block rounded-full border-2 border-[#EBD34399] bg-secondary-orange-1 px-5 py-1.5 text-[#5D5000]">
            {zoneName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClientCurrentZoneCard;
