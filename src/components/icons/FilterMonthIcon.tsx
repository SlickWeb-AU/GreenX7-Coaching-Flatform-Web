import type { SVGProps } from 'react';

export interface FilterMonthIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function FilterMonthIcon({
  size = 16,
  color = '#53635C',
  ...props
}: FilterMonthIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <g clipPath="url(#clip0_filter_month)">
        <path
          d="M1.33301 13.3333C1.33301 13.687 1.47348 14.0261 1.72353 14.2761C1.97358 14.5262 2.31272 14.6667 2.66634 14.6667H13.333C13.6866 14.6667 14.0258 14.5262 14.2758 14.2761C14.5259 14.0261 14.6663 13.687 14.6663 13.3333V5.33334L9.99967 8.66667V5.33334L5.33301 8.66667V2.66667C5.33301 2.31305 5.19253 1.97391 4.94248 1.72386C4.69244 1.47381 4.3533 1.33334 3.99967 1.33334H2.66634C2.31272 1.33334 1.97358 1.47381 1.72353 1.72386C1.47348 1.97391 1.33301 2.31305 1.33301 2.66667V13.3333Z"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.333 12H11.9997"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H8.66667"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66699 12H5.33366"
          stroke={color}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_filter_month">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FilterMonthIcon;
