import { cn } from '@/lib/utils';

export interface LiveIndicatorProps {
  className?: string;
}

export function LiveIndicator({ className }: LiveIndicatorProps) {
  return (
    <span
      className={cn('relative flex h-4 w-4 shrink-0 items-center justify-center', className)}
      aria-hidden="true"
    >
      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-green-3 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green-3 shadow-live-dot" />
    </span>
  );
}
