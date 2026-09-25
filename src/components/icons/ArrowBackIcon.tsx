import type { SVGProps } from 'react';

export interface ArrowBackIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function ArrowBackIcon({
  size = 20,
  color = '#005943',
  ...props
}: ArrowBackIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M10.0001 15.8333L4.16675 9.99997L10.0001 4.16664"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8334 10H4.16675"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowBackIcon;
