import { StandardSlideLayout } from '@/components/presentation/StandardSlideLayout';
import type { BaseSlideProps } from '@/types';
import { StaticSlide } from '@/components/presentation/StaticSlide';

export function ReflectPromptsSlide(props: BaseSlideProps = {}) {
  return (
    <StandardSlideLayout {...props}>
      <StaticSlide
        category="Reflect."
        headline={
          <div className="heading-80-black flex flex-col uppercase">
            <span className="block text-brand-green-3">BEFORE</span>
            <span className="block whitespace-nowrap text-white">YOU MOVE</span>
            <span className="block text-white">FORWARD</span>
          </div>
        }
        rightSlot={
          <div className="flex w-[715px] flex-col items-center gap-8">
            <div className="w-fit -rotate-[1.69deg] rounded-2xl bg-secondary-yellow-1 px-9 py-8 text-center text-[56px] font-normal leading-tight text-brand-green-1 shadow-xl">
              What went well?
            </div>
            <div className="w-fit rounded-2xl bg-secondary-orange-1 px-9 py-8 text-center text-[56px] font-normal leading-tight text-brand-green-1 shadow-xl">
              What challenged you?
            </div>
            <div className="w-fit -rotate-[1.33deg] rounded-2xl bg-secondary-violet-1 px-9 py-8 text-center text-[56px] font-normal leading-tight text-brand-green-1 shadow-xl">
              What can you improve?
            </div>
          </div>
        }
      />
    </StandardSlideLayout>
  );
}
