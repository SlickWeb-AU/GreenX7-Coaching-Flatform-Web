import { BoltIcon } from '@/components/icons';
import type { AreaIcon } from '@/constants/dashboard';
import { cn } from '@/lib/utils';

export interface AreaScoreProgressBarProps {
  label: string;
  badgeBg: string;
  iconColor: string;
  barColor: string;
  score: number;
  displayValue?: number | string | null;
  Icon: AreaIcon;
  active?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function AreaScoreProgressBar({
  label,
  badgeBg,
  iconColor,
  barColor,
  score,
  displayValue,
  Icon,
  active = true,
  size = 'md',
  className,
}: AreaScoreProgressBarProps) {
  const isSm = size === 'sm';

  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center justify-between', isSm ? 'mb-1.5' : 'mb-2')}>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-full',
              isSm ? 'h-7 w-7' : 'h-6 w-6',
              badgeBg,
            )}
          >
            <Icon size={isSm ? 14 : 12} color={iconColor} aria-hidden="true" />
          </div>
          <span className={cn('text-neutral-grey-1', isSm ? 'body-14-bold' : 'body-16-medium')}>
            {label}
          </span>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 leading-none text-neutral-grey-1',
            isSm ? 'body-14-bold' : 'text-[16px] font-black',
          )}
        >
          <span>{displayValue ?? score ?? '—'}</span>
          <BoltIcon size={isSm ? 12 : 14} aria-hidden="true" />
        </div>
      </div>

      <div className={cn('w-full overflow-hidden rounded-full', isSm ? 'h-1.5' : 'h-2', badgeBg)}>
        <div
          className={cn('h-full rounded-full transition-all duration-[1500ms] ease-out', barColor)}
          style={{
            width: active ? `${Math.min(100, Math.max(0, score))}%` : '0%',
          }}
        />
      </div>
    </div>
  );
}
