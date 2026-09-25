import type { SVGProps } from 'react';

export interface LockedPadlockIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function LockedPadlockIcon({
  size = 20,
  color = '#6A7A72',
  ...props
}: LockedPadlockIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M15.8335 9.16667H4.16683C3.24636 9.16667 2.50016 9.91286 2.50016 10.8333V16.6667C2.50016 17.5871 3.24636 18.3333 4.16683 18.3333H15.8335C16.754 18.3333 17.5002 17.5871 17.5002 16.6667V10.8333C17.5002 9.91286 16.754 9.16667 15.8335 9.16667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.8335 9.16667V5.83333C5.8335 4.72826 6.27248 3.66846 7.05389 2.88705C7.83529 2.10565 8.89509 1.66667 10.0002 1.66667C11.1052 1.66667 12.165 2.10565 12.9464 2.88705C13.7279 3.66846 14.1668 4.72826 14.1668 5.83333V9.16667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5V15"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LockedPadlockIcon;
