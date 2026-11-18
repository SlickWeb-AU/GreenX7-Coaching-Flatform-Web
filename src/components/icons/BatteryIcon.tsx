'use client';

import { useEffect, useState, type SVGProps } from 'react';

export interface BatteryIconProps extends SVGProps<SVGSVGElement> {
  /** Battery fill level, 0-100. Values are clamped. */
  percentage?: number;
  /** Whether to animate fill width. Defaults to true. */
  animate?: boolean;
  /** Overall size shortcut or width (if numeric, height is scaled proportionally). */
  size?: number | string;
  /** Primary color (applies to battery fill, or fallback if fillColor not set). */
  color?: string;
  /** Custom fill color of the battery charge (defaults to #9ACC63). */
  fillColor?: string;
  /** Custom stroke color of the outer battery frame and tip (defaults to #6C9489). */
  strokeColor?: string;
  /** Custom stroke color of the inner battery track (defaults to #36A078). */
  innerStrokeColor?: string;
}

export function BatteryIcon({
  percentage = 0,
  animate = true,
  size,
  width = 124,
  height = 49,
  color,
  fillColor,
  strokeColor = '#6C9489',
  innerStrokeColor = '#36A078',
  className,
  ...props
}: BatteryIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [animate]);

  const safePercentage =
    typeof percentage === 'number' && !Number.isNaN(percentage) ? percentage : 0;
  const targetWidth = Math.min(100, Math.max(0, Math.round(safePercentage)));
  const fillWidth = animate && !mounted ? 0 : targetWidth;

  const resolvedWidth = size !== undefined ? size : width;
  const resolvedHeight =
    size !== undefined ? (typeof size === 'number' ? Math.round((size * 49) / 124) : size) : height;
  const resolvedFillColor = fillColor ?? color ?? '#9ACC63';

  return (
    <svg
      width={resolvedWidth}
      height={resolvedHeight}
      viewBox="0 0 124 49"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="108" height="45" rx="14" stroke={strokeColor} strokeWidth="4" />
      {/* Battery fill container with smooth width transition */}
      <g>
        <svg x="6" y="6" width="100" height="37">
          <rect
            x="0"
            y="0"
            width={`${fillWidth}%`}
            height="37"
            rx="10"
            fill={resolvedFillColor}
            className={animate ? 'linear transition-all duration-[3000ms]' : undefined}
            style={animate ? { width: `${fillWidth}%` } : undefined}
          />
        </svg>
      </g>
      <rect x="6" y="6" width="100" height="37" rx="10" stroke={innerStrokeColor} strokeWidth="4" />
      <path
        d="M114 15C119.523 15 124 19.4772 124 25C124 30.5228 119.523 35 114 35V15Z"
        fill={strokeColor}
      />
    </svg>
  );
}

export default BatteryIcon;
