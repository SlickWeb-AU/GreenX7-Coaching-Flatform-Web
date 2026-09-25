'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface BaseIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Square size (width & height) in px. */
  size?: number;
  icon: ReactNode;
  pill?: boolean;
}

export function BaseIconButton({
  size = 32,
  icon,
  pill = false,
  className,
  style,
  type = 'button',
  ...props
}: BaseIconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg text-neutral-grey-2 outline-none transition-colors hover:bg-neutral-grey-7 hover:text-neutral-grey-1 focus-visible:ring-1 focus-visible:ring-brand-green-2 disabled:cursor-not-allowed disabled:opacity-50',
        pill && 'rounded-full',
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {icon}
    </button>
  );
}

export default BaseIconButton;
