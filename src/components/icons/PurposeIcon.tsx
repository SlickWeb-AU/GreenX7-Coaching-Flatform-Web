import type { SVGProps } from 'react';

export interface PurposeIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function PurposeIcon({ size = 20, color = '#83ADB9', ...props }: PurposeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M10.8505 3.3464L18.1555 15.9996C18.4666 16.5369 17.9594 17.1778 17.3656 17.0006L12.0155 15.4114C10.8637 15.0683 9.63648 15.0683 8.48276 15.4114L3.13457 17.0006C2.53886 17.1778 2.03364 16.5369 2.34469 15.9996L9.64968 3.3464C9.91737 2.88453 10.5828 2.88453 10.8505 3.3464Z"
        fill={color}
      />
    </svg>
  );
}

export default PurposeIcon;
