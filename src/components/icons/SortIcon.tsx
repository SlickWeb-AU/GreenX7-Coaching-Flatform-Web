import type { SVGProps } from 'react';

export interface SortIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function SortIcon({
  size = 12,
  color = 'currentColor',
  ...props
}: SortIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" {...props}>
      <path d="M10.5 8L8.5 10L6.5 8" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 10V2" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 4L3.5 2L5.5 4" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 2V10" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default SortIcon;
