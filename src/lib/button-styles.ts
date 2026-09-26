import { BASE_BUTTON_SIZE_CLASS, BASE_BUTTON_VARIANT_CLASS } from '@/constants/ui';
import { cn } from '@/lib/utils';
import type { BaseButtonStyleOptions, BaseSize } from '@/types/ui';

export function baseButtonSizeClass(size: BaseSize): string {
  return BASE_BUTTON_SIZE_CLASS[size];
}

export function baseButtonClass({
  variant = 'primary',
  size = 'medium',
  pill = false,
  fullWidth = false,
  className,
}: BaseButtonStyleOptions = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg transition-colors outline-none focus-visible:ring-1 focus-visible:ring-brand-green-2 disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-none',
    BASE_BUTTON_SIZE_CLASS[size],
    BASE_BUTTON_VARIANT_CLASS[variant],
    pill && 'rounded-full',
    fullWidth && 'w-full',
    className,
  );
}
