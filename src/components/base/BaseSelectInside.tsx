'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';

import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

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
  disabled = false,
  className,
}: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex min-h-[44px] w-auto min-w-[166px] flex-col items-stretch gap-[2px] rounded-lg border border-neutral-grey-5 bg-white px-3 py-1.5 text-left shadow-none transition-colors',
          'hover:border-neutral-grey-4 focus:border-brand-green-2',
          'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className="body-12-medium select-none leading-none text-neutral-grey-3">{label}</span>
        <span className="flex items-center justify-between gap-3">
          <span className="body-16-bold min-w-0 truncate text-neutral-grey-1">
            {selectedOption?.label ?? placeholder ?? value}
          </span>
          <ChevronDownIcon
            className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
            aria-hidden
          />
        </span>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1.5 max-h-80 w-max min-w-full animate-fade-in overflow-y-auto rounded-xl border border-neutral-grey-5 bg-white p-1 text-neutral-grey-1 shadow-lg shadow-black/5"
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
                  'relative flex w-full cursor-pointer select-none items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-neutral-grey-7/60 font-semibold text-brand-green-2'
                    : 'text-neutral-grey-1 hover:bg-neutral-grey-7',
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-green-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
