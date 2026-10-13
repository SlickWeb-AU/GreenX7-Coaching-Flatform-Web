import type { SVGProps } from 'react';

export interface BatteryIconProps extends SVGProps<SVGSVGElement> {
  /** Battery fill level, 0-100. Values are clamped. */
  percentage?: number;
  /** Whether to animate fill width. Defaults to true. */
  animate?: boolean;
}

export function BatteryIcon({ percentage = 0, animate = true, ...props }: BatteryIconProps) {
  const fillWidth = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <svg width={124} height={49} viewBox="0 0 124 49" fill="none" {...props}>
      <rect x="2" y="2" width="108" height="45" rx="14" stroke="#6C9489" strokeWidth="4" />
      {/* Battery fill container with smooth width transition */}
      <g>
        <svg x="6" y="6" width="100" height="37">
          <rect
            x="0"
            y="0"
            width={`${fillWidth}%`}
            height="37"
            rx="10"
            fill="#9ACC63"
            className={animate ? 'transition-all duration-[3000ms] ease-out' : undefined}
          />
        </svg>
      </g>
      <rect x="6" y="6" width="100" height="37" rx="10" stroke="#36A078" strokeWidth="4" />
      <path
        d="M114 15C119.523 15 124 19.4772 124 25C124 30.5228 119.523 35 114 35V15Z"
        fill="#6C9489"
      />
    </svg>
  );
}

export default BatteryIcon;
