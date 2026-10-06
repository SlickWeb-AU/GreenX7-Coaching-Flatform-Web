import { ClientDepartmentHeader } from '@/components/clients';
import { BatteryIcon, CardDecorBlob, Gx7BadgeLogo, HeartIcon } from '@/components/icons';
import { AREA_BADGE, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { getStrongestAreas } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryAreaScore, BatteryZone } from '@/types/battery';

const ZONE_INFO: Record<BatteryZone, { color: string; desc: string; greeting: string }> = {
  Thrive: {
    color: '#63D556',
    desc: "You're in the sweet spot! Your energy and habits are working together to keep you firing on all cylinders.",
    greeting: 'Well done 👏',
  },
  Momentum: {
    color: '#F5D547',
    desc: "Momentum is building. You're finding your rhythm—stay with it, keep showing up, and you'll be thriving before you know it.",
    greeting: 'Well done 👍',
  },
  Function: {
    color: '#FAF4D0',
    desc: "You're keeping the wheels turning, but there's room to boost your energy reserves and feel your best.",
    greeting: 'Good effort 👍',
  },
  Survive: {
    color: '#F56C77',
    desc: "Your battery is running low. It's time to pause, recharge, and prioritize the basics that restore your vitality.",
    greeting: 'Time for a recharge 👊',
  },
};

export interface BatteryResultsHeroProps {
  average: number;
  zone: BatteryZone;
  areas: BatteryAreaScore[];
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
}

export function BatteryResultsHero({
  average,
  zone,
  areas,
  clientName,
  departmentName,
  clientLogoUrl,
}: BatteryResultsHeroProps) {
  const zoneData = ZONE_INFO[zone];
  const displayScore = Math.round(average);
  const strongest = getStrongestAreas(areas);

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
            nameClassName="body-14-medium text-white"
            departmentClassName="body-14-medium text-white/90"
          />
        </div>

        <div className="px-[40px]">
          <div className="mt-4 flex flex-col items-center text-center">
            <span className="body-24-bold text-[#CFE4CA]">{zoneData.greeting}</span>
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
            <span className="block text-white">You are in the</span>
            <span className="block" style={{ color: zoneData.color }}>
              {zone.toLowerCase()} zone
            </span>
          </div>
          <p className="body-18-medium mb-3 leading-relaxed text-[#CFE4CA]">{zoneData.desc}</p>

          <span className="mb-3 block text-base font-black leading-tight text-white">
            Strongest areas
          </span>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {strongest.map((item) => {
              const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
              const badgeBg = AREA_BADGE[item.area] ?? 'bg-neutral-grey-7';
              const iconColor = AREA_COLOR[item.area];
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
                  <span className="body-12-bold text-center leading-tight text-white">
                    {item.area}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
