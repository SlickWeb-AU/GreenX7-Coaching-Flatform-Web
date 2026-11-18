import { cn } from '@/lib/utils';

export interface LiveIndicatorProps {
  className?: string;
  dotClassName?: string;
}

export function LiveIndicator({ className, dotClassName }: LiveIndicatorProps) {
  return (
    <span
      className={cn('relative flex h-4 w-4 shrink-0 items-center justify-center', className)}
      aria-hidden="true"
    >
      <span
        className={cn(
          'absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-green-3 opacity-75',
          dotClassName,
        )}
      />
      <span
        className={cn(
          'relative inline-flex h-2 w-2 rounded-full bg-brand-green-3 shadow-live-dot',
          dotClassName,
        )}
      />
    </span>
  );
}
