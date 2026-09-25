import { TrendDownIcon, TrendUpIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BaseTrendProps {
  value?: number | null;
  className?: string;
}

export function BaseTrend({ value, className }: BaseTrendProps) {
  if (value === null || value === undefined || isNaN(value)) {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <span className="body-14-bold leading-none text-neutral-grey-3">—</span>
      </div>
    );
  }

  const isPositive = value >= 0;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {isPositive ? <TrendUpIcon size={16} aria-hidden /> : <TrendDownIcon size={16} aria-hidden />}
      <span
        className={cn(
          'body-14-bold leading-none',
          isPositive ? 'text-secondary-green-4' : 'text-secondary-red-4',
        )}
      >
        {`${Math.abs(Math.round(value))}%`}
      </span>
    </div>
  );
}

export default BaseTrend;
