import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function MyPromiseSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Improve."
        headline={
          <div className="heading-80-black uppercase">
            <span className="block text-white">MY</span>
            <span className="block text-brand-green-3">PROMISE</span>
          </div>
        }
        rightSlot={
          <div className="flex w-[715px] flex-col">
            <div className="flex flex-col gap-6">
              <span className="heading-48-medium text-white">I promise myself that I will...</span>
              <div className="flex flex-col gap-4">
                <div className="h-24 w-full rounded-2xl bg-brand-green-4 shadow-inner" />
                <div className="h-24 w-full rounded-2xl bg-brand-green-4 shadow-inner" />
              </div>
            </div>

            <div className="mt-[48px] flex flex-col gap-6">
              <span className="heading-48-medium text-white">Who could support you?</span>
              <div className="h-24 w-full rounded-2xl bg-brand-green-4 shadow-inner" />
            </div>
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
