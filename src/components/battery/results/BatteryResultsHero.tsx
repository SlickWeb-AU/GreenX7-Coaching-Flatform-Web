import { ClientDepartmentHeader } from '@/components/clients';
import { BatteryIcon, Gx7BadgeLogo, HeartIcon, ResultDecorBlob } from '@/components/icons';
import { AREA_BADGE, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { ZONE_COLORS } from '@/constants/tokens';
import { normalizeAreaLabel, resolveZoneKey } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryAreaResultDto } from '@/types/battery';

export interface BatteryResultsHeroProps {
  average: number;
  zoneKey: string;
  zoneLabel: string;
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
    <div className="relative w-full bg-brand-green-2 text-white">
      {/* Background Blob behind score for mobile/tablet */}
      <ResultDecorBlob className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 lg:hidden" />

      <div className="relative flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 px-6 pt-6 md:px-10 md:pt-8">
          <Gx7BadgeLogo className="text-white" width={48} height={46} />
          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="right"
            logoWrapperClassName="h-8"
            logoClassName="h-[32px] w-auto object-contain"
            nameClassName="body-20-bold text-[#F6F8F5]"
            departmentClassName="body-14-medium text-white/90"
          />
        </div>

        {/* Mobile & Tablet: vertical flow (score at top, zone at bottom).
            Desktop (lg:): 2 columns centered together with automatic margins on both sides. */}
        <div className="mx-auto flex w-full max-w-full flex-col px-[40px] pb-12 pt-4 md:px-10 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:pb-16 lg:pt-10">
          {/* Zone info & Strongest areas (Mobile/Tablet: bottom; Desktop: left) */}
          <div className="order-2 mt-[108px] w-full text-left md:mt-[108px] md:max-w-[536px] lg:order-1 lg:mt-0 lg:max-w-[620px]">
            <div className="heading-40-black mb-3 leading-[1.15]">
              <span className="block text-white">You are in the</span>
              <span className="block lowercase" style={{ color: zoneColor }}>
                {zoneLabel}
              </span>
            </div>
            <p className="body-18-medium mb-5 leading-relaxed text-[#CFE4CA]">{zoneDescription}</p>

            <span className="mb-3 block text-base font-black leading-tight text-white">
              Strongest areas
            </span>
            <div className="flex flex-wrap items-center justify-start gap-3 pb-1">
              {strongestAreas.map((item) => {
                const area = normalizeAreaLabel(item.area);
                const Icon = AREA_ICON_MAP[area] ?? HeartIcon;
                const badgeBg = AREA_BADGE[area] ?? 'bg-neutral-grey-7';
                const iconColor = AREA_COLOR[area];
                return (
                  <div
                    key={item.area}
                    className="flex h-[112px] w-[104px] max-w-[104px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-brand-green-1 px-2 py-2.5"
                  >
                    <div
                      className={cn(
                        'flex h-[48px] w-[48px] items-center justify-center rounded-full',
                        badgeBg,
                      )}
                    >
                      <Icon size={24} color={iconColor} aria-hidden="true" />
                    </div>
                    <span className="body-12-bold line-clamp-2 text-center leading-tight text-brand-green-5">
                      {area}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Battery Score (Mobile/Tablet: top centered; Desktop: right with dedicated blob) */}
          <div className="order-1 flex w-full justify-center lg:order-2 lg:w-auto">
            <div className="relative flex flex-col items-center justify-center text-center lg:h-[380px] lg:w-[380px]">
              {/* Desktop-only blob container centered behind score */}
              <ResultDecorBlob className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[380px] w-[380px] max-w-none -translate-x-1/2 -translate-y-1/2 lg:block" />

              <div className="relative z-10 mt-4 flex flex-col items-center text-center lg:mt-0">
                <span className="body-24-bold text-[#CFE4CA]">{introMessage}</span>
                <span className="body-24-bold text-[#CFE4CA]">Your battery score:</span>
                <div className="relative mt-3 flex items-center justify-center">
                  <BatteryIcon
                    percentage={displayScore}
                    width={166}
                    height={80}
                    preserveAspectRatio="none"
                    className="h-[80px] w-[166px]"
                    aria-hidden="true"
                  />
                  <span className="body-32-black absolute inset-0 flex items-center justify-center pr-3 leading-none text-white drop-shadow-sm">
                    {displayScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
