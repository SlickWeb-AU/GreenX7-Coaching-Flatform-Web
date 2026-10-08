import { useId, type SVGProps } from 'react';

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
  // Total fillable inner width
  const maxFillWidth = 129.231;
  const currentFillWidth = (clamped / 100) * maxFillWidth;
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `battery_charging_fill_${rawId}`;

  return (
    <svg width="167" height="80" viewBox="0 0 167 80" fill="none" className={className} {...props}>
      <rect
        x="4"
        y="4"
        width="145.846"
        height="72"
        rx="24"
        fill="#CFE4CA"
        stroke="#CFE4CA"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M156.926 27.6921C159.374 27.6921 161.722 28.9888 163.453 31.2969C165.184 33.605 166.157 36.7355 166.157 39.9997C166.157 43.2639 165.184 46.3945 163.453 48.7026C161.722 51.0107 159.374 52.3074 156.926 52.3074L156.926 39.9997V27.6921Z"
        fill="#CFE4CA"
      />
      <rect
        opacity="0.4"
        x="4"
        y="4"
        width="145.846"
        height="72"
        rx="24"
        stroke="white"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M156.926 27.6921C159.374 27.6921 161.722 28.9888 163.453 31.2969C165.184 33.605 166.157 36.7355 166.157 39.9997C166.157 43.2639 165.184 46.3945 163.453 48.7026C161.722 51.0107 159.374 52.3074 156.926 52.3074L156.926 39.9997V27.6921Z"
        fill="white"
      />
      {/* Dark track */}
      <rect
        x="8.80469"
        y="8.80746"
        width="136.231"
        height="62.3846"
        rx="23.5"
        fill="#005943"
        stroke="#01A179"
        strokeWidth="7"
      />
      {/* Dynamic green fill, clipped to the track's inner rounded shape */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="12.3047" y="12.3075" width={currentFillWidth} height="55.3846" fill="#9ACC63" />
      </g>
      {/* Dynamic percentage text */}
      <text
        x="77"
        y="54"
        textAnchor="middle"
        fill="white"
        fontSize="40"
        fontWeight="900"
        fontFamily="inherit"
        className="select-none"
      >
        {Math.round(clamped)}
        <tspan dx="2" fill="#E7F1E5" fontSize="24" fontWeight="900">
          %
        </tspan>
      </text>
      <defs>
        <clipPath id={clipId}>
          <rect x="12.3047" y="12.3075" width="129.231" height="55.3846" rx="20" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Alias for backwards compatibility if needed
export const HowItWorksStep2Icon = BatteryChargingPillIcon;
