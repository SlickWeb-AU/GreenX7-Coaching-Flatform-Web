'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export { formatDayOfMonth, getOrdinalSuffix } from '@/lib/utils';

export type BaseDatePickerSize = 'small' | 'medium' | 'mediumPlus';

export const datePickerSizeClass: Record<BaseDatePickerSize, string> = {
  small: 'h-9 text-xs',
  medium: 'h-10 text-sm',
  mediumPlus: 'h-12 text-base',
};

const sizeClass = datePickerSizeClass;

export interface BaseDatePickerProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: number | string | Date | null;
  defaultValue?: number | string | Date | null;
  onChange?: (day: number, date: Date) => void;
  size?: BaseDatePickerSize;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  startIcon?: ReactNode;
  format?: (date: Date, day: number) => string;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const defaultFormat = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export function BaseDatePicker({
  id,
  label,
  placeholder = 'Select date',
  value,
  defaultValue,
  onChange,
  size = 'medium',
  error = false,
  helperText,
  disabled = false,
  required = false,
  className,
  startIcon,
  format = defaultFormat,
}: BaseDatePickerProps) {
  const generatedId = useId();
  const datePickerId = id ?? generatedId;
  const popoverId = `${datePickerId}-popover`;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewDate, setViewDate] = useState(() => new Date());

  const currentValue = value !== undefined ? value : defaultValue;

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (currentValue === undefined || currentValue === null || currentValue === '') return null;
    if (currentValue instanceof Date) return currentValue;
    if (typeof currentValue === 'number') {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), currentValue);
    }
    const d = new Date(String(currentValue));
    return isNaN(d.getTime()) ? null : d;
  });

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setSelectedDate(null);
    } else if (value instanceof Date) {
      setSelectedDate(value);
    } else if (typeof value === 'number') {
      setSelectedDate((prev) => {
        const y = prev ? prev.getFullYear() : new Date().getFullYear();
        const m = prev ? prev.getMonth() : new Date().getMonth();
        return new Date(y, m, value);
      });
    } else if (typeof value === 'string') {
      const num = Number(value);
      if (!isNaN(num) && num >= 1 && num <= 31) {
        setSelectedDate((prev) => {
          const y = prev ? prev.getFullYear() : new Date().getFullYear();
          const m = prev ? prev.getMonth() : new Date().getMonth();
          return new Date(y, m, num);
        });
      } else {
        const d = new Date(value);
        setSelectedDate(isNaN(d.getTime()) ? null : d);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      setViewDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [isOpen, selectedDate]);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const startingOffset = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return (firstDay + 6) % 7;
  }, [currentYear, currentMonth]);

  const today = useMemo(() => new Date(), []);
  const isCurrentMonthToday =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  const [openUpward, setOpenUpward] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 320 && spaceAbove > spaceBelow);
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
  }, [isOpen]);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    if (disabled) return;
    const d = new Date(currentYear, currentMonth, day);
    setSelectedDate(d);
    onChange?.(day, d);
    setIsOpen(false);
  };

  const displayLabel = useMemo(() => {
    if (!selectedDate) return placeholder;
    return format(selectedDate, selectedDate.getDate());
  }, [selectedDate, format, placeholder]);

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {label && (
        <label htmlFor={datePickerId} className="body-14-bold mb-2 block text-neutral-grey-2">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          id={datePickerId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? popoverId : undefined}
          aria-haspopup="dialog"
          aria-invalid={error}
          aria-required={required}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-neutral-grey-1 shadow-none transition-colors',
            sizeClass[size],
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
                selectedDate === null
                  ? 'font-normal text-neutral-grey-3'
                  : 'font-medium text-neutral-grey-1',
              )}
            >
              {displayLabel}
            </span>
          </div>
          <span className="ml-3 shrink-0">
            <ChevronDownIcon
              className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
              aria-hidden
            />
          </span>
        </button>

        {isOpen && (
          <div
            id={popoverId}
            role="dialog"
            aria-label="Date Picker Calendar"
            className={cn(
              'absolute left-0 z-50 w-72 animate-fade-in select-none rounded-xl border border-neutral-grey-5 bg-white p-3 shadow-lg shadow-black/5',
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            )}
          >
            {/* Header with Month/Year and navigation */}
            <div className="mb-3 flex items-center justify-between">
              <span className="body-14-bold text-neutral-grey-1">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={handlePrevMonth}
                  className="rounded-lg p-1.5 text-neutral-grey-2 transition-colors hover:bg-neutral-grey-7 hover:text-neutral-grey-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={handleNextMonth}
                  className="rounded-lg p-1.5 text-neutral-grey-2 transition-colors hover:bg-neutral-grey-7 hover:text-neutral-grey-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span key={day} className="text-xs font-semibold text-neutral-grey-3">
                  {day}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: startingOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-8 w-8" />
              ))}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const isSelected =
                  selectedDate !== null &&
                  selectedDate.getFullYear() === currentYear &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getDate() === day;
                const isToday = isCurrentMonthToday && today.getDate() === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors',
                      isSelected
                        ? 'bg-brand-green-2 font-bold text-white shadow-sm'
                        : isToday
                          ? 'border border-brand-green-2 font-bold text-brand-green-2 hover:bg-neutral-grey-7'
                          : 'text-neutral-grey-1 hover:bg-neutral-grey-7 hover:text-brand-green-2',
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
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
