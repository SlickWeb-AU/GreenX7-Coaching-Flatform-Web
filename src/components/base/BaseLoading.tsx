'use client';

import { cn } from '@/lib/utils';

export interface BaseLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function BaseLoading({ message = 'Loading...', fullScreen = false }: BaseLoadingProps) {
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
