/**
 * Slide 11 — Team Battery (Live Result)
 */
import { BatteryIcon } from '@/components/icons';
import { DeltaRow } from '@/components/dashboard/DeltaRow';
import { TeamBatteryCard } from '@/components/dashboard/TeamBatteryCard';
import { usePresentation } from '@/components/presentation/PresentationContext';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import { StaticSlide } from '@/components/presentation/StaticSlide';
import type { BaseSlideProps } from '@/types';

export function TeamBatterySlide({ ...layoutProps }: BaseSlideProps = {}) {
  const pres = usePresentation();
  const items = pres.items;
  const score = pres.score;
  const previousMonthLabel = pres.previousMonthLabel;
  const vsPreviousChange = pres.data?.vsPrevious?.change ?? null;
  const vsFirstCheckChange = pres.data?.vsFirstCheck?.change ?? null;
  const zoneLabel = pres.data?.zone?.label ?? null;

  return (
    <StandardSlideLayout {...layoutProps}>
      <StaticSlide
        category="Reflect."
        headline={
          <div className="heading-80-black uppercase leading-tight">
            <span className="block text-white">TEAM</span>
            <span className="block text-brand-green-3">BATTERY</span>
          </div>
        }
        body={
          <div className="flex flex-col">
            <div className="mt-4 flex flex-col gap-3">
              <BatteryIcon percentage={score ?? 0} className="h-auto w-24" />
              <div className="flex items-baseline gap-2">
                <span className="heading-48-bold leading-none text-white">
                  {score == null ? '—' : Math.round(score)}
                </span>
                <div className="flex flex-col">
                  <span className="caption-12-medium text-white/80">Battery score</span>
                  <span className="caption-12-bold font-semibold text-secondary-orange-1">
                    {zoneLabel ?? '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex max-w-[240px] flex-col gap-2 border-t border-white/20 pt-4">
              <DeltaRow
                value={vsPreviousChange}
                label={previousMonthLabel ? `vs ${previousMonthLabel}` : 'vs previous'}
              />
              <DeltaRow value={vsFirstCheckChange} label="since first check" />
            </div>
          </div>
        }
        rightSlot={
          <TeamBatteryCard score={score} items={items} previousMonthLabel={previousMonthLabel} />
        }
      />
    </StandardSlideLayout>
  );
}
