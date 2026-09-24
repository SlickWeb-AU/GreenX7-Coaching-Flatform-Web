import type { SVGProps } from 'react';

export interface BatteryIconProps extends SVGProps<SVGSVGElement> {
  /** Battery fill level, 0-100. Values are clamped. */
  percentage?: number;
}

export function BatteryIcon({ percentage = 0, ...props }: BatteryIconProps) {
  const fillWidth = Math.min(100, Math.max(0, Math.round(percentage)));

  const renderFill = () => {
    if (fillWidth <= 0) return null;
    if (fillWidth >= 95) {
      return <rect x="6" y="6" width={fillWidth} height="37" rx="10" fill="#9ACC63" />;
    }
    if (fillWidth <= 10) {
      return (
        <rect
          x="6"
          y="6"
          width={fillWidth}
          height="37"
          rx={Math.max(1, fillWidth / 2)}
          fill="#9ACC63"
        />
      );
    }
    return (
      <path
        d={`M 16 6 H ${6 + fillWidth} V 43 H 16 A 10 10 0 0 1 6 33 V 16 A 10 10 0 0 1 16 6 Z`}
        fill="#9ACC63"
      />
    );
  };

  return (
    <svg width={124} height={49} viewBox="0 0 124 49" fill="none" {...props}>
      <rect x="2" y="2" width="108" height="45" rx="14" stroke="#6C9489" strokeWidth="4" />
      {renderFill()}
      <rect x="6" y="6" width="100" height="37" rx="10" stroke="#36A078" strokeWidth="4" />
      <path
        d="M114 15C119.523 15 124 19.4772 124 25C124 30.5228 119.523 35 114 35V15Z"
        fill="#6C9489"
      />
    </svg>
  );
}

export default BatteryIcon;

