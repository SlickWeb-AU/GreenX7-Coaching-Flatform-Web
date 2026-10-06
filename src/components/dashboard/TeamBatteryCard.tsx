import { BaseCard } from '@/components/base';
import { calculateStrengthsAndFocus } from '@/lib/live';
import { cn } from '@/lib/utils';
import type { WellbeingItemData } from '@/types';
import { BatteryWheelChart } from './BatteryWheelChart';
import { WellbeingAreaProgressGrid } from './WellbeingAreaProgressGrid';
import { WellbeingStrengthsFocusCards } from './WellbeingStrengthsFocusCards';

export interface TeamBatteryCardProps {
  score: number | null;
  items: WellbeingItemData[];
  previousMonthLabel?: string | null;
  className?: string;
}

export function TeamBatteryCard({
  score,
  items,
  previousMonthLabel,
  className,
}: TeamBatteryCardProps) {
  const { strengths, focus } = calculateStrengthsAndFocus(items);

  return (
    <BaseCard className={cn('flex flex-col gap-y-6 p-6 lg:p-8', className)}>
      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-6 lg:grid-cols-[1fr_1fr] xl:gap-x-10">
        <div className="w-full max-w-[280px]">
          <BatteryWheelChart score={score} items={items} size={280} />
        </div>
        <div className="flex flex-col justify-center">
          <WellbeingStrengthsFocusCards strengths={strengths} focus={focus} />
        </div>
      </div>

      <div className="mt-6">
        <WellbeingAreaProgressGrid items={items} previousMonthLabel={previousMonthLabel} />
      </div>
    </BaseCard>
  );
}
