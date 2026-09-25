'use client';

import { BaseTag } from '@/components/base';
import { BatteryIcon } from '@/components/icons';
import { cn, formatScoreToPercent } from '@/lib/utils';

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
  score = 0,
  periodLabel = '',
  changeVsLastMonth = 0,
  lastMonthLabel = '',
  changeVsFirstCheck = 0,
  firstCheckLabel = '',
  className,
}: ClientBatteryCardProps) {
  const displayScore = formatScoreToPercent(score) ?? 0;
  const roundedLastMonth = Math.round(changeVsLastMonth);
  const roundedFirstCheck = Math.round(changeVsFirstCheck);
  const isLastMonthPositive = roundedLastMonth >= 0;
  const isFirstCheckPositive = roundedFirstCheck >= 0;

  if (badgeText) {
    return (
      <div
        className={cn(
          'flex flex-col justify-between gap-4 rounded-2xl bg-brand-green-2 p-6 text-white shadow-none',
          className,
        )}
      >
        {/* Top cluster: Title + Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="body-14-bold text-white">{title ?? 'Current Battery Score'}</div>
          <BaseTag variant="green-neutral">{badgeText}</BaseTag>
        </div>

        {/* Bottom cluster: Battery Icon, Score & Comparisons */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BatteryIcon percentage={displayScore} aria-hidden="true" />
            <div className="flex items-stretch gap-1">
              <span className="heading-48-bold leading-none text-white">{displayScore}</span>
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
                {isLastMonthPositive ? `+${roundedLastMonth}%` : `${roundedLastMonth}%`}
              </span>
              <span className="body-14-medium text-white/70">
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
                {isFirstCheckPositive ? `+${roundedFirstCheck}%` : `${roundedFirstCheck}%`}
              </span>
              <span className="body-14-medium text-white/70">
                {firstCheckLabel.startsWith('since') ? firstCheckLabel : `since ${firstCheckLabel}`}
              </span>
            </div>
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
          <BatteryIcon percentage={displayScore} aria-hidden="true" />
          <div className="flex items-stretch gap-1">
            <span className="heading-48-bold leading-none text-white">{displayScore}</span>
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
              {isLastMonthPositive ? `+${roundedLastMonth}%` : `${roundedLastMonth}%`}
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
              {isFirstCheckPositive ? `+${roundedFirstCheck}%` : `${roundedFirstCheck}%`}
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
