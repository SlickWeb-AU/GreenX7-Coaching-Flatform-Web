import { useId } from 'react';

interface BatterySliderProps {
  value: number | null;
  min?: number;
  max?: number;
  color?: string;
  bgColor?: string;
  onChange: (value: number) => void;
  className?: string;
}

export function BatterySlider({
  value,
  min = 1,
  max = 10,
  color = '#F09E5D',
  bgColor = '#FBE7D7',
  onChange,
  className = '',
}: BatterySliderProps) {
  const id = useId();
  const hasValue = value !== null;
  const displayValue = value ?? Math.round((min + max) / 2);
  const span = Math.max(1, max - min);
  // Calculate percentage: min -> 0%, max -> 100%
  const percentage = ((displayValue - min) / span) * 100;
  const ticks: number[] = [];
  for (let s = min + 1; s <= max - 1; s += 1) ticks.push(s);

  return (
    <div className={`relative w-full select-none pt-12 ${className}`}>
      {hasValue && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative flex h-10 min-w-10 items-center justify-center rounded-lg bg-white p-2 shadow-[0px_0px_24px_0px_#00000029]">
            <span className="body-32-black leading-none" style={{ color }}>
              {displayValue}
            </span>
            <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-[6px] border-x-transparent border-t-white" />
          </div>
        </div>
      )}

      <div className="relative flex h-10 items-center rounded-full">
        <div className="absolute inset-x-0 h-3 overflow-hidden rounded-full bg-white">
          {ticks.map((stepNum) => (
            <div
              key={stepNum}
              className="absolute top-0 h-full w-[2px] -translate-x-1/2"
              style={{
                left: `${((stepNum - min) / span) * 100}%`,
                backgroundColor: color,
              }}
            />
          ))}

          <div
            className="pointer-events-none absolute left-0 top-0 h-full transition-all duration-75"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%`, opacity: hasValue ? 1 : 0.45 }}
        >
          <div
            className="h-10 w-10 rounded-full border-[3px]"
            style={{
              backgroundColor: color,
              borderColor: bgColor,
            }}
          />
        </div>

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={displayValue}
          aria-label={`Score from ${min} to ${max}`}
          aria-valuetext={value === null ? 'No score selected' : `${value} out of ${max}`}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 focus:outline-none focus:ring-0"
        />
      </div>

      <div className="body-16-bold mt-5 flex justify-between text-black">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
