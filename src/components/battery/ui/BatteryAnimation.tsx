'use client';

import { useEffect, useState } from 'react';

interface BatteryAnimationProps {
  percentage: number;
  disableAnimate?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function BatteryAnimation({
  percentage,
  disableAnimate = false,
  onComplete,
  className,
}: BatteryAnimationProps) {
  const [current, setCurrent] = useState(disableAnimate ? percentage : 0);
  const maxFillWidth = 132;

  useEffect(() => {
    if (disableAnimate) {
      setCurrent(percentage);
      onComplete?.();
      return;
    }

    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const val = Math.round(progress * percentage);
      setCurrent(val);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percentage, disableAnimate, onComplete]);

  const fillWidth = Math.max(8, (Math.min(100, Math.max(0, current)) / 100) * maxFillWidth);

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`}>
      <svg
        width="168"
        height="84"
        viewBox="0 0 168 84"
        fill="none"
        className="drop-shadow-md"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="146"
          height="78"
          rx="20"
          stroke="#087452"
          strokeWidth="6"
          fill="#00382B"
        />
        <path
          d="M153 28C157.418 28 161 31.5817 161 36V48C161 52.4183 157.418 56 153 56V28Z"
          fill="#087452"
        />
        <rect
          data-testid="battery-fill"
          x="10"
          y="10"
          width={fillWidth}
          height="64"
          rx="14"
          fill="#63D556"
          className="transition-all duration-75"
        />
      </svg>
      <span className="heading-32-bold absolute inset-0 flex items-center justify-center text-white drop-shadow">
        {current}%
      </span>
    </div>
  );
}
