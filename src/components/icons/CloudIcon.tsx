import type { SVGProps } from 'react';

export interface CloudIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function CloudIcon({ size = 20, color = '#5FC8C9', ...props }: CloudIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M17.999 12.2088C17.999 10.7532 16.9618 9.54211 15.5853 9.26795C15.4694 9.24534 15.3748 9.15631 15.3408 9.04326C15.0865 8.18122 14.2908 7.55094 13.3454 7.55094C13.0147 7.55094 12.7038 7.62866 12.4269 7.76574C12.2389 7.85901 12.0057 7.7714 11.9534 7.5679C11.5408 5.96959 10.0923 4.78818 8.36539 4.78818C6.31628 4.78818 4.65438 6.45007 4.65438 8.49918C4.65438 8.53734 4.65438 8.57549 4.6558 8.61365C4.66145 8.77051 4.55687 8.90759 4.40425 8.94575C3.02216 9.29198 1.99902 10.5398 1.99902 12.0293C1.99902 13.7421 3.35285 15.1341 5.04866 15.2047V15.2118H15.1416V15.2047C16.7314 15.1284 17.999 13.8198 17.999 12.2102V12.2088Z"
        fill={color}
      />
    </svg>
  );
}

export default CloudIcon;
