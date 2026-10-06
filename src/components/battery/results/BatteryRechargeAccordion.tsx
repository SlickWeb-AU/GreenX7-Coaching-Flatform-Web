'use client';

import { useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Droplets,
  Footprints,
  Leaf,
  Smile,
  Target,
  Users,
  Wind,
} from 'lucide-react';
import { AREA_BADGE } from '@/constants/dashboard';
import { normalizeAreaLabel } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryRechargeTipDto } from '@/types/battery';

function ElementTag({ name }: { name: string }) {
  const getIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'breath':
        return <Wind className="h-3 w-3 text-brand-green-1" />;
      case 'movement':
        return <Activity className="h-3 w-3 text-brand-green-1" />;
      case 'earthing':
      case 'nature':
        return <Footprints className="h-3 w-3 text-brand-green-1" />;
      case 'water':
        return <Droplets className="h-3 w-3 text-brand-green-1" />;
      case 'play':
      case 'fun':
        return <Smile className="h-3 w-3 text-brand-green-1" />;
      case 'presence':
      case 'connection':
      case 'friendships':
        return <Users className="h-3 w-3 text-brand-green-1" />;
      case 'purpose':
      case 'clarity':
      case 'focus':
        return <Target className="h-3 w-3 text-brand-green-1" />;
      default:
        return <Leaf className="h-3 w-3 text-brand-green-1" />;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-green-2">
        {getIcon(name)}
      </div>
      <span className="caption-12-bold text-brand-green-1">{name}</span>
    </div>
  );
}

export interface BatteryRechargeAccordionProps {
  tips: BatteryRechargeTipDto[];
}

export function BatteryRechargeAccordion({ tips }: BatteryRechargeAccordionProps) {
  const [openArea, setOpenArea] = useState<string | null>(tips[0]?.area ?? null);

  return (
    <section className="w-full">
      <h2 className="mb-2 mt-8 text-left text-[30px] font-bold leading-tight text-brand-green-1">
        Ways to recharge
        <br />
        your battery
      </h2>

      <div className="mb-10 w-full space-y-2">
        {tips.map((tip) => {
          const area = normalizeAreaLabel(tip.areaLabel ?? tip.area);
          const isOpen = openArea === tip.area;
          const desc =
            tip.body?.trim() ||
            `Small daily actions in ${area.toLowerCase()} help restore balance and wellbeing.`;
          const elements = tip.tags?.length ? tip.tags : [area, 'Rest', 'Recharge'];
          return (
            <div
              key={tip.id}
              className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-none transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenArea(isOpen ? null : tip.area)}
                className="flex w-full flex-col text-left focus:outline-none"
              >
                <div className="mb-2 flex w-full items-center justify-between">
                  <span
                    className={cn(
                      'caption-12-bold rounded-md px-2.5 py-0.5 text-neutral-600',
                      AREA_BADGE[area],
                    )}
                  >
                    {area}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={32} className="text-neutral-600" />
                  ) : (
                    <ChevronDown size={32} className="text-neutral-600" />
                  )}
                </div>
                <h3 className="text-left text-[18px] font-bold text-black">{tip.title}</h3>
              </button>

              {isOpen && (
                <div className="pt-2">
                  <p className="body-16-regular leading-relaxed text-neutral-grey-2">{desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {elements.map((el) => (
                      <ElementTag key={el} name={el} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
