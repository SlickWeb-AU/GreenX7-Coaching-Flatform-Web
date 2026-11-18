import { cn } from '@/lib/utils';

export interface BaseDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function BaseDivider({ orientation = 'horizontal', className }: BaseDividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === 'horizontal'
          ? 'w-full border-t border-neutral-grey-6'
          : 'h-full border-l border-neutral-grey-6',
        className,
      )}
    />
  );
}
