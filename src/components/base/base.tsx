'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function BaseCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-background-card rounded-2xl border border-border p-5', className)}>
      {children}
    </div>
  );
}

export function BaseLoading({
  message = 'Loading...',
  fullScreen = false,
}: {
  message?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12',
        fullScreen && 'min-h-screen',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green-2 border-t-transparent" />
      <p className="body-14-medium text-neutral-grey-3">{message}</p>
    </div>
  );
}

export function BaseErrorState({
  message,
  title = 'Something went wrong',
  onRetry,
}: {
  message: string;
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border px-4 py-12 text-center">
      <p className="body-16-bold mb-1 text-neutral-grey-1">{title}</p>
      <p className="body-14-regular mb-4 max-w-sm text-neutral-grey-2">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-brand-green-2 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function DeltaBadge({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold',
        up ? 'bg-secondary-green-2 text-secondary-green-4' : 'bg-secondary-red-2 text-secondary-red-4',
        className,
      )}
    >
      {up ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg bg-neutral-grey-7 p-1" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium',
            value === opt.value ? 'bg-white text-neutral-grey-1 shadow' : 'text-neutral-grey-2',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function DesktopOnlyNotice({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-grey-8 p-6 text-center">
      <p className="body-18-bold mb-2 text-neutral-grey-1">{title}</p>
      <p className="body-14-medium max-w-sm text-neutral-grey-2">{subtitle}</p>
    </div>
  );
}
