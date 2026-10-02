import { ArrowLeftIcon } from 'lucide-react';

import { BaseButton, BaseIconButton } from '@/components/base';
import { AREA_COLOR, AREA_ICON_MAP } from '@/constants/dashboard';
import { BatterySlider } from './BatterySlider';

export const BATTERY_QUESTION_COPY: Record<string, string> = {
  Physical: 'How is your energy, vitality and your enthusiasm to move?',
  Sleep: 'How is your sleep quality and how rested do you feel?',
  Nutrition: 'How nourishing are your food and drink choices?',
  Fun: 'How much play, laughter and enjoyment is in your life?',
  Mindset: 'How positive and resilient is your mindset right now?',
  Friendships: 'How connected do you feel to your friends?',
  Relationships: 'How supported do you feel in your close relationships?',
  Purpose: 'How clear and purposeful does your life feel right now?',
};

interface BatteryQuestionStepProps {
  index: number;
  area: string;
  value: number | null;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BatteryQuestionStep({
  index,
  area,
  value,
  onChange,
  onNext,
  onBack,
}: BatteryQuestionStepProps) {
  const Icon = AREA_ICON_MAP[area];
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-3">
        <BaseIconButton aria-label="Back" onClick={onBack} icon={<ArrowLeftIcon size={20} />} />
        <h1 className="body-16-bold text-neutral-grey-1">Battery Check</h1>
        <span className="body-14-medium text-neutral-grey-2">{`${index + 1} of 8`}</span>
      </header>
      <div className="h-1 w-full bg-neutral-grey-7">
        <div
          className="h-full bg-brand-green-2 transition-all duration-300"
          style={{ width: `${((index + 1) / 8) * 100}%` }}
        />
      </div>
      <section className="flex flex-1 flex-col items-center px-6 py-8 text-center">
        {Icon && (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-grey-8">
            <Icon size={48} color={AREA_COLOR[area]} />
          </div>
        )}
        <h2 className="heading-32-bold mt-4 text-neutral-grey-1">{area}</h2>
        <p className="body-16-regular mt-2 max-w-sm text-neutral-grey-2">
          {BATTERY_QUESTION_COPY[area]}
        </p>
        <div className="mt-8 w-full max-w-md">
          <BatterySlider value={value} onChange={onChange} />
        </div>
      </section>
      <footer className="px-6 pb-8">
        <BaseButton pill className="w-full" disabled={value === null} onClick={onNext}>
          Next
        </BaseButton>
      </footer>
    </main>
  );
}
