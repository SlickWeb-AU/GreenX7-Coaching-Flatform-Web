import { cn } from '@/lib/utils';

export interface DeltaRowProps {
  value: number | null | undefined;
  label: string;
}

export function DeltaRow({ value, label }: DeltaRowProps) {
  if (value === null || value === undefined) {
    return (
      <div className="flex items-center gap-2">
        <span className="body-14-bold rounded-full bg-neutral-grey-3 px-1 text-white">—</span>
        <span className="body-16-medium text-white/80">{label}</span>
      </div>
    );
  }
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'body-14-bold rounded-full px-1 text-white',
          rounded >= 0 ? 'bg-secondary-green-4' : 'bg-secondary-red-4',
        )}
      >
        {rounded >= 0 ? `+${rounded}%` : `${rounded}%`}
      </span>
      <span className="body-16-medium text-white/80">{label}</span>
    </div>
  );
}
