import { BatteryIcon } from '@/components/icons';
import { cn, resolveImageUrl } from '@/lib/utils';
import { DeltaRow } from './DeltaRow';
import { LiveIndicator } from './LiveIndicator';

export interface LiveSummaryPanelProps {
  clientName?: string | null;
  clientLogoUrl?: string | null;
  departmentName?: string | null;
  score?: number | null;
  zoneLabel?: string | null;
  participantCount?: number | null;
  changeVsPreviousMonth?: number | null;
  previousMonthLabel?: string | null;
  changeVsFirstCheck?: number | null;
  /** Kỳ đã đóng thì truyền 'Closed on …' — thay cho chấm live + "Updated just now" */
  closedLabel?: string | null;
  className?: string;
}

export function LiveSummaryPanel({
  clientName,
  clientLogoUrl,
  departmentName,
  score,
  zoneLabel,
  participantCount,
  changeVsPreviousMonth,
  previousMonthLabel,
  changeVsFirstCheck,
  closedLabel,
  className,
}: LiveSummaryPanelProps) {
  const logoUrl = resolveImageUrl(clientLogoUrl);

  return (
    <div className={cn('flex flex-col justify-between text-white', className)}>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={clientName ?? ''}
              // self-start: không để flex-col kéo giãn khung ảnh hết bề ngang làm logo
              // lệch vào giữa, không thẳng hàng với chữ bên dưới
              className="h-10 w-auto self-start object-contain object-left"
            />
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
          <DeltaRow
            value={changeVsPreviousMonth ?? null}
            label={previousMonthLabel ? `vs ${previousMonthLabel}` : 'vs previous'}
          />
          <DeltaRow value={changeVsFirstCheck ?? null} label="since first check" />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-6">
        {!closedLabel && <LiveIndicator />}
        <div className="flex items-center gap-1.5">
          <span className="body-14-bold text-white">{participantCount ?? '—'}</span>
          <span className="body-14-medium text-white">Participants</span>
          <span className="body-14-medium text-white/80">
            {closedLabel ? `(${closedLabel})` : '(Updated just now)'}
          </span>
        </div>
      </div>
    </div>
  );
}
