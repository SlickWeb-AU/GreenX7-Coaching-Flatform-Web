interface SvgProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function StarMarkSvg({ className, width = '100%', height = '100%' }: SvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 494 485"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M247 0L268.4 153.2L397.6 69.4L337.8 211.8L491.5 204.6L369.3 298.5L478.7 407.9L326.3 381.1L353.1 533.5L247 421.4L140.9 533.5L167.7 381.1L15.3 407.9L124.7 298.5L2.5 204.6L156.2 211.8L96.4 69.4L225.6 153.2L247 0Z"
        fill="#005943"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export function WaveTopSvg({ className }: SvgProps) {
  return (
    <svg
      width="100%"
      height="48"
      viewBox="0 0 1440 48"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 48C360 0 1080 0 1440 48V0H0V48Z" fill="#004736" />
    </svg>
  );
}

export function WaveBottomSvg({ className }: SvgProps) {
  return (
    <svg
      width="100%"
      height="48"
      viewBox="0 0 1440 48"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 0C360 48 1080 48 1440 0V48H0V0Z" fill="#004736" />
    </svg>
  );
}

export function WavySeparatorSvg({ className }: SvgProps) {
  return (
    <svg
      width="100%"
      height="16"
      viewBox="0 0 600 16"
      fill="none"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 8 Q 15 0, 30 8 T 60 8 T 90 8 T 120 8 T 150 8 T 180 8 T 210 8 T 240 8 T 270 8 T 300 8 T 330 8 T 360 8 T 390 8 T 420 8 T 450 8 T 480 8 T 510 8 T 540 8 T 570 8 T 600 8"
        stroke="#CFE4CA"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
