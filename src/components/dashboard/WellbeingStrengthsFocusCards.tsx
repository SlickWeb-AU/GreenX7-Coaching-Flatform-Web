import { HeartIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { InsightBadgeItem } from '@/types/presentation';
import { AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';

export interface WellbeingStrengthsFocusCardsProps {
  strengths: InsightBadgeItem[];
  focus: InsightBadgeItem[];
  className?: string;
}

export function WellbeingStrengthsFocusCards({
  strengths,
  focus,
  className,
}: WellbeingStrengthsFocusCardsProps) {
  if (strengths.length === 0 && focus.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <InsightGroup
        title="Our Strengths"
        titleClassName="text-brand-green-2"
        cardClassName="bg-secondary-green-2"
        items={strengths}
      />
      <InsightGroup
        title="Our Focus"
        titleClassName="text-secondary-orange-1"
        cardClassName="bg-secondary-orange-2"
        items={focus}
      />
    </div>
  );
}

function InsightGroup({
  title,
  titleClassName,
  cardClassName,
  items,
}: {
  title: string;
  titleClassName?: string;
  cardClassName?: string;
  items: InsightBadgeItem[];
}) {
  return (
    <div className={cn('flex flex-col rounded-2xl p-6', cardClassName)}>
      <h4 className={cn('body-24-bold', titleClassName)}>{title}</h4>
      <div className="mt-8 flex flex-nowrap items-center">
        {items.map((item, idx) => {
          const Icon = AREA_ICON_MAP[item.area] ?? HeartIcon;
          const displayScore =
            item.score === null || item.score === undefined ? '—' : Math.round(item.score);

          return (
            <div key={item.area} className="flex items-center">
              <div className="flex items-center gap-2">
                <Icon size={20} color={AREA_COLOR[item.area]} aria-hidden="true" />
                <span className="body-16-regular whitespace-nowrap text-neutral-grey-1">
                  {item.label}:{' '}
                  <span className="body-16-bold text-neutral-grey-1">{displayScore}</span>
                </span>
              </div>
              {idx < items.length - 1 && (
                <div
                  className="mx-4 h-4 w-[1px] shrink-0 bg-neutral-grey-1/20"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
