/**
 * Slide 06 — Which Battery Area Gives You the Most Energy?
 */
import { DimensionCardsGrid } from '@/components/presentation/DimensionCardsGrid';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function EnergyAreaSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Understand."
        headline={
          <div className="heading-56-black uppercase">
            <span>WHICH</span>
            <br />
            <span className="text-brand-green-3">BATTERY AREA</span>
            <br />
            <span>GIVES YOU THE</span>
            <br />
            <span>MOST ENERGY?</span>
          </div>
        }
        subheadline={
          <span className="body-32-medium block text-white/90">
            What&apos;s helping it stay strong?
          </span>
        }
        subheadlineClassName="mt-4"
        rightSlot={<DimensionCardsGrid />}
      />
    </StandardSlideLayout>
  );
}
