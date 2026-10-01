/**
 * Slide 02 — 8 Areas. One Battery.
 */
import { DimensionRadialOrbit } from '@/components/presentation/DimensionRadialOrbit';
import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function EightAreasSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        headline={
          <div className="heading-80-black flex flex-col uppercase">
            <span className="block text-brand-green-3">8 AREAS.</span>
            <span className="block text-white">ONE</span>
            <span className="block text-white">BATTERY.</span>
          </div>
        }
        rightSlot={<DimensionRadialOrbit />}
      />
    </StandardSlideLayout>
  );
}
