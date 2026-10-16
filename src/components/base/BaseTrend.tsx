'use client';

import { TrendDownIcon, TrendNeutralIcon, TrendUpIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BaseTrendProps {
  value?: number | null;
  className?: string;
  active?: boolean;
}

export function BaseTrend({ value, className }: BaseTrendProps) {
  const rounded = value === null || value === undefined || isNaN(value) ? null : Math.round(value);

  if (rounded === null) {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <span className="body-14-bold leading-none text-neutral-grey-3">—</span>
      </div>
    );
  }

  if (rounded === 0) {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <TrendNeutralIcon size={16} aria-hidden />
        <span className="body-14-bold tabular-nums leading-none text-neutral-grey-3">0%</span>
      </div>
    );
  }

  const isPositive = rounded > 0;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {isPositive ? <TrendUpIcon size={16} aria-hidden /> : <TrendDownIcon size={16} aria-hidden />}
      <span
        className={cn(
          'body-14-bold tabular-nums leading-none',
          isPositive ? 'text-secondary-green-4' : 'text-secondary-red-4',
        )}
      >
        {`${isPositive ? '+' : ''}${rounded}%`}
      </span>
    </div>
  );
}

export default BaseTrend;
