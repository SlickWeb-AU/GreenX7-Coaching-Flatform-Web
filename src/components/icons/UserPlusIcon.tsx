import type { SVGProps } from 'react';

export interface UserPlusIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function UserPlusIcon({
  size = 16,
  color = '#005943',
  ...props
}: UserPlusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M10.6693 14V12.6667C10.6693 11.9594 10.3883 11.2811 9.88822 10.781C9.38813 10.281 8.70985 10 8.0026 10H4.0026C3.29536 10 2.61708 10.281 2.11699 10.781C1.61689 11.2811 1.33594 11.9594 1.33594 12.6667V14"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.0026 7.33333C7.47536 7.33333 8.66927 6.13943 8.66927 4.66667C8.66927 3.19391 7.47536 2 6.0026 2C4.52984 2 3.33594 3.19391 3.33594 4.66667C3.33594 6.13943 4.52984 7.33333 6.0026 7.33333Z"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6641 5.33334V9.33334"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6641 7.33334H10.6641"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default UserPlusIcon;
