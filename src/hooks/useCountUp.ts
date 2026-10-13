'use client';

import { useEffect, useRef, useState } from 'react';

import { ANIMATION_DURATION_MS } from '@/constants/dashboard';

export interface UseCountUpOptions {
  active?: boolean;
  duration?: number;
  decimals?: number;
}

/**
 * Animates a numeric value counting up from 0 to target value with cubic ease-out.
 */
export function useCountUp(
  target: number | null | undefined,
  { active = true, duration = ANIMATION_DURATION_MS, decimals = 0 }: UseCountUpOptions = {},
): number | null {
  const numericTarget = typeof target === 'number' && !Number.isNaN(target) ? target : null;
  // Start at 0 so the first painted frame never flashes the final value.
  const [currentVal, setCurrentVal] = useState<number | null>(() =>
    numericTarget === null ? null : 0,
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (numericTarget === null) {
      setCurrentVal(null);
      return;
    }
    if (!active) {
      setCurrentVal(0);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = numericTarget * easeOut;

      setCurrentVal(decimals > 0 ? Number(val.toFixed(decimals)) : Math.round(val));

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
  }, [active, numericTarget, duration, decimals]);

  return currentVal;
}
