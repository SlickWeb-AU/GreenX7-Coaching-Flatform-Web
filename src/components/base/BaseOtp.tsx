'use client';

import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

export interface BaseOtpProps {
  label?: string;
  size?: 'medium' | 'mediumPlus';
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export function BaseOtp({
  label,
  value,
  onChange,
  error = false,
  helperText,
  className,
}: BaseOtpProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pastedData) return;

    const startIndex = pastedData.length >= value.length ? 0 : index;
    const next = [...value];
    let lastFilledIndex = startIndex;

    for (let offset = 0; offset < pastedData.length && startIndex + offset < value.length; offset++) {
      const char = pastedData[offset];
      if (char !== undefined) {
        next[startIndex + offset] = char;
        lastFilledIndex = startIndex + offset;
      }
    }

    onChange(next);
    const focusTarget = Math.min(lastFilledIndex, value.length - 1);
    refs.current[focusTarget]?.focus();
  };

  const handleChange = (index: number, digit: string) => {
    const clean = digit.replace(/\D/g, '');

    // Handle mobile auto-fill pasting multiple digits into a single input
    if (clean.length > 1) {
      const startIndex = clean.length >= value.length ? 0 : index;
      const next = [...value];
      let lastFilledIndex = startIndex;

      for (let offset = 0; offset < clean.length && startIndex + offset < value.length; offset++) {
        const char = clean[offset];
        if (char !== undefined) {
          next[startIndex + offset] = char;
          lastFilledIndex = startIndex + offset;
        }
      }

      onChange(next);
      const focusTarget = Math.min(lastFilledIndex, value.length - 1);
      refs.current[focusTarget]?.focus();
      return;
    }

    const singleDigit = clean.slice(-1);
    const next = [...value];
    next[index] = singleDigit;
    onChange(next);
    if (singleDigit && index < value.length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < value.length - 1) {
      refs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="body-14-bold mb-2 text-neutral-grey-2">{label}</p>}
      <div className="flex w-full gap-2 sm:gap-3">
        {value.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onPaste={(e) => handlePaste(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              'h-12 flex-1 min-w-0 rounded-lg border text-center text-base font-medium',
              error ? 'border-secondary-red-4' : 'border-neutral-grey-5',
              'outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent',
            )}
          />
        ))}
      </div>
      {helperText && (
        <p
          className={cn(
            'body-16-medium mt-2',
            error ? 'text-secondary-red-4' : 'text-neutral-grey-3',
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
