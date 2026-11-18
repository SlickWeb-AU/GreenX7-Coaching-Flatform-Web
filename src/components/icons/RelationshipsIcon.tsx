import type { SVGProps } from 'react';

export interface RelationshipsIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function RelationshipsIcon({
  size = 20,
  color = '#F56C77',
  ...props
}: RelationshipsIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M15.2877 3.16469C13.3427 2.47942 11.7543 3.22665 10.9095 3.80115C10.5152 4.06962 9.98764 4.06962 9.59338 3.80115C8.7504 3.22665 7.1602 2.47942 5.21516 3.16469C1.93338 4.3212 1.9315 7.88086 2.60363 9.59122C4.12812 13.0401 9.58024 16.795 10.2505 16.795C10.9207 16.795 16.3729 13.0401 17.8974 9.59122C18.5695 7.88086 18.5676 4.3212 15.2858 3.16469H15.2877Z"
        fill={color}
      />
    </svg>
  );
}

export default RelationshipsIcon;
