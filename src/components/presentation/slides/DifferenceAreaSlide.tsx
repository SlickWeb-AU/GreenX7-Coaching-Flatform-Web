/**
 * Slide 07 — Which One Area Would Make the Biggest Difference?
 */
import { DimensionCardsGrid } from '@/components/presentation/DimensionCardsGrid';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function DifferenceAreaSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Understand."
        headline={
          <div className="heading-56-black uppercase">
            <span className="text-brand-green-3">WHICH </span>
            <span>ONE</span>
            <br />
            <span className="text-brand-green-3">BATTERY AREA</span>
            <br />
            <span className="text-brand-green-3">WOULD MAKE</span>
            <br />
            <span className="text-brand-green-3">THE BIGGEST</span>
            <br />
            <span className="text-brand-green-3">POSITIVE</span>
            <br />
            <span className="text-brand-green-3">DIFFERENCE</span>
            <br />
            <span>RIGHT NOW?</span>
          </div>
        }
        rightSlot={<DimensionCardsGrid />}
      />
    </StandardSlideLayout>
  );
}
