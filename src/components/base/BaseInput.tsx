'use client';

import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BaseInputSize = 'small' | 'medium' | 'mediumPlus';
export type BaseInputVariant = 'primary' | 'secondary';

export const sizeClass: Record<BaseInputSize, string> = {
  small: 'h-9 body-16-medium',
  medium: 'h-10 body-16-medium',
  mediumPlus: 'h-12 body-16-medium',
};

export const inputSizeClass = sizeClass;

const variantBg: Record<BaseInputVariant, string> = {
  primary: 'bg-white',
  secondary: 'bg-neutral-grey-8',
};

export interface BaseInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'prefix'
> {
  label?: string;
  size?: BaseInputSize;
  variant?: BaseInputVariant;
  error?: boolean;
  helperText?: string;
  /** Icon / element rendered on the left inside the input */
  prefix?: ReactNode;
  /** Icon / element rendered on the right inside the input */
  suffix?: ReactNode;
  loading?: boolean;
}

export function BaseInput({
  label,
  placeholder,
  size = 'medium',
  variant = 'primary',
  error = false,
  helperText,
  prefix,
  suffix,
  loading = false,
  className,
  id,
  required,
  disabled,
  readOnly,
  ...props
}: BaseInputProps) {
  const inputId = useId();
  const resolvedId = id ?? inputId;
  const resolvedPlaceholder =
    placeholder ?? (label && !readOnly ? `Enter ${label.toLowerCase()}` : undefined);

  if (loading) {
    return (
      <div
        className={cn(
          'w-full animate-pulse rounded-lg bg-neutral-grey-7',
          sizeClass[size],
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={resolvedId} className="body-14-bold mb-2 block text-neutral-grey-2">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-grey-3">
            {prefix}
          </div>
        )}
        <input
          id={resolvedId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error}
          placeholder={resolvedPlaceholder}
          className={cn(
            'flex w-full rounded-lg border px-3 py-2 text-neutral-grey-1 shadow-none transition-colors placeholder:text-neutral-grey-3',
            variantBg[variant],
            sizeClass[size],
            error
              ? 'border-secondary-red-4 focus:border-secondary-red-4'
              : readOnly
                ? 'cursor-default border-neutral-grey-5'
                : 'border-neutral-grey-5 hover:border-neutral-grey-4 focus:border-brand-green-2',
            'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            prefix && 'pl-9',
            suffix && 'pr-10',
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-grey-3">
            {suffix}
          </div>
        )}
      </div>
      {helperText && (
        <p
          className={cn(
            'body-14-medium mt-2',
            error ? 'text-secondary-red-4' : 'text-neutral-grey-3',
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default BaseInput;
