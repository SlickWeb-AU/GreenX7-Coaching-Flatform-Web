import type { SVGProps } from 'react';

export interface ArrowForwardIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function ArrowForwardIcon({
  size = 16,
  color = '#6A7A72',
  ...props
}: ArrowForwardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M3.33398 8H12.6673"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.33331L12.6667 7.99998L8 12.6666"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowForwardIcon;
