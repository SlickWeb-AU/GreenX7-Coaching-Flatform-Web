import type { SVGProps } from 'react';

export interface DecorativeWaveBottomRightProps extends SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  color?: string;
}

export function DecorativeWaveBottomRight({
  width = 293,
  height = 295,
  color = '#004736',
  ...props
}: DecorativeWaveBottomRightProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 293 295" fill="none" aria-hidden {...props}>
      <path
        d="M341.145 16.4C327.735 6.71 311.275 1 293.475 1C275.675 1 259.215 6.72 245.805 16.41C181.225 62.97 179.015 64.04 102.345 85.5C86.4146 89.94 71.6746 99.24 60.5746 113.16C49.4746 127.08 43.6746 143.51 42.8846 160.03C39.0246 239.54 38.5046 241.94 7.47456 315.27C1.01456 330.5 -0.905438 347.82 3.05456 365.18C7.01456 382.54 16.2546 397.31 28.6846 408.23C88.4446 460.83 89.9746 462.75 127.955 532.72C135.835 547.26 148.175 559.56 164.215 567.29C180.255 575.02 197.565 577.03 213.855 574.12C292.235 560.19 294.695 560.19 373.075 574.12C389.355 577.03 406.665 575.01 422.715 567.29C438.755 559.57 451.105 547.27 458.975 532.72C496.955 462.75 498.515 460.85 558.275 408.26C570.705 397.34 579.925 382.55 583.885 365.2C587.845 347.84 585.965 330.51 579.505 315.28C548.475 241.96 547.915 239.56 544.055 160.05C543.265 143.53 537.485 127.1 526.385 113.18C515.285 99.26 500.555 89.94 484.625 85.5C407.945 64.04 405.735 62.97 341.155 16.41L341.145 16.4Z"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

export default DecorativeWaveBottomRight;
