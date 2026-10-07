import type { ReactNode } from 'react';
import Image from 'next/image';
import { HowsYourBatterySticker } from '@/components/icons';
import { COVER_PILLS } from '@/constants/presentation';
import { cn } from '@/lib/utils';
import type { StaticSlideVariant } from '@/types';

export interface StaticSlideProps {
  badge?: string;
  category?: string;
  headline: ReactNode;
  subheadline?: ReactNode;
  body?: ReactNode;
  rightSlot?: ReactNode;
  variant?: StaticSlideVariant;
  className?: string;
  subheadlineClassName?: string;
  /** Cột chữ bên trái — vd QR slide cần rộng hơn để "BATTERY CHECK" nằm một dòng */
  leftClassName?: string;
}

export function StaticSlide({
  badge,
  category,
  headline,
  subheadline,
  body,
  rightSlot,
  variant = 'default',
  className,
  subheadlineClassName,
  leftClassName,
}: StaticSlideProps) {
  if (variant === 'cover') {
    return (
      <div
        className={cn(
          'grid h-full w-full grid-cols-[1fr_1.15fr] items-center gap-[60px] text-white',
          className,
        )}
      >
        <div className="flex w-full flex-col">
          <div className="relative mb-[60px]">
            <span className="sr-only">+ How&apos;s Your Battery? ™</span>
            <HowsYourBatterySticker className="h-auto w-[280px] drop-shadow-2xl" />
          </div>
          <div className="heading-96-black uppercase leading-[0.92]">{headline}</div>
          {body && <div className="body-18-medium mt-6 text-white/80">{body}</div>}
        </div>

        <div className="grid h-full w-full grid-cols-3 items-start gap-4">
          {COVER_PILLS.map((pill) => (
            <div key={pill.src} className={`flex h-full flex-col ${pill.pad}`}>
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={pill.src}
                  alt={pill.alt}
                  fill
                  sizes="(max-width: 1024px) 300px, 600px"
                  unoptimized
                  className={pill.img}
                  priority
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,#63D556_7.21%,rgba(99,213,86,0)_98.15%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      // gap: chữ và khối bên phải không bao giờ dính nhau (bug 374)
      className={cn(
        'flex h-full w-full items-center justify-between gap-16 py-8 text-white',
        className,
      )}
    >
      <div className={cn('flex min-w-0 max-w-xl flex-col', leftClassName)}>
        {badge && (
          <div className="mb-6 inline-flex w-max items-center gap-1.5 rounded-xl bg-brand-green-3 px-3.5 py-1 text-xs font-black text-brand-green-2">
            <span>{badge}</span>
          </div>
        )}
        {category && <span className="body-28-bold mb-10 text-white">{category}</span>}
        <div className="leading-tight">{headline}</div>
        {subheadline && (
          <div className={cn('text-white/90', subheadlineClassName ?? 'mt-6')}>{subheadline}</div>
        )}
        {body && <div className="body-16-medium mt-4 text-white/80">{body}</div>}
      </div>

      {rightSlot && (
        <div className="flex flex-shrink-0 items-center justify-center">{rightSlot}</div>
      )}
    </div>
  );
}
