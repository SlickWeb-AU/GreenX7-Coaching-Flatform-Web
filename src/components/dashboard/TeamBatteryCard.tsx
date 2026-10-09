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
  /**
   * Bản gọn cho slide 11 của bộ trình chiếu: bánh xe 200px, khoảng cách nhỏ hơn —
   * khung slide 1600×900 không đủ chiều cao cho bản đầy đủ của Live Dashboard.
   */
  compact?: boolean;
  className?: string;
}

export function TeamBatteryCard({
  score,
  items,
  previousMonthLabel,
  compact = false,
  className,
}: TeamBatteryCardProps) {
  const wheel = compact ? 200 : 280;
  const { strengths, focus } = calculateStrengthsAndFocus(items);

  return (
    // Design 10: bo góc 24, padding 24, cách khối dưới 32 (bug 369)
    <BaseCard
      className={cn('flex flex-col rounded-3xl p-6', compact ? 'gap-y-5' : 'gap-y-8', className)}
    >
      {/* Cột bánh xe chỉ rộng tối đa 280 — nhường phần còn lại cho thẻ Strengths/Focus
          để hai mục của mỗi thẻ nằm trên một dòng */}
      <div
        className={cn(
          'grid grid-cols-1 items-center gap-x-6 gap-y-6 xl:gap-x-10',
          compact ? 'lg:grid-cols-[200px_1fr]' : 'lg:grid-cols-[280px_1fr]',
        )}
      >
        <div className="w-full" style={{ maxWidth: wheel }}>
          <BatteryWheelChart score={score} items={items} size={wheel} />
        </div>
        <div className="flex flex-col justify-center">
          <WellbeingStrengthsFocusCards strengths={strengths} focus={focus} />
        </div>
      </div>

      <div>
        <WellbeingAreaProgressGrid items={items} previousMonthLabel={previousMonthLabel} />
      </div>
    </BaseCard>
  );
}
