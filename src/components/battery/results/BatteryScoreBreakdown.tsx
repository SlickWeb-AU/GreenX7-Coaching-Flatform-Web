'use client';

import { useEffect, useRef, useState } from 'react';

import { AreaScoreProgressBar, BatteryWheelChart } from '@/components/dashboard';
import { HeartIcon } from '@/components/icons';
import { AREA_BADGE, AREA_BAR_COLORS, AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { normalizeAreaLabel } from '@/lib/battery';
import { SCORE_INPUT_TYPE, formatScoreToPercent, type ScoreInputType } from '@/lib/utils';
import type { BatteryAreaResultDto } from '@/types/battery';

export interface BatteryScoreBreakdownProps {
  areas: BatteryAreaResultDto[];
  average?: number | null;
  calculateBy?: ScoreInputType;
}

export function BatteryScoreBreakdown({
  areas,
  average,
  calculateBy = SCORE_INPUT_TYPE.ANSWER,
}: BatteryScoreBreakdownProps) {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const percentOf = (a: BatteryAreaResultDto) =>
    calculateBy === SCORE_INPUT_TYPE.ANSWER
      ? (formatScoreToPercent(a.answer, SCORE_INPUT_TYPE.ANSWER) ?? 0)
      : (formatScoreToPercent(a.score) ?? 0);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col rounded-[20px] bg-white p-6 text-neutral-grey-1 shadow-none md:p-8"
    >
      <h3 className="heading-24-bold mb-4 block text-[#005943]">Score breakdown</h3>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
        <div className="flex min-h-[280px] justify-center">
          {isActive ? (
            <BatteryWheelChart
              score={average ?? null}
              items={areas.map((a) => ({
                area: a.area,
                label: a.area,
                score: percentOf(a),
                vsPreviousMonth: null,
                vsFirstCheck: null,
              }))}
              size={280}
              animate={true}
            />
          ) : (
            <div className="h-[280px] w-[280px]" />
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          {areas.map((item) => {
            const area = normalizeAreaLabel(item.area);
            const Icon = AREA_ICON_MAP[area] ?? HeartIcon;
            const barColor = AREA_BAR_COLORS[area] ?? 'bg-brand-green-2';
            const badgeBg = AREA_BADGE[area] ?? 'bg-neutral-grey-7';
            const iconColor = AREA_COLOR[area];
            const itemScore = percentOf(item);
            const label = area === 'Physical' ? 'Physical health' : area;

            return (
              <AreaScoreProgressBar
                key={item.area}
                label={label}
                badgeBg={badgeBg}
                iconColor={iconColor}
                barColor={barColor}
                score={itemScore}
                displayValue={item.answer}
                Icon={Icon}
                active={isActive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
