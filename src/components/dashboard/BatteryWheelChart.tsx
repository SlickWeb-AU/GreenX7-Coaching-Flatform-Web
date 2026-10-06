'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip } from 'recharts';
import type { PieSectorShapeProps } from 'recharts';

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

  const renderCustomSector = (props: PieSectorShapeProps) => {
    const { cx: sectorCx, cy: sectorCy, startAngle, endAngle, payload, ...rest } = props;
    delete (rest as { key?: unknown }).key;
    const petal = payload as PetalData | undefined;
    const sectorOuterRadius = petal?.outerRadius ?? rMax;

    return (
      <Sector
        {...rest}
        cx={sectorCx ?? cx}
        cy={sectorCy ?? cy}
        innerRadius={0}
        outerRadius={sectorOuterRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={petal?.color}
        stroke="#ffffff"
        strokeWidth={2}
        cornerRadius={4}
        className="cursor-pointer transition-all duration-300 hover:opacity-95"
      />
    );
  };

  const badgeSize = Math.round(size * 0.42);

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
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx={cx}
          cy={cy}
          innerRadius={0}
          outerRadius={(entry: { outerRadius?: number }) => entry.outerRadius ?? rMax}
          paddingAngle={2.5}
          startAngle={0}
          endAngle={-360}
          shape={renderCustomSector}
          isAnimationActive={false}
          stroke="#ffffff"
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
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
                    size <= 160 ? 'text-[40px]' : 'heading-52-black',
                    'font-black leading-none text-neutral-grey-1',
                    scoreClassName,
                  )}
                >
                  {score === null || score === undefined ? '—' : Math.round(score)}
                </span>
                {score !== null && score !== undefined && (
                  <span
                    className={cn(
                      size <= 160 ? 'text-[12px]' : 'body-18-black',
                      'font-black leading-none text-neutral-grey-1',
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
