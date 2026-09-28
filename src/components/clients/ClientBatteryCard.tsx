'use client';

import { BaseTag } from '@/components/base';
import { BatteryIcon } from '@/components/icons';
import { cn, formatScoreToPercent } from '@/lib/utils';

export interface ClientBatteryCardProps {
  title?: string;
  badgeText?: string;
  score?: number | null;
  periodLabel?: string;
  changeVsLastMonth?: number | null;
  lastMonthLabel?: string;
  changeVsFirstCheck?: number | null;
  firstCheckLabel?: string | null;
  className?: string;
}

export function ClientBatteryCard({
  title,
  badgeText,
  score = null,
  periodLabel = '',
  changeVsLastMonth = null,
  lastMonthLabel = '',
  changeVsFirstCheck = null,
  firstCheckLabel = null,
  className,
}: ClientBatteryCardProps) {
  const displayScore = formatScoreToPercent(score);
  const hasLastMonth = changeVsLastMonth !== null && changeVsLastMonth !== undefined;
  const roundedLastMonth = hasLastMonth ? Math.round(changeVsLastMonth) : null;
  const isLastMonthPositive = (roundedLastMonth ?? 0) >= 0;

  const hasFirstCheck = changeVsFirstCheck !== null && changeVsFirstCheck !== undefined;
  const roundedFirstCheck = hasFirstCheck ? Math.round(changeVsFirstCheck) : null;
  const isFirstCheckPositive = (roundedFirstCheck ?? 0) >= 0;

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
            <BatteryIcon percentage={displayScore ?? 0} aria-hidden="true" />
            <div className="flex items-stretch gap-1">
              <span className="heading-48-bold leading-none text-white">{displayScore ?? '—'}</span>
              <span className="self-start text-3xl font-bold leading-none text-white">%</span>
              <span className="body-16-medium self-end leading-none text-white/80">/100</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'caption-12-bold rounded-full px-2 py-0.5 text-white',
                  !hasLastMonth
                    ? 'bg-white/20'
                    : isLastMonthPositive
                      ? 'bg-secondary-green-4'
                      : 'bg-secondary-red-4',
                )}
              >
                {hasLastMonth
                  ? isLastMonthPositive
                    ? `+${roundedLastMonth}%`
                    : `${roundedLastMonth}%`
                  : '—'}
              </span>
              <span className="body-14-medium text-white/70">
                {lastMonthLabel
                  ? lastMonthLabel.startsWith('vs')
                    ? lastMonthLabel
                    : `vs ${lastMonthLabel}`
                  : 'vs previous period'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'caption-12-bold rounded-full px-2 py-0.5 text-white',
                  !hasFirstCheck
                    ? 'bg-white/20'
                    : isFirstCheckPositive
                      ? 'bg-secondary-green-4'
                      : 'bg-secondary-red-4',
                )}
              >
                {hasFirstCheck
                  ? isFirstCheckPositive
                    ? `+${roundedFirstCheck}%`
                    : `${roundedFirstCheck}%`
                  : '—'}
              </span>
              <span className="body-14-medium text-white/70">
                {firstCheckLabel
                  ? firstCheckLabel.startsWith('since')
                    ? firstCheckLabel
                    : `since ${firstCheckLabel}`
                  : 'since first check'}
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
          <BatteryIcon percentage={displayScore ?? 0} aria-hidden="true" />
          <div className="flex items-stretch gap-1">
            <span className="heading-48-bold leading-none text-white">{displayScore ?? '—'}</span>
            <span className="self-start text-3xl font-bold leading-none text-white">%</span>
            <span className="body-16-medium self-end leading-none text-white/80">/100</span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'body-14-bold rounded-[99px] px-1 text-white',
                !hasLastMonth
                  ? 'bg-white/20'
                  : isLastMonthPositive
                    ? 'bg-secondary-green-4'
                    : 'bg-secondary-red-4',
              )}
            >
              {hasLastMonth
                ? isLastMonthPositive
                  ? `+${roundedLastMonth}%`
                  : `${roundedLastMonth}%`
                : '—'}
            </span>
            <span className="body-14-medium text-white/60">
              {lastMonthLabel ? `compared with ${lastMonthLabel}` : 'compared with previous period'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={cn(
                'body-14-bold rounded-[99px] px-1 text-white',
                !hasFirstCheck
                  ? 'bg-white/20'
                  : isFirstCheckPositive
                    ? 'bg-secondary-green-4'
                    : 'bg-secondary-red-4',
              )}
            >
              {hasFirstCheck
                ? isFirstCheckPositive
                  ? `+${roundedFirstCheck}%`
                  : `${roundedFirstCheck}%`
                : '—'}
            </span>
            <span className="body-14-medium text-white/60">
              {firstCheckLabel ? `since first check in ${firstCheckLabel}` : 'since first check'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientBatteryCard;
