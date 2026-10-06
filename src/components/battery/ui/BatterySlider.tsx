import { useId } from 'react';

interface BatterySliderProps {
  value: number | null;
  color?: string;
  bgColor?: string;
  onChange: (value: number) => void;
  className?: string;
}

export function BatterySlider({
  value,
  color = '#F09E5D',
  bgColor = '#FBE7D7',
  onChange,
  className = '',
}: BatterySliderProps) {
  const id = useId();
  const hasValue = value !== null;
  const displayValue = value ?? 7;
  // Calculate percentage: 1 -> 0%, 10 -> 100%
  const percentage = ((displayValue - 1) / 9) * 100;

  return (
    <div className={`relative w-full select-none pt-12 ${className}`}>
      {hasValue && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        >
          <div className="relative flex h-10 min-w-10 items-center justify-center rounded-lg bg-white p-2">
            <span className="body-32-black leading-none" style={{ color }}>
              {displayValue}
            </span>
            <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-[6px] border-x-transparent border-t-white" />
          </div>
        </div>
      )}

      <div className="relative flex h-10 items-center rounded-full focus-within:ring-2 focus-within:ring-black/30">
        <div className="absolute inset-x-0 h-3 overflow-hidden rounded-full bg-white">
          {[2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => (
            <div
              key={stepNum}
              className="absolute top-0 h-full w-[3px] -translate-x-1/2"
              style={{
                left: `${((stepNum - 1) / 9) * 100}%`,
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
          min={1}
          max={10}
          step={1}
          value={displayValue}
          aria-label="Score from 1 to 10"
          aria-valuetext={value === null ? 'No score selected' : `${value} out of 10`}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="body-16-bold mt-5 flex justify-between text-black">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
