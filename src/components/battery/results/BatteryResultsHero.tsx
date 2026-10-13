'use client';

import { useEffect, useState } from 'react';

import { ClientDepartmentHeader } from '@/components/clients';
import {
  BatteryIcon,
  GreenX7LogoLight,
  Gx7BadgeLogo,
  HeartIcon,
  ResultDecorBlob,
} from '@/components/icons';
import { AREA_BAR_COLORS, AREA_ICON_MAP, AREA_LIGHT_COLOR } from '@/constants/dashboard';
import { DASHBOARD_COLORS, ZONE_COLORS } from '@/constants/tokens';
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
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const timer = setTimeout(() => {
      setActive(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [average]);

  const displayScore = Math.round(average);
  const resolvedKey = resolveZoneKey(zoneKey) ?? resolveZoneKey(zoneLabel);
  const zoneColor = resolvedKey ? ZONE_COLORS[resolvedKey].color : '#63D556';

  return (
    <div className="relative w-full bg-brand-green-2 text-white">
      {/* Background Blob behind score for mobile/tablet */}
      <ResultDecorBlob className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 lg:hidden" />

      <div className="relative flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 px-6 pt-6 md:px-10 md:pt-8 lg:mb-24">
          {/* Mobile / Tablet: badge logo */}
          <Gx7BadgeLogo className="text-white lg:hidden" width={48} height={46} />
          {/* Desktop: large logo height 58px */}
          <GreenX7LogoLight className="hidden h-[58px] w-auto text-white lg:block" />

          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="right"
            logoWrapperClassName="h-8 lg:h-[58px]"
            logoClassName="h-[32px] w-auto object-contain lg:h-[58px]"
            nameClassName="body-20-bold text-[#F6F8F5] lg:heading-24-bold"
            departmentClassName="body-14-medium text-white/90"
          />
        </div>

        {/* Mobile & Tablet: vertical flow (score at top, zone at bottom).
            Desktop (lg:): 2 columns centered together with automatic margins on both sides. */}
        <div className="mx-auto flex w-full max-w-full flex-col px-[40px] pb-12 pt-4 md:px-10 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:pb-16 lg:pt-10">
          {/* Zone info & Strongest areas (Mobile/Tablet: bottom; Desktop: left) */}
          <div className="order-2 mt-[108px] w-full text-left md:mt-[108px] md:max-w-[536px] lg:order-1 lg:mt-0 lg:max-w-[620px]">
            <div className="heading-40-black lg:heading-72-black mb-3 leading-[1.15] lg:mb-6">
              <span className="block text-white">You are in the</span>
              <span className="block lowercase" style={{ color: zoneColor }}>
                {zoneLabel}
              </span>
            </div>
            <p className="body-18-medium lg:body-24-medium mb-5 leading-relaxed text-[#CFE4CA] lg:mb-6">
              {zoneDescription}
            </p>

            <span className="lg:body-20-bold mb-3 block text-base font-black leading-tight text-white">
              Strongest areas
            </span>
            <div className="-mr-6 flex flex-wrap items-center justify-start gap-2 md:mr-0">
              {strongestAreas.map((item) => {
                const area = normalizeAreaLabel(item.area);
                const Icon = AREA_ICON_MAP[area] ?? HeartIcon;
                const badgeBg = AREA_BAR_COLORS[area] ?? 'bg-neutral-grey-7';
                const iconColor = AREA_LIGHT_COLOR[area] ?? DASHBOARD_COLORS.neutral.whiteSolid;
                return (
                  <div
                    key={item.area}
                    className="flex h-[88px] w-[104px] max-w-[104px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-brand-green-1 p-2 lg:h-[144px] lg:w-[144px] lg:max-w-[144px] lg:gap-3 lg:p-4"
                  >
                    <div
                      className={cn(
                        'flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full lg:h-[56px] lg:w-[56px]',
                        badgeBg,
                      )}
                    >
                      <Icon size={24} color={iconColor} aria-hidden="true" />
                    </div>
                    <span className="body-12-bold lg:body-16-bold line-clamp-2 text-center leading-tight text-brand-green-5">
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
                <span className="body-24-bold lg:heading-30-bold text-[#CFE4CA]">
                  {introMessage}
                </span>
                <span className="body-24-bold lg:heading-30-bold text-[#CFE4CA]">
                  Your battery score:
                </span>
                <div className="relative mt-3 flex items-center justify-center">
                  <BatteryIcon
                    percentage={active ? displayScore : 0}
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
