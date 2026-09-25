'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';

export interface BaseSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function BaseSwitch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}: BaseSwitchProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className={cn('flex items-start gap-3.5', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-[32px] w-[56px] shrink-0 cursor-pointer rounded-full p-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-2 focus-visible:ring-offset-2',
          checked ? 'bg-brand-green-2' : 'bg-neutral-grey-5',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none block h-[28px] w-[28px] rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[24px]' : 'translate-x-0',
          )}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p id={labelId} className="body-16-medium text-neutral-grey-1">
          {label}
        </p>
        {description && (
          <p id={descriptionId} className="body-14-medium mt-0.5 text-neutral-grey-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
