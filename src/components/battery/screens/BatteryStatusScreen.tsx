import { BaseButton, BaseDivider } from '@/components/base';
import { ClientDepartmentHeader } from '@/components/clients';
import {
  BatteryStatusBottomRightWave,
  BatteryStatusCalendarIcon,
  BatteryStatusCheckIcon,
  BatteryStatusTopLeftWave,
  GreenX7LogoDark,
} from '@/components/icons';
import { ENV } from '@/constants';
import { formatCheckInDate, getMonthName } from '@/lib/utils';
import { cn } from '@/lib/utils';

export type BatteryStatusVariant = 'closed' | 'submitted';

export interface BatteryStatusScreenProps {
  variant: BatteryStatusVariant;
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
  nextOpensAt?: string | Date | null;
  timeZone?: string | null;
  periodMonth?: number | null;
  periodYear?: number | null;
  periodName?: string | null;
  onReturn?: () => void;
  className?: string;
}

export function BatteryStatusScreen({
  variant,
  clientName,
  departmentName,
  clientLogoUrl,
  nextOpensAt,
  timeZone,
  periodMonth,
  periodYear,
  periodName,
  onReturn,
  className,
}: BatteryStatusScreenProps) {
  const isSubmitted = variant === 'submitted';

  // Subtitle resolution for submitted check-in
  const monthName = periodName || getMonthName(periodMonth);
  const periodLabel = [monthName, periodYear].filter(Boolean).join(' ');
  const targetLabel = [clientName, departmentName].filter(Boolean).join(' ');
  const checkInTarget = targetLabel
    ? `Your anonymous response is included in ${targetLabel}’s ${periodLabel ? `${periodLabel} ` : ''}check-in.`
    : 'Your anonymous response is included in this department’s check-in.';

  // Next opening date resolution for closed check-in
  const formattedNextDate = formatCheckInDate(nextOpensAt, timeZone);

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else if (typeof window !== 'undefined') {
      window.location.href = ENV.GREENX7_URL;
    }
  };

  return (
    <main
      className={cn(
        'relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-neutral-grey-8 px-7 pb-8 pt-6 text-center sm:px-8 sm:pb-10 sm:pt-8',
        className,
      )}
    >
      {/* Decorative Wave - Top Left */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 select-none opacity-40 sm:opacity-50">
        <BatteryStatusTopLeftWave />
      </div>

      {/* Decorative Wave - Bottom Right */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 select-none opacity-40 sm:opacity-50">
        <BatteryStatusBottomRightWave />
      </div>

      {/* Header: Logo GreenX (dark) with 32px bottom margin, followed by Client & Department */}
      <header className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex items-center justify-center">
          <GreenX7LogoDark className="h-7 w-auto" />
        </div>
        <ClientDepartmentHeader
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          align="center"
          logoClassName="h-9 sm:h-10 w-auto object-contain"
          nameClassName="body-16-bold text-neutral-grey-1"
          departmentClassName="body-14-medium text-neutral-grey-1 mt-0.5"
        />
      </header>

      {/* Center Body: Centered horizontally and vertically */}
      <section className="relative z-10 mx-auto my-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-6">
        {/* Icon Wrap: Size 76px, bg-secondary-green-2 for submit, bg-secondary-orange-2 for closed */}
        <div
          className={cn(
            'flex h-[76px] w-[76px] items-center justify-center rounded-full',
            isSubmitted ? 'bg-secondary-green-2' : 'bg-secondary-orange-2',
          )}
        >
          {isSubmitted ? (
            <BatteryStatusCheckIcon size={40} />
          ) : (
            <BatteryStatusCalendarIcon size={40} />
          )}
        </div>

        {/* Title: 24px below icon, Body/24px/Bold, grey 1 */}
        <h1 className="body-24-bold mt-6 text-neutral-grey-1">
          {isSubmitted
            ? 'Your Battery Check has already been submitted.'
            : 'Battery Submissions Are Closed'}
        </h1>

        {/* Separator divider using shared BaseDivider (neutral grey 6 #DFE5E1) */}
        <BaseDivider className="mt-6 w-full" />

        {/* Primary Message: Body/14px/Medium, grey 1 */}
        <p className="body-14-medium mt-6 text-neutral-grey-1">
          {isSubmitted ? (
            'Thank you for taking part.'
          ) : formattedNextDate ? (
            <>
              The next check-in will open on <br />
              <strong className="font-bold">{formattedNextDate}.</strong>
            </>
          ) : (
            'The current check-in window has ended.'
          )}
        </p>

        {/* Secondary Message: directly below, Body/12px/Medium, grey 2 */}
        <p className="body-12-medium mt-1.5 max-w-[320px] leading-relaxed text-neutral-grey-2">
          {isSubmitted ? checkInTarget : 'Please return when the next check-in opens.'}
        </p>

        {/* Action Button: below messages, same style as Start Battery Check */}
        <div className="mt-8 flex w-full justify-center sm:mt-10">
          <BaseButton
            variant="custom"
            size="large"
            pill
            onClick={handleReturn}
            className="min-w-[240px] bg-brand-green-3 px-8 font-bold text-brand-green-2 transition-all hover:opacity-90 active:scale-[0.99]"
          >
            Return to GreenX7
          </BaseButton>
        </div>
      </section>

      {/* Empty footer spacer to maintain perfect vertical center balance */}
      <footer className="relative z-10 h-0 w-full" aria-hidden="true" />
    </main>
  );
}
