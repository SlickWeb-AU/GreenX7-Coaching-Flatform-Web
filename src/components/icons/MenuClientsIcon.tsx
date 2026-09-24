import type { SVGProps } from 'react';

export interface MenuClientsIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function MenuClientsIcon({
  size = 20,
  color = 'currentColor',
  ...props
}: MenuClientsIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M14.1668 17.5V15.8333C14.1668 14.9493 13.8156 14.1014 13.1905 13.4763C12.5654 12.8512 11.7176 12.5 10.8335 12.5H4.16683C3.28277 12.5 2.43493 12.8512 1.80981 13.4763C1.18469 14.1014 0.833496 14.9493 0.833496 15.8333V17.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.50016 9.16667C9.34111 9.16667 10.8335 7.67428 10.8335 5.83333C10.8335 3.99238 9.34111 2.5 7.50016 2.5C5.65921 2.5 4.16683 3.99238 4.16683 5.83333C4.16683 7.67428 5.65921 9.16667 7.50016 9.16667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1668 17.5V15.8333C19.1662 15.0931 18.9168 14.3748 18.4566 13.7845C17.9964 13.1943 17.3508 12.7645 16.6668 12.5667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3335 2.56665C14.0206 2.76283 14.6698 3.19237 15.1327 3.78385C15.5956 4.37533 15.847 5.09605 15.847 5.83832C15.847 6.58058 15.5956 7.3013 15.1327 7.89278C14.6698 8.48426 14.0206 8.9138 13.3335 9.10998"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MenuClientsIcon;
