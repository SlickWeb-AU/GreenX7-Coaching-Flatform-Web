import type { SVGProps } from 'react';

export interface FunIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function FunIcon({ size = 20, color = '#EBD343', ...props }: FunIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M10.25 1.99997C5.83052 1.99997 2.25 5.58231 2.25 9.99998C2.25 14.4177 5.83233 18 10.25 18C14.6677 18 18.25 14.4177 18.25 9.99998C18.25 5.58231 14.6677 1.99997 10.25 1.99997ZM10.2319 15.0845C8.25317 15.0845 6.43211 13.9248 5.59496 12.1309L6.69122 11.6199C7.33086 12.9898 8.72067 13.8759 10.2319 13.8759C11.7431 13.8759 13.1329 12.9898 13.7725 11.6199L14.8688 12.1309C14.0317 13.9248 12.2106 15.0845 10.2319 15.0845Z"
        fill={color}
      />
    </svg>
  );
}

export default FunIcon;
