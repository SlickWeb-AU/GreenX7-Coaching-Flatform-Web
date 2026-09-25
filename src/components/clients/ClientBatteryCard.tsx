'use client';

import { BatteryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ClientBatteryCardProps {
  title?: string;
  badgeText?: string;
  score?: number;
  periodLabel?: string;
  changeVsLastMonth?: number;
  lastMonthLabel?: string;
  changeVsFirstCheck?: number;
  firstCheckLabel?: string;
  className?: string;
}

export function ClientBatteryCard({
  title,
  badgeText,
  score = 68,
  periodLabel = 'July 2026',
  changeVsLastMonth = 3,
  lastMonthLabel = 'June 2026',
  changeVsFirstCheck = -1,
  firstCheckLabel = 'February 2026',
  className,
}: ClientBatteryCardProps) {
  const isLastMonthPositive = changeVsLastMonth >= 0;
  const isFirstCheckPositive = changeVsFirstCheck >= 0;

  if (badgeText) {
    return (
      <div
        className={cn(
          'flex flex-col justify-between gap-4 rounded-2xl bg-brand-green-2 p-6 text-white shadow-none',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="body-14-bold text-white">{title ?? 'Current Battery Score'}</div>
          <span className="caption-12-bold rounded-full bg-secondary-green-2 px-3 py-1 text-secondary-green-4">
            {badgeText}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <BatteryIcon percentage={score} aria-hidden="true" />
          <div className="flex items-stretch gap-1">
            <span className="heading-48-bold leading-none text-white">{score}</span>
            <span className="self-start text-3xl font-bold leading-none text-white">%</span>
            <span className="body-16-medium self-end leading-none text-white/80">/100</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'caption-12-bold rounded-full px-2 py-0.5 text-white',
                isLastMonthPositive ? 'bg-secondary-green-4' : 'bg-secondary-red-4',
              )}
            >
              {isLastMonthPositive ? `+${changeVsLastMonth}%` : `${changeVsLastMonth}%`}
            </span>
            <span className="body-12-medium text-white/70">
              {lastMonthLabel.startsWith('vs') ? lastMonthLabel : `vs ${lastMonthLabel}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'caption-12-bold rounded-full px-2 py-0.5 text-white',
                isFirstCheckPositive ? 'bg-secondary-green-4' : 'bg-secondary-red-4',
              )}
            >
              {isFirstCheckPositive ? `+${changeVsFirstCheck}%` : `${changeVsFirstCheck}%`}
            </span>
            <span className="body-12-medium text-white/70">
              {firstCheckLabel.startsWith('since') ? firstCheckLabel : `since ${firstCheckLabel}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-3 rounded-2xl bg-brand-green-2 p-6 text-white shadow-none',
        className,
      )}
    >
      <div className="body-14-bold text-white">{title ?? `Battery Score (${periodLabel})`}</div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BatteryIcon percentage={score} aria-hidden="true" />
          <div className="flex items-stretch gap-1">
            <span className="heading-48-bold leading-none text-white">{score}</span>
            <span className="self-start text-3xl font-bold leading-none text-white">%</span>
            <span className="body-16-medium self-end leading-none text-white/80">/100</span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'body-14-bold rounded-[99px] px-1 text-white',
                isLastMonthPositive ? 'bg-secondary-green-4' : 'bg-secondary-red-4',
              )}
            >
              {isLastMonthPositive ? `+${changeVsLastMonth}%` : `${changeVsLastMonth}%`}
            </span>
            <span className="body-14-medium text-white/60">compared with {lastMonthLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={cn(
                'body-14-bold rounded-[99px] px-1 text-white',
                isFirstCheckPositive ? 'bg-secondary-green-4' : 'bg-secondary-red-4',
              )}
            >
              {isFirstCheckPositive ? `+${changeVsFirstCheck}%` : `${changeVsFirstCheck}%`}
            </span>
            <span className="body-14-medium text-white/60">
              since first check in {firstCheckLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientBatteryCard;
