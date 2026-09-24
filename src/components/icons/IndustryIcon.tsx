import type { SVGProps } from 'react';

export interface IndustryIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function IndustryIcon({
  size = 20,
  color = '#6A7A72',
  ...props
}: IndustryIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M1.6665 17.5H18.3332"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.1665 17.5V7.5L9.99984 4.16667V17.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99984 17.5V10.8333L15.8332 7.5V17.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6665 10.8333H7.49984"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6665 14.1667H7.49984"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 14.1667H13.3333"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default IndustryIcon;
