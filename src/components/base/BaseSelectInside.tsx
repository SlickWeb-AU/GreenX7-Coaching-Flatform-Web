'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type BaseSelectInsideVariant = 'primary' | 'secondary';

const variantClasses: Record<BaseSelectInsideVariant, string> = {
  primary: 'border-neutral-grey-5 bg-white hover:border-neutral-grey-4 focus:border-brand-green-2',
  secondary: 'border-white bg-neutral-grey-8 hover:bg-neutral-grey-7 focus:bg-neutral-grey-7',
};

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export function BaseSelectInside<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  variant = 'primary',
  disabled = false,
  readOnly = false,
  className,
  containerClassName,
}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  variant?: BaseSelectInsideVariant;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  containerClassName?: string;
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const resolvedPlaceholder =
    placeholder ?? (label ? `Select ${label.toLowerCase()}` : 'Select an option');

  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
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

  return (
    <div ref={containerRef} className={cn('relative inline-block', containerClassName)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && !readOnly && setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex min-h-11 w-auto min-w-[166px] flex-col items-stretch gap-0.5 rounded-lg border px-3 py-1 text-left shadow-none transition-colors',
          variantClasses[variant],
          isOpen && (variant === 'primary' ? 'border-brand-green-2' : 'bg-neutral-grey-7'),
          'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          disabled && 'cursor-not-allowed opacity-50',
          readOnly && 'cursor-default',
          className,
        )}
      >
        <span className="body-14-medium select-none leading-none text-neutral-grey-3">{label}</span>
        <span className="flex items-center justify-between gap-3">
          <span className="body-16-bold min-w-0 truncate text-neutral-grey-1">
            {selectedOption?.label ?? (value ? value : resolvedPlaceholder)}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              'shrink-0 text-neutral-grey-3 transition-transform duration-200',
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
            'absolute left-0 z-50 max-h-80 w-max min-w-full animate-fade-in overflow-y-auto rounded-lg border border-neutral-grey-6 bg-white p-1 text-neutral-grey-2 shadow-lg shadow-black/5',
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'body-16-medium relative flex w-full cursor-pointer select-none items-center justify-between gap-4 rounded-md p-2 text-neutral-grey-2 transition-colors hover:bg-brand-green-5 hover:text-neutral-grey-1',
                  isSelected && 'bg-brand-green-5 font-semibold text-neutral-grey-1',
                )}
              >
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
