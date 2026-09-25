import type { SVGProps } from 'react';

export interface TrashIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function TrashIcon({ size = 20, color = 'currentColor', ...props }: TrashIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M11.542 1.96747L12.2881 2.71259L12.376 2.80048H16.3662V3.86591H15.5332V16.6667C15.5332 17.0326 15.3982 17.3964 15.1475 17.6472C14.8968 17.8978 14.5328 18.0329 14.167 18.0329H5.83398C5.46806 18.0329 5.10423 17.8979 4.85352 17.6472C4.60281 17.3964 4.46777 17.0326 4.46777 16.6667V3.86591H3.63477V2.80048H7.625L7.71387 2.71259L8.45898 1.96747H11.542ZM5.5332 16.9675H14.4678V3.86591H5.5332V16.9675ZM12.2002 6.13446V14.6989H11.1348V6.13446H12.2002ZM8.86621 6.13446V14.6989H7.80176V6.13446H8.86621Z"
        fill={color}
        stroke={color}
        strokeWidth="0.601852"
      />
    </svg>
  );
}

export default TrashIcon;
