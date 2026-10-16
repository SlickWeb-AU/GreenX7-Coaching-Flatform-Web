'use client';

import { ANIMATION_DURATION_MS } from '@/constants/dashboard';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

export interface AnimatedNumberProps {
  value: number | null | undefined;
  active?: boolean;
  duration?: number;
  decimals?: number;
  fallback?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string | number;
  className?: string;
}

export function AnimatedNumber({
  value,
  active = true,
  duration = ANIMATION_DURATION_MS,
  decimals = 0,
  fallback = '—',
  prefix = '',
  suffix = '',
  formatter,
  className,
}: AnimatedNumberProps) {
  const numeric =
    typeof value === 'number' && !Number.isNaN(value)
      ? decimals > 0
        ? Number(value.toFixed(decimals))
        : Math.round(value)
      : null;

  const animated = useCountUp(numeric, { active, duration, decimals });

  if (numeric === null) {
    return <span className={cn('tabular-nums', className)}>{fallback}</span>;
  }

  const currentVal = animated ?? numeric;
  const formatted = formatter ? formatter(currentVal) : currentVal;

  return <span className={cn('tabular-nums', className)}>{`${prefix}${formatted}${suffix}`}</span>;
}

export default AnimatedNumber;
