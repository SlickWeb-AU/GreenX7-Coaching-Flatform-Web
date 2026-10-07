'use client';

import { CurrentZoneWaveIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

/**
 * Màu viên zone theo mức điểm — cùng bảng với file PDF (ZONE_STYLE bên BE).
 * Trước đây viên luôn màu cam (Function) bất kể zone nào.
 */
const ZONE_PILL: Record<string, { bg: string; fg: string; border: string }> = {
  thrive: { bg: '#9ACC63', fg: '#2F5B12', border: '#C7E3A9' },
  momentum: { bg: '#EBD343', fg: '#5C4A00', border: '#F5E68F' },
  function: { bg: '#F09E5D', fg: '#7A3A0A', border: '#F7C9A2' },
  survive: { bg: '#F56C77', fg: '#6E1219', border: '#F9A8AF' },
};

/** "Momentum Zone" / "MOMENTUM" / "Momentum" -> màu của zone đó */
function zonePill(name: string) {
  const key = Object.keys(ZONE_PILL).find((k) => name.toLowerCase().includes(k));
  return key ? ZONE_PILL[key] : null;
}

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
  const pill = zonePill(zoneName);
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
          <span
            className="body-14-bold inline-block rounded-full border-2 px-5 py-1.5"
            style={
              pill
                ? { backgroundColor: pill.bg, color: pill.fg, borderColor: pill.border }
                : { backgroundColor: '#FFFFFF', color: '#53635C', borderColor: '#DFE5E1' }
            }
          >
            {zoneName || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClientCurrentZoneCard;
