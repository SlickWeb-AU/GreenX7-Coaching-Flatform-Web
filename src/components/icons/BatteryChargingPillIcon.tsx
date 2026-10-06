import type { SVGProps } from 'react';

export interface BatteryChargingPillIconProps extends SVGProps<SVGSVGElement> {
  percentage?: number;
}

export function BatteryChargingPillIcon({
  percentage = 100,
  className,
  ...props
}: BatteryChargingPillIconProps) {
  // Clamped percentage 0 - 100
  const clamped = Math.max(0, Math.min(100, percentage));
  // Total fillable inner width: 136.231
  const maxFillWidth = 136.231;
  const currentFillWidth = Math.max(8, (clamped / 100) * maxFillWidth);

  return (
    <svg width="183" height="84" viewBox="0 0 183 84" fill="none" className={className} {...props}>
      <rect
        x="4"
        y="4"
        width="175"
        height="76"
        rx="24"
        fill="#CFE4CA"
        stroke="#CFE4CA"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <mask id="battery_charging_pill_mask" fill="white">
        <path d="M166.926 31.692C169.374 31.692 171.722 32.9887 173.453 35.2968C175.184 37.605 176.157 40.7355 176.157 43.9997C176.157 47.2639 175.184 50.3944 173.453 52.7025C171.722 55.0107 169.374 56.3074 166.926 56.3074L166.926 43.9997V31.692Z" />
      </mask>
      <path
        d="M166.926 31.692C169.374 31.692 171.722 32.9887 173.453 35.2968C175.184 37.605 176.157 40.7355 176.157 43.9997C176.157 47.2639 175.184 50.3944 173.453 52.7025C171.722 55.0107 169.374 56.3074 166.926 56.3074L166.926 43.9997V31.692Z"
        fill="#CFE4CA"
        stroke="#CFE4CA"
        strokeWidth="5.31086"
        mask="url(#battery_charging_pill_mask)"
      />
      <rect
        x="14"
        y="8"
        width="145.846"
        height="72"
        rx="24"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M166.926 31.692C169.374 31.692 171.722 32.9887 173.453 35.2968C175.184 37.605 176.157 40.7355 176.157 43.9997C176.157 47.2639 175.184 50.3944 173.453 52.7025C171.722 55.0107 169.374 56.3074 166.926 56.3074L166.926 43.9997V31.692Z"
        fill="white"
        fillOpacity="0.4"
      />
      {/* Background container of fill */}
      <rect
        x="18.8047"
        y="12.8075"
        width="136.231"
        height="62.3846"
        rx="23.5"
        fill="#01A179"
        fillOpacity="0.15"
        stroke="#01A179"
        strokeWidth="7"
      />
      {/* Clip path for green dynamic fill */}
      <g clipPath="url(#battery_pill_fill_clip)">
        <rect
          x="18.8047"
          y="12.8075"
          width={currentFillWidth}
          height="62.3846"
          rx="23.5"
          fill="#9ACC63"
        />
      </g>
      {/* Centered Percentage text inside battery */}
      <text
        x="87"
        y="49"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="24"
        fontWeight="800"
        fontFamily="inherit"
        className="select-none"
      >
        {Math.round(clamped)}%
      </text>
      <defs>
        <clipPath id="battery_pill_fill_clip">
          <rect x="18.8047" y="12.8075" width="136.231" height="62.3846" rx="23.5" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Alias for backwards compatibility if needed
export const HowItWorksStep2Icon = BatteryChargingPillIcon;
