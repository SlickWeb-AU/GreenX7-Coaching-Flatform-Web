import type { SVGProps } from 'react';

export interface AvatarPlaceholderIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function AvatarPlaceholderIcon({
  size = 32,
  color = '#53635C',
  ...props
}: AvatarPlaceholderIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M15.9998 29.3334C23.3636 29.3334 29.3332 23.3638 29.3332 16C29.3332 8.63622 23.3636 2.66669 15.9998 2.66669C8.63604 2.66669 2.6665 8.63622 2.6665 16C2.6665 23.3638 8.63604 29.3334 15.9998 29.3334Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17.3333C18.2091 17.3333 20 15.5425 20 13.3333C20 11.1242 18.2091 9.33331 16 9.33331C13.7909 9.33331 12 11.1242 12 13.3333C12 15.5425 13.7909 17.3333 16 17.3333Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3335 27.5494V25.3334C9.3335 24.6261 9.61445 23.9478 10.1145 23.4477C10.6146 22.9476 11.2929 22.6667 12.0002 22.6667H20.0002C20.7074 22.6667 21.3857 22.9476 21.8858 23.4477C22.3859 23.9478 22.6668 24.6261 22.6668 25.3334V27.5494"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AvatarPlaceholderIcon;
