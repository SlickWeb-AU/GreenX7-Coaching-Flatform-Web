import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function MakeItEasySlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Improve."
        headline={
          <div className="heading-80-black uppercase">
            <span className="block text-white">MAKE</span>
            <span className="block">
              <span className="text-white">IT </span>
              <span className="text-brand-green-3">EASY</span>
            </span>
          </div>
        }
        rightSlot={
          <div className="flex w-[750px] flex-col">
            {/* Nhãn 160 + khoảng cách 24 + ô nhập 566 (bug 372) */}
            <div className="flex flex-col gap-[48px]">
              <div className="flex items-center gap-6">
                <span className="heading-48-medium min-w-[160px] shrink-0 text-white">After I</span>
                <div className="h-[136px] w-[566px] shrink-0 rounded-2xl bg-brand-green-4 shadow-inner" />
              </div>

              <div className="flex items-center gap-6">
                <span className="heading-48-medium min-w-[160px] shrink-0 text-white">I will</span>
                <div className="h-[136px] w-[566px] shrink-0 rounded-2xl bg-brand-green-4 shadow-inner" />
              </div>
            </div>

            <p className="heading-48-medium mt-[64px] text-white">
              If I miss one day, I&apos;ll simply start again tomorrow.
            </p>
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
