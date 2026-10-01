import Image from 'next/image';
import { DIMENSION_CARDS } from '@/constants/presentation';
import { cn } from '@/lib/utils';

export function DimensionCardsGrid({ className }: { className?: string }) {
  return (
    <div className={cn('grid w-[708px] flex-shrink-0 grid-cols-4 gap-[8px]', className)}>
      {DIMENSION_CARDS.map((card) => (
        <div
          key={card.label}
          className="relative h-[240px] w-full overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          <Image
            src={card.src}
            alt={card.label}
            fill
            unoptimized
            sizes="171px"
            className="object-cover"
            priority
          />
          <span className="sr-only">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
