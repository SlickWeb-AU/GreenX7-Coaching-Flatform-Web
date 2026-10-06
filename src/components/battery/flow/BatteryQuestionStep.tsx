import { ArrowLeft } from 'lucide-react';
import { BaseButton, BaseIconButton } from '@/components/base';
import { BATTERY_AREA_THEMES } from '@/constants/battery';
import { AREA_ICON_MAP } from '@/constants/dashboard';
import { normalizeAreaLabel } from '@/lib/battery';
import { cn } from '@/lib/utils';
import type { BatteryAreaPromptDto } from '@/types/battery';
import { BatterySlider } from '../ui/BatterySlider';

interface BatteryQuestionStepProps {
  index: number;
  total: number;
  prompt: BatteryAreaPromptDto;
  scoreMin: number;
  scoreMax: number;
  value: number | null;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BatteryQuestionStep({
  index,
  total,
  prompt,
  scoreMin,
  scoreMax,
  value,
  onChange,
  onNext,
  onBack,
}: BatteryQuestionStepProps) {
  const area = normalizeAreaLabel(prompt.area);
  const Icon = AREA_ICON_MAP[area];
  const theme = BATTERY_AREA_THEMES[area] ?? BATTERY_AREA_THEMES.Physical;
  const title = prompt.title || (area === 'Physical' ? 'Physical health' : area);

  return (
    <main className={cn('relative flex min-h-screen w-full flex-col', theme.bodyBg)}>
      <header className={cn('flex w-full flex-col', theme.headerBg)}>
        <div className="flex w-full items-center justify-between p-4 md:px-8">
          <BaseIconButton
            size={32}
            aria-label="Back"
            onClick={onBack}
            className="md:!h-10 md:!w-10"
            icon={
              <>
                <ArrowLeft size={24} className="text-black md:hidden" />
                <ArrowLeft size={32} className="hidden text-black md:block" />
              </>
            }
          />
          <h1 className="body-16-medium md:body-20-bold text-black">Battery Check</h1>
          <div className="body-16-regular md:body-24-regular text-black">
            <span className="md:body-24-black font-black text-black">{index + 1}</span> of {total}
          </div>
        </div>

        <div className="relative -bottom-1 flex h-2 w-full items-center">
          <div className="absolute inset-x-0 h-[2px] bg-[#1A1A1A]/20" />
          <div
            className="relative h-2 rounded-r-[10px] bg-brand-green-2 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <div className={cn('flex flex-1 flex-col justify-center px-10 py-12', theme.bodyBg)}>
        <div className="mb-12 w-full max-w-[320px] md:mx-auto md:flex md:max-w-[425px] md:flex-col md:items-center md:text-center">
          {Icon && (
            <div className="mb-5 md:mb-6">
              <Icon size={40} color={theme.color} className="md:hidden" />
              <Icon size={60} color={theme.color} className="hidden md:block" />
            </div>
          )}
          <h2 className="heading-36-bold md:heading-48-black mb-2 leading-tight text-black md:mb-4">
            {title}
          </h2>
          <p className="body-18-medium md:body-24-medium min-h-[72px] text-black md:min-h-[90px]">
            {prompt.question}
          </p>
        </div>

        <div className="mx-auto mb-[180px] w-full max-w-[1256px] md:mb-[115px]">
          <BatterySlider
            value={value}
            min={scoreMin}
            max={scoreMax}
            color={theme.color}
            bgColor={theme.bgColor}
            onChange={onChange}
          />
        </div>

        <div className="flex w-full justify-center">
          <BaseButton
            variant="custom"
            size="xlarge"
            pill
            disabled={value === null}
            onClick={onNext}
            className={cn('min-w-[240px] text-black shadow-none transition-all', theme.buttonBg)}
          >
            Next
          </BaseButton>
        </div>
      </div>
    </main>
  );
}
