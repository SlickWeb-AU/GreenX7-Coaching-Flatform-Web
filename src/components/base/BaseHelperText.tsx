import { cn } from '@/lib/utils';

export interface BaseHelperTextProps {
  helperText?: string;
  error?: boolean;
  className?: string;
}

export function BaseHelperText({ helperText, error = false, className }: BaseHelperTextProps) {
  if (!helperText) return null;

  return (
    <p
      className={cn(
        'body-14-medium mt-2',
        error ? 'text-secondary-red-4' : 'text-neutral-grey-3',
        className,
      )}
      role={error ? 'alert' : undefined}
    >
      {helperText}
    </p>
  );
}
