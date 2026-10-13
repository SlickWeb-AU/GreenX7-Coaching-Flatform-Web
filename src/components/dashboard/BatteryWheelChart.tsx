'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { BadgeStarIcon } from '@/components/icons';
import { AREA_COLOR, FIXED_WELLBEING_AREAS } from '@/constants/dashboard';
import { DASHBOARD_COLORS } from '@/constants/tokens';
import { cn, formatScoreToPercent } from '@/lib/utils';
import type { WellbeingItemData } from '@/types';

export interface BatteryWheelChartProps {
  score?: number | null;
  items?: WellbeingItemData[];
  size?: number;
  className?: string;
  showScore?: boolean;
  scoreClassName?: string;
  percentClassName?: string;
  animate?: boolean;
  animationDuration?: number;
}

/**
 * 8 petals clockwise from the top, matching FIXED_WELLBEING_AREAS order:
 * Physical, Sleep, Nutrition, Fun, Mindset, Friendships, Relationships, Purpose.
 */
const FLOWER_PETALS = FIXED_WELLBEING_AREAS.map((def) => ({
  key: def.area.toLowerCase(),
  label: def.label,
  color: AREA_COLOR[def.area] ?? DASHBOARD_COLORS.secondary.teal1,
}));

interface PetalData {
  key: string;
  label: string;
  value: number;
  score: number | null;
  color: string;
  outerRadius: number;
}

export function BatteryWheelChart({
  score,
  items,
  size = 220,
  className,
  showScore = true,
  scoreClassName,
  percentClassName,
  animate = true,
  animationDuration = 1500,
}: BatteryWheelChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const rMax = Math.round(size * 0.48); // Longest petal radius (100% score)

  const data: PetalData[] = useMemo(() => {
    const itemScoreMap = new Map<string, number>();
    if (items && items.length > 0) {
      for (const item of items) {
        if (item?.area && item.score !== null && item.score !== undefined) {
          itemScoreMap.set(item.area.trim().toLowerCase(), item.score);
        }
      }
    }

    return FLOWER_PETALS.map((petal) => {
      const customScore = itemScoreMap.get(petal.key);
      const scorePercent = formatScoreToPercent(customScore);

      // Petal reach scales directly with score: 0.45 (0%) to 1.0 (100%)
      const ratio =
        scorePercent !== null
          ? 0.45 + 0.55 * (Math.max(0, Math.min(100, scorePercent)) / 100)
          : 0.45;

      const outerRadius = Math.round(rMax * ratio);

      return {
        key: petal.key,
        label: petal.label,
        value: 1, // each petal spans 45 degrees
        score: scorePercent,
        color: petal.color,
        outerRadius,
      };
    });
  }, [items, rMax]);

  const badgeSize = Math.round(size * 0.42);
  const roundedScore = score === null || score === undefined ? null : Math.round(score);
  const scoreDigits = roundedScore === null ? 0 : String(Math.abs(roundedScore)).length;

  let currentStartAngle = 0;
  const anglePerSlice = 360 / 8;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center bg-white', className)}
      style={{ width: size, height: size }}
    >
      <PieChart
        width={size}
        height={size}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        className="[&_*:focus]:outline-none"
      >
        <Tooltip
          isAnimationActive={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const entry = payload[0].payload as { label: string; score: number | null };
              return (
                <div className="pointer-events-none select-none rounded-lg bg-brand-green-2 px-2.5 py-1 text-xs font-medium text-white shadow-md">
                  <span className="font-bold">{entry.label}: </span>
                  <span>
                    {entry.score !== null && entry.score !== undefined ? `${entry.score}%` : '—'}
                  </span>
                </div>
              );
            }
            return null;
          }}
          wrapperStyle={{ zIndex: 50, pointerEvents: 'none', transition: 'none' }}
        />
        {data.map((entry, index) => {
          const pieStartAngle = currentStartAngle;
          const pieEndAngle = currentStartAngle + anglePerSlice;
          currentStartAngle += anglePerSlice;

          return (
            <Pie
              key={`slice-${entry.key || index}`}
              data={[entry]}
              dataKey="value"
              cx={cx}
              cy={cy}
              startAngle={pieStartAngle + 1.25}
              endAngle={pieEndAngle - 1.25}
              innerRadius={0}
              outerRadius={entry.outerRadius}
              isAnimationActive={animate}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              cornerRadius={4}
              stroke="#ffffff"
              strokeWidth={2}
              className="cursor-pointer transition-all duration-300 hover:opacity-95"
            >
              <Cell fill={entry.color} />
            </Pie>
          );
        })}
      </PieChart>

      {/* Center badge showing the battery score */}
      {showScore && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <BadgeStarIcon size={badgeSize} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-0.5">
                <span
                  className={cn(
                    scoreDigits >= 3 ? 'body-32-black' : 'heading-40-black',
                    'leading-none text-black',
                    scoreClassName,
                  )}
                >
                  {score === null || score === undefined ? '—' : roundedScore}
                </span>
                {score !== null && score !== undefined && (
                  <span
                    className={cn(
                      scoreDigits >= 3 ? 'caption-12-bold' : 'body-16-black',
                      'font-black leading-none text-black',
                      percentClassName,
                    )}
                  >
                    %
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
