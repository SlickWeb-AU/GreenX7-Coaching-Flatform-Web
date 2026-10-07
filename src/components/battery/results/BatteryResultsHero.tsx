import { ClientDepartmentHeader } from '@/components/clients';
import { BatteryIcon, CardDecorBlob, Gx7BadgeLogo, HeartIcon } from '@/components/icons';
import { AREA_BADGE, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { ZONE_COLORS } from '@/constants/tokens';
import { normalizeAreaLabel, resolveZoneKey } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryAreaResultDto } from '@/types/battery';

export interface BatteryResultsHeroProps {
  average: number;
  zoneKey: string;
  zoneLabel: string;
  zoneHeadline: string;
  zoneDescription: string;
  introMessage: string;
  strongestAreas: BatteryAreaResultDto[];
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
}

export function BatteryResultsHero({
  average,
  zoneKey,
  zoneLabel,
  zoneHeadline,
  zoneDescription,
  introMessage,
  strongestAreas,
  clientName,
  departmentName,
  clientLogoUrl,
}: BatteryResultsHeroProps) {
  const displayScore = Math.round(average);
  const resolvedKey = resolveZoneKey(zoneKey) ?? resolveZoneKey(zoneLabel);
  const zoneColor = resolvedKey ? ZONE_COLORS[resolvedKey].color : '#63D556';

  return (
    <div className="relative w-full overflow-hidden bg-brand-green-1 text-white">
      <CardDecorBlob />
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <Gx7BadgeLogo className="text-white" width={48} height={46} />
          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="right"
            logoWrapperClassName="h-8"
            logoClassName="h-[32px] w-auto object-contain"
            departmentClassName="body-14-medium text-white/90"
          />
        </div>

        <div className="px-[40px]">
          <div className="mt-4 flex flex-col items-center text-center">
            <span className="body-24-bold text-[#CFE4CA]">{introMessage}</span>
            <span className="body-24-bold text-[#CFE4CA]">Your battery score:</span>
            <div className="relative mt-2 flex items-center justify-center">
              <BatteryIcon
                percentage={displayScore}
                className="h-[80px] w-auto"
                aria-hidden="true"
              />
              <span className="body-32-black absolute inset-0 flex items-center justify-center pr-3 leading-none text-white drop-shadow-sm">
                {displayScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-[100px] w-full bg-brand-green-2 px-[40px] pb-[48px] pt-8">
          <div className="heading-40-black mb-3 leading-[1.15]">
            <span className="block text-white">{zoneHeadline || `You are in the`}</span>
            {!zoneHeadline && (
              <span className="block" style={{ color: zoneColor }}>
                {zoneLabel}
              </span>
            )}
          </div>
          <p className="body-18-medium mb-3 leading-relaxed text-[#CFE4CA]">{zoneDescription}</p>

          <span className="mb-3 block text-base font-black leading-tight text-white">
            Strongest areas
          </span>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {strongestAreas.map((item) => {
              const area = normalizeAreaLabel(item.area);
              const Icon = AREA_ICON_MAP[area] ?? HeartIcon;
              const badgeBg = AREA_BADGE[area] ?? 'bg-neutral-grey-7';
              const iconColor = AREA_COLOR[area];
              return (
                <div
                  key={item.area}
                  className="flex min-w-[88px] flex-1 flex-col items-center gap-2 rounded-xl bg-brand-green-1 px-2 py-2.5"
                >
                  <div
                    className={cn(
                      'flex h-[48px] w-[48px] items-center justify-center rounded-full',
                      badgeBg,
                    )}
                  >
                    <Icon size={24} color={iconColor} aria-hidden="true" />
                  </div>
                  <span className="body-12-bold text-center leading-tight text-white">{area}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
