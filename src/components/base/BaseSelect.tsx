'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type BaseSelectSize = 'small' | 'medium' | 'mediumPlus';
export type BaseSelectVariant = 'primary' | 'secondary';

export const selectSizeClass: Record<BaseSelectSize, string> = {
  small: 'h-9 body-16-medium',
  medium: 'h-10 body-16-medium',
  mediumPlus: 'h-12 body-16-medium',
};

const sizeClass = selectSizeClass;

const variantBg: Record<BaseSelectVariant, string> = {
  primary: 'bg-white',
  secondary: 'bg-neutral-grey-8',
};

export interface BaseSelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface BaseSelectProps<T extends string = string> {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: T;
  defaultValue?: T;
  options: BaseSelectOption<T>[];
  onChange?: (value: T) => void;
  size?: BaseSelectSize;
  variant?: BaseSelectVariant;
  error?: boolean;
  helperText?: string;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  startIcon?: ReactNode;
}

export function BaseSelect<T extends string = string>({
  id,
  label,
  placeholder,
  value,
  defaultValue,
  options,
  onChange,
  size = 'medium',
  variant = 'primary',
  error = false,
  helperText,
  loading = false,
  disabled = false,
  required = false,
  className,
  startIcon,
}: BaseSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const resolvedPlaceholder =
    placeholder ?? (label ? `Select ${label.toLowerCase()}` : 'Select an option');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : defaultValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);

  const [openUpward, setOpenUpward] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedHeight = Math.min(320, options.length * 40 + 8);
      setOpenUpward(spaceBelow < estimatedHeight && spaceAbove > spaceBelow);
    }

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, options.length]);

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
    <div ref={containerRef} className={cn('w-full', className)}>
      {label && (
        <label htmlFor={selectId} className="body-14-bold mb-2 block text-neutral-grey-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-haspopup="listbox"
          aria-invalid={error}
          aria-required={required}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-neutral-grey-1 shadow-none transition-colors',
            sizeClass[size],
            variantBg[variant],
            error
              ? 'border-secondary-red-4 focus:border-secondary-red-4'
              : 'border-neutral-grey-5 hover:border-neutral-grey-4 focus:border-brand-green-2',
            'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            {startIcon && <span className="shrink-0 text-neutral-grey-3">{startIcon}</span>}
            <span
              className={cn(
                'truncate',
                !selectedOption && 'font-normal text-neutral-grey-3',
                selectedOption && 'font-medium text-neutral-grey-1',
              )}
            >
              {selectedOption ? selectedOption.label : resolvedPlaceholder}
            </span>
          </div>
          <span className="ml-3 shrink-0">
            <ChevronDown
              size={16}
              className={cn(
                'text-neutral-grey-3 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
              aria-hidden
            />
          </span>
        </button>

        {isOpen && (
          <div
            id={listboxId}
            role="listbox"
            className={cn(
              'absolute left-0 z-50 max-h-80 w-full animate-fade-in overflow-y-auto rounded-xl border border-neutral-grey-5 bg-white p-1 text-neutral-grey-1 shadow-lg shadow-black/5',
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            )}
          >
            {options.map((opt) => {
              const isSelected = opt.value === currentValue;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-neutral-grey-7/60 font-semibold text-brand-green-2'
                      : 'text-neutral-grey-1 hover:bg-neutral-grey-7',
                    opt.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-green-2" />}
                </div>
              );
            })}
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
