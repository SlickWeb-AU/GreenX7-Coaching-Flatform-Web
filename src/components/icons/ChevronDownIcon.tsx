import type { SVGProps } from 'react';

export interface ChevronDownIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function ChevronDownIcon({
  size = 16,
  color = '#6A7A72',
  ...props
}: ChevronDownIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M4 6L8 10L12 6"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronDownIcon;
