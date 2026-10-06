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
import { getLowestAreas } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryAreaScore } from '@/types/battery';

const AREA_RECHARGE_DATA: Record<string, { title: string; desc: string; elements: string[] }> = {
  Physical: {
    title: 'Take a walking break in nature',
    desc: 'Step away from your screen and take a brisk 15-minute walk outside. Feel your feet connect with the ground and notice your breath settling.',
    elements: ['Movement', 'Earthing', 'Breath'],
  },
  Sleep: {
    title: "Have a deep conversation about how you're going",
    desc: "Find someone you can be truly honest with, and have a real conversation with them about how you're traveling in the most important aspects of your life. Listen in turn to the other person to understand how they are doing too.",
    elements: ['Breath', 'Movement', 'Earthing'],
  },
  Nutrition: {
    title: 'Hydrate and choose fresh whole foods',
    desc: 'Fuel your energy reserves with clean hydration and nutrient-dense meals that sustain steady vitality throughout your day.',
    elements: ['Nutrition', 'Water', 'Fuel'],
  },
  Fun: {
    title: 'Schedule spontaneous play and laughter',
    desc: 'Make time today for something with zero productivity goal—play music, laugh with peers, or explore an engaging creative hobby.',
    elements: ['Fun', 'Play', 'Connection'],
  },
  Mindset: {
    title: 'Catch up with a friend',
    desc: 'Reach out to someone who lifts your spirits. A quick 10-minute check-in can shift your perspective and restore clarity.',
    elements: ['Connection', 'Mindset', 'Presence'],
  },
  Friendships: {
    title: 'Play in a green space',
    desc: 'Invite a teammate or friend to an outdoor park or green space. Combining connection with the natural world amplifies your recharge.',
    elements: ['Friendships', 'Nature', 'Play'],
  },
  Relationships: {
    title: 'Dedicate uninterrupted quality time',
    desc: 'Put phones away and share dedicated focused time with someone close to you. True presence deepens relational resilience.',
    elements: ['Presence', 'Connection', 'Empathy'],
  },
  Purpose: {
    title: 'Reflect on your core values and impact',
    desc: 'Take five quiet minutes to write down one meaningful contribution you want to make today and why it matters to you.',
    elements: ['Purpose', 'Clarity', 'Focus'],
  },
};

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
  areas: BatteryAreaScore[];
}

export function BatteryRechargeAccordion({ areas }: BatteryRechargeAccordionProps) {
  const lowest = getLowestAreas(areas);
  const [openArea, setOpenArea] = useState<string | null>(lowest[0]?.area ?? null);

  return (
    <section className="w-full">
      <h2 className="mb-2 mt-8 text-left text-[30px] font-bold leading-tight text-brand-green-1">
        Ways to recharge
        <br />
        your battery
      </h2>

      <div className="mb-10 w-full space-y-2">
        {lowest.map((a) => {
          const isOpen = openArea === a.area;
          const info = AREA_RECHARGE_DATA[a.area] ?? {
            title: `Recharge in ${a.area.toLowerCase()}`,
            desc: `Small daily actions in ${a.area.toLowerCase()} help restore balance and wellbeing.`,
            elements: [a.area, 'Rest', 'Recharge'],
          };

          return (
            <div
              key={a.area}
              className="w-full overflow-hidden rounded-2xl bg-white p-4 shadow-none transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenArea(isOpen ? null : a.area)}
                className="flex w-full flex-col text-left focus:outline-none"
              >
                <div className="mb-2 flex w-full items-center justify-between">
                  <span
                    className={cn(
                      'caption-12-bold rounded-md px-2.5 py-0.5 text-neutral-600',
                      AREA_BADGE[a.area],
                    )}
                  >
                    {a.area}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={32} className="text-neutral-600" />
                  ) : (
                    <ChevronDown size={32} className="text-neutral-600" />
                  )}
                </div>
                <h3 className="text-left text-[18px] font-bold text-black">{info.title}</h3>
              </button>

              {isOpen && (
                <div className="pt-2">
                  <p className="body-16-regular leading-relaxed text-neutral-grey-2">{info.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {info.elements.map((el) => (
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
