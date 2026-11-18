'use client';

import { useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BaseHelperText } from './BaseHelperText';

export type BaseInputSize = 'small' | 'medium' | 'mediumPlus';
export type BaseInputVariant = 'primary' | 'secondary';

export const sizeClass: Record<BaseInputSize, string> = {
  small: 'h-9 body-16-medium',
  medium: 'h-10 body-16-medium',
  mediumPlus: 'h-12 body-16-medium',
};

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
  /** Shows a clear button on the right when the input has a value */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  loading?: boolean;
  /** Extra classes merged onto the inner <input> (e.g. border overrides) */
  inputClassName?: string;
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
  clearable = false,
  onClear,
  loading = false,
  className,
  inputClassName,
  id,
  required,
  disabled,
  readOnly,
  value,
  defaultValue,
  onChange,
  ...props
}: BaseInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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

  const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
  const showClear = clearable && hasValue && !disabled && !readOnly;

  const handleClear = () => {
    onClear?.();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderedSuffix =
    suffix ??
    (showClear ? (
      <button
        type="button"
        aria-label="Clear input"
        tabIndex={-1}
        onClick={handleClear}
        className="flex cursor-pointer select-none items-center justify-center text-neutral-grey-3 transition-colors hover:text-neutral-grey-1"
      >
        <X size={16} aria-hidden />
      </button>
    ) : null);

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
          ref={inputRef}
          id={resolvedId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error}
          placeholder={resolvedPlaceholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={cn(
            'flex w-full rounded-lg border border-neutral-grey-6 px-3 py-2 text-neutral-grey-1 shadow-none transition-colors placeholder:text-neutral-grey-3',
            readOnly
              ? 'cursor-default bg-white text-neutral-grey-2'
              : [variantBg[variant], 'hover:border-neutral-grey-4 focus:border-brand-green-2'],
            sizeClass[size],
            inputClassName,
            error && 'border-secondary-red-4 focus:border-secondary-red-4',
            'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            prefix && 'pl-9',
            renderedSuffix && 'pr-10',
          )}
          {...props}
        />
        {renderedSuffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-grey-3">
            {renderedSuffix}
          </div>
        )}
      </div>
      <BaseHelperText helperText={helperText} error={error} />
    </div>
  );
}

export default BaseInput;
