import type { SVGProps } from 'react';

export function HowItWorksStep3Icon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="148"
      height="148"
      viewBox="0 0 148 148"
      fill="none"
      className={className}
      {...props}
    >
      <g clipPath="url(#how_it_works_step3_clip)">
        <path
          d="M74 148C114.869 148 148 114.869 148 74C148 33.1309 114.869 0 74 0C33.1309 0 0 33.1309 0 74C0 114.869 33.1309 148 74 148Z"
          fill="#E7F1E4"
        />
        <path
          d="M74 24C46.3783 24 24 46.3896 24 74C24 101.61 46.3896 124 74 124C101.61 124 124 101.61 124 74C124 46.3896 101.61 24 74 24ZM73.8868 105.778C61.5198 105.778 50.1382 98.53 44.906 87.3182L51.7576 84.1246C55.7554 92.6863 64.4417 98.2242 73.8868 98.2242C83.3318 98.2242 92.0181 92.6863 96.0158 84.1246L102.867 87.3182C97.6353 98.53 86.2537 105.778 73.8868 105.778Z"
          fill="#9ACC63"
        />
      </g>
      <defs>
        <clipPath id="how_it_works_step3_clip">
          <rect width="148" height="148" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
