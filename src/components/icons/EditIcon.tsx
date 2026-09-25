import type { SVGProps } from 'react';

export interface EditIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function EditIcon({ size = 20, color = 'currentColor', ...props }: EditIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M17.6423 5.67665C18.0829 5.23617 18.3305 4.63871 18.3306 4.0157C18.3307 3.39269 18.0832 2.79516 17.6428 2.35457C17.2023 1.91398 16.6048 1.66641 15.9818 1.66634C15.3588 1.66626 14.7613 1.91367 14.3207 2.35415L3.19901 13.4783C3.00552 13.6712 2.86244 13.9088 2.78234 14.17L1.68151 17.7967C1.65997 17.8687 1.65834 17.9453 1.6768 18.0182C1.69526 18.0911 1.73311 18.1577 1.78634 18.2108C1.83957 18.264 1.90619 18.3017 1.97914 18.32C2.05209 18.3384 2.12864 18.3366 2.20067 18.315L5.82817 17.215C6.08915 17.1356 6.32665 16.9934 6.51984 16.8008L17.6423 5.67665Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 4.16667L15.8333 7.50001"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default EditIcon;
