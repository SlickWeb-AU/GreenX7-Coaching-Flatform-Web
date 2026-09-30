import { BatteryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { LiveIndicator } from './LiveIndicator';

export interface LiveSummaryPanelProps {
  clientName?: string | null;
  whiteLogoUrl?: string | null;
  clientLogoUrl?: string | null;
  departmentName?: string | null;
  score?: number | null;
  zoneLabel?: string | null;
  participantCount?: number | null;
  changeVsPreviousMonth?: number | null;
  previousMonthLabel?: string | null;
  changeVsFirstCheck?: number | null;
  className?: string;
}

export function LiveSummaryPanel({
  clientName,
  whiteLogoUrl,
  clientLogoUrl,
  departmentName,
  score,
  zoneLabel,
  participantCount,
  changeVsPreviousMonth,
  previousMonthLabel,
  changeVsFirstCheck,
  className,
}: LiveSummaryPanelProps) {
  const logoUrl = whiteLogoUrl ?? clientLogoUrl;

  return (
    <div className={cn('flex flex-col justify-between text-white', className)}>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={clientName ?? ''} className="h-10 w-auto object-contain" />
          ) : (
            <div className="body-24-bold uppercase tracking-wide text-neutral-grey-8">
              {clientName ?? '—'}
            </div>
          )}
          <span className="body-20-medium text-neutral-grey-8">{departmentName ?? '—'}</span>
        </div>

        <h1 className="heading-48-bold mt-2 leading-tight text-white">
          How is <span className="text-secondary-orange-1">your</span>
          <br />
          <span className="text-secondary-orange-1">battery</span> today?
        </h1>

        <div className="mt-8 flex flex-col gap-2">
          <BatteryIcon percentage={score ?? 0} />
          <div className="flex items-center gap-2">
            <span className="heading-48-bold leading-none text-white">
              {score === null || score === undefined ? '—' : Math.round(score)}
            </span>
            <div className="flex flex-col gap-[0.125rem]">
              <span className="body-16-medium leading-none text-white/80">Battery score</span>
              <span className="body-16-bold leading-none text-secondary-orange-1">
                {zoneLabel ?? '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-white/20" />

        <div className="flex flex-col gap-1.5">
          <ChangeRow
            value={changeVsPreviousMonth ?? null}
            label={previousMonthLabel ? `vs ${previousMonthLabel}` : 'vs previous'}
          />
          <ChangeRow value={changeVsFirstCheck ?? null} label="since first check" />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-8">
        <LiveIndicator />
        <div className="flex items-center gap-1.5">
          <span className="body-14-bold text-white">{participantCount ?? '—'}</span>
          <span className="body-14-medium text-white/80">Participants (Updated just now)</span>
        </div>
      </div>
    </div>
  );
}

function ChangeRow({ value, label }: { value: number | null; label: string }) {
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
