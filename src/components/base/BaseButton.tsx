'use client';

import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export type BaseVariant = 'primary' | 'secondary' | 'ghost';
export type BaseSize = 'xs' | 'small' | 'medium' | 'mediumPlus' | 'large';

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BaseVariant;
  size?: BaseSize;
  fullWidth?: boolean;
  loading?: boolean;
  skeleton?: boolean;
  startIcon?: ReactNode;
  asChild?: boolean;
  /** Pill shape (corner radius 999) instead of the default 8. */
  pill?: boolean;
}

const sizeClass: Record<BaseSize, string> = {
  xs: 'h-8 px-2.5 text-xs',
  small: 'h-9 px-3 text-xs',
  medium: 'h-10 px-4 text-sm',
  mediumPlus: 'h-12 px-5 text-base',
  large: 'h-14 px-6 text-base',
};

const variantClass: Record<BaseVariant, string> = {
  primary:
    'border border-transparent bg-brand-green-2 text-white hover:bg-brand-green-2/90 shadow-none',
  secondary:
    'border border-neutral-grey-5 bg-white text-brand-green-2 hover:bg-neutral-grey-8 hover:text-brand-green-2 hover:border-neutral-grey-4 shadow-none',
  ghost:
    'border border-transparent bg-transparent text-neutral-grey-2 hover:bg-neutral-grey-7 hover:text-neutral-grey-1 shadow-none',
};

export function BaseButton({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  skeleton = false,
  startIcon,
  asChild = false,
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
          sizeClass[size],
          className,
        )}
        aria-hidden
      />
    );
  }

  const combinedClassName = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-brand-green-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-none',
    sizeClass[size],
    variantClass[variant],
    pill && 'rounded-full',
    fullWidth && 'w-full',
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(combinedClassName, child.props.className),
    });
  }

  return (
    <button type={type} disabled={disabled || loading} className={combinedClassName} {...props}>
      {loading ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : startIcon}
      {children}
    </button>
  );
}
