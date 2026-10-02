import { useId } from 'react';

import { cn } from '@/lib/utils';

interface BatterySliderProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function BatterySlider({ value, onChange }: BatterySliderProps) {
  const id = useId();
  return (
    <div className="w-full">
      {value !== null && (
        <div className="mb-2 flex justify-center">
          <span className="body-16-bold rounded-full bg-neutral-grey-1 px-3 py-1 text-white">
            {value}
          </span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value ?? 7}
        aria-label="Score from 1 to 10"
        aria-valuetext={value === null ? 'No score selected' : `${value} out of 10`}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'h-8 w-full cursor-pointer accent-brand-green-2',
          value === null && 'opacity-60',
        )}
      />
      <div className="body-14-medium mt-1 flex justify-between text-neutral-grey-2">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
