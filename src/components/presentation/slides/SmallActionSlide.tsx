import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function SmallActionSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Improve."
        headline={
          <div className="heading-80-black flex flex-col uppercase">
            <span className="block text-brand-green-3">WHAT&apos;S ONE</span>
            <span className="block text-brand-green-3">SMALL ACTION</span>
            <span className="block text-brand-green-3">YOU WILL</span>
            <div className="flex items-center gap-2">
              <span className="text-white">ACTUALLY</span>
              <span className="text-brand-green-3">DO?</span>
            </div>
          </div>
        }
        rightSlot={
          <div
            // 580 thay 715: chừa đủ chỗ cho "SMALL ACTION" (80px) không lấn sang thẻ
            className="flex w-[580px] flex-col items-center gap-8"
          >
            <div className="heading-48-bold flex w-fit -rotate-[1.69deg] items-center justify-center rounded-2xl bg-secondary-red-1 px-9 py-8 text-center text-brand-green-1 shadow-xl">
              <span>
                Less than
                <br />
                10 minutes?
              </span>
            </div>
            <div className="heading-48-bold flex w-fit items-center justify-center rounded-2xl bg-secondary-cyan-1 px-9 py-8 text-center text-brand-green-1 shadow-xl">
              Easy to repeat?
            </div>
            <div className="heading-48-bold flex w-fit -rotate-[1.33deg] items-center justify-center rounded-2xl bg-secondary-violet-1 px-9 py-8 text-center text-brand-green-1 shadow-xl">
              <span>
                Makes me feel
                <br />
                1% better?
              </span>
            </div>
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
