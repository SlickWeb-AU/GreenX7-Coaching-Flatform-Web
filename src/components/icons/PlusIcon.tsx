import type { SVGProps } from 'react';

export interface PlusIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function PlusIcon({ size = 16, color = '#005943', ...props }: PlusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M3.33594 8H12.6693"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.33334V12.6667"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PlusIcon;
