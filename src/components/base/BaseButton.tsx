'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { BaseSize, BaseVariant } from '@/types/ui';

import { baseButtonClass, baseButtonSizeClass } from '@/lib/button-styles';

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BaseVariant;
  size?: BaseSize;
  fullWidth?: boolean;
  loading?: boolean;
  skeleton?: boolean;
  startIcon?: ReactNode;
  /** Pill shape (corner radius 999) instead of the default 8. */
  pill?: boolean;
}

export function BaseButton({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  skeleton = false,
  startIcon,
  pill = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: BaseButtonProps) {
  if (skeleton) {
    return (
      <div
        className={cn(
          'w-full animate-pulse rounded-lg bg-neutral-grey-7',
          baseButtonSizeClass(size),
          className,
        )}
        aria-hidden
      />
    );
  }

  const combinedClassName = baseButtonClass({ variant, size, pill, fullWidth, className });

  return (
    <button type={type} disabled={disabled || loading} className={combinedClassName} {...props}>
      {loading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : startIcon}
      {children}
    </button>
  );
}
