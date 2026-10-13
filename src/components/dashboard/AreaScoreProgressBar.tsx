'use client';

import { useEffect, useRef, useState } from 'react';

import { BoltIcon } from '@/components/icons';
import { ANIMATION_DURATION_MS, type AreaIcon } from '@/constants/dashboard';
import { cn } from '@/lib/utils';

export interface AreaScoreProgressBarProps {
  label: string;
  badgeBg: string;
  iconColor: string;
  barColor: string;
  score: number;
  displayValue?: number | string | null;
  Icon: AreaIcon;
  active?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  duration?: number;
}

export function AreaScoreProgressBar({
  label,
  badgeBg,
  iconColor,
  barColor,
  score,
  displayValue,
  Icon,
  active = true,
  size = 'md',
  className,
  duration = ANIMATION_DURATION_MS,
}: AreaScoreProgressBarProps) {
  const isSm = size === 'sm';
  const numericTarget = typeof displayValue === 'number' ? displayValue : null;
  const [currentVal, setCurrentVal] = useState<number | null>(() => (active ? numericTarget : 0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (numericTarget === null) return;
    if (!active) {
      setCurrentVal(0);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = numericTarget * easeOut;
      setCurrentVal(Number(val.toFixed(Number.isInteger(numericTarget) ? 0 : 1)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentVal(numericTarget);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, numericTarget, duration]);

  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center justify-between', isSm ? 'mb-1.5' : 'mb-2')}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-full',
              isSm ? 'h-7 w-7' : 'h-6 w-6',
              badgeBg,
            )}
          >
            <Icon size={isSm ? 14 : 12} color={iconColor} aria-hidden="true" />
          </div>
          <span className={cn('text-neutral-grey-1', isSm ? 'body-14-bold' : 'body-16-medium')}>
            {label}
          </span>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 leading-none text-neutral-grey-1',
            isSm ? 'body-14-bold' : 'body-16-black',
          )}
        >
          <span>{currentVal ?? displayValue ?? score ?? '—'}</span>
          <BoltIcon size={isSm ? 12 : 14} aria-hidden="true" />
        </div>
      </div>

      <div className={cn('w-full overflow-hidden rounded-full', isSm ? 'h-1.5' : 'h-2', badgeBg)}>
        <div
          className={cn('h-full rounded-full transition-all ease-out', barColor)}
          style={{
            width: active ? `${Math.min(100, Math.max(0, score))}%` : '0%',
            transitionDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  );
}
