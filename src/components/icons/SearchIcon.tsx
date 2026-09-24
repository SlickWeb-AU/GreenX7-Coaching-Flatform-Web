import type { SVGProps } from 'react';

export interface SearchIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function SearchIcon({
  size = 20,
  color = '#6A7A72',
  ...props
}: SearchIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M9.16716 15.467C12.8491 15.467 15.8338 12.5643 15.8338 8.98352C15.8338 5.40277 12.8491 2.5 9.16716 2.5C5.48526 2.5 2.50049 5.40277 2.50049 8.98352C2.50049 12.5643 5.48526 15.467 9.16716 15.467Z"
        stroke={color}
        strokeWidth="1.54369"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5007 17.0883L13.917 13.603"
        stroke={color}
        strokeWidth="1.54369"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SearchIcon;
