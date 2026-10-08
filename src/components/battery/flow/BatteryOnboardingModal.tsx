import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { BaseButton, BaseIconButton } from '@/components/base';
import { ClientDepartmentHeader } from '@/components/clients';
import {
  GreenX7LogoDark,
  HowItWorksStep1Icon,
  HowItWorksStep2Icon,
  HowItWorksStep3Icon,
  HowItWorksWheelLgIcon,
  HowItWorksWheelSmIcon,
  HowItWorksWheelXsIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    line1: 'It starts with',
    line2: 'self-reflection',
    body: 'Let us review your 8 wellness areas.',
  },
  {
    line1: 'Receive your',
    line2: 'battery score',
    body: 'Your battery score shows you if you are thriving or just surviving.',
  },
  {
    line1: 'Grow happier',
    line2: 'and healthier',
    body: 'Receive your own personalised activity plan to help recharge your battery.',
  },
];

interface BatteryOnboardingModalProps {
  open: boolean;
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
  onClose?: () => void;
  onStart: () => void;
}

export function BatteryOnboardingModal({
  open,
  clientName,
  departmentName,
  clientLogoUrl,
  onStart,
}: BatteryOnboardingModalProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setPaused(false);
    }
  }, [open]);

  const prevStep = useCallback(() => {
    setPaused(true);
    setIndex((i) => (i - 1 + STEPS.length) % STEPS.length);
  }, []);

  const nextStep = useCallback(() => {
    setPaused(true);
    setIndex((i) => (i + 1) % STEPS.length);
  }, []);

  useEffect(() => {
    if (!open || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % STEPS.length), 4500);
    return () => clearTimeout(t);
  }, [open, paused, index]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full animate-fade-in flex-col overflow-y-auto overflow-x-hidden bg-brand-green-5 text-neutral-grey-1">
      <div className="pointer-events-none absolute right-0 top-0 z-0 sm:hidden">
        <HowItWorksWheelXsIcon className="h-[min(290px,40vh)] w-auto object-contain" />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-0 hidden w-full sm:block lg:hidden">
        <HowItWorksWheelSmIcon className="h-auto max-h-[290px] w-full object-contain" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 lg:block">
        <HowItWorksWheelLgIcon className="h-[250px] w-auto min-w-[630px] object-contain opacity-70" />
      </div>

      <div className="mx-auto flex min-h-dvh min-h-screen w-full max-w-1600 flex-col justify-between px-10 pt-10 sm:px-10 sm:pt-10 md:px-12 md:pt-12 lg:px-16 lg:pt-16">
        <header className="mb-8 flex w-full items-center justify-center md:mb-[60px]">
          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="center"
            logoClassName="h-8 sm:h-10"
            nameClassName="text-neutral-grey-1"
            departmentClassName="text-neutral-grey-1"
          />
        </header>

        <section className="relative my-auto flex w-full flex-col items-center justify-center">
          <BaseIconButton
            size={44}
            pill
            aria-label="Previous step"
            onClick={prevStep}
            className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 border border-brand-green-2 bg-transparent text-brand-green-2 transition-colors hover:bg-brand-green-2/10 hover:text-brand-green-2 sm:inline-flex"
            icon={<ChevronLeft size={24} />}
          />

          <BaseIconButton
            size={44}
            pill
            aria-label="Next step"
            onClick={nextStep}
            className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 border border-brand-green-2 bg-transparent text-brand-green-2 transition-colors hover:bg-brand-green-2/10 hover:text-brand-green-2 sm:inline-flex"
            icon={<ChevronRight size={24} />}
          />

          <div
            className="flex w-full select-none flex-col items-start text-left sm:items-center sm:text-center"
            onTouchStart={(e) => {
              setPaused(true);
              setTouchX(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              if (touchX === null) return;
              const dx = e.changedTouches[0].clientX - touchX;
              if (dx <= -40) nextStep();
              else if (dx >= 40) prevStep();
              setTouchX(null);
            }}
            onClick={() => setPaused(true)}
          >
            <div className="mb-4 flex h-[160px] w-full items-center justify-center sm:h-[200px]">
              {index === 0 && (
                <HowItWorksStep1Icon className="h-[160px] w-[160px] object-contain sm:h-[200px] sm:w-[200px]" />
              )}
              {index === 1 && (
                <HowItWorksStep2Icon className="h-auto max-h-[84px] w-auto max-w-[183px] object-contain sm:max-h-[104px] sm:max-w-[228px]" />
              )}
              {index === 2 && (
                <HowItWorksStep3Icon className="h-[160px] w-[160px] object-contain sm:h-[200px] sm:w-[200px]" />
              )}
            </div>

            <p className="body-16-bold mb-2 w-full text-left text-brand-green-dark sm:text-center">
              How it works
            </p>

            <h2 className="heading-48-black mb-2 w-full text-left leading-tight sm:text-center">
              <span className="text-brand-green-2">{STEPS[index].line1}</span>
              <br />
              <span className="text-secondary-orange-1">{STEPS[index].line2}</span>
            </h2>

            <p className="body-18-medium min-h-[72px] w-full text-left text-brand-green-2 sm:text-center">
              {STEPS[index].body}
            </p>

            <div
              className="mb-8 flex h-16 w-full items-center justify-center gap-2.5"
              role="tablist"
              aria-label="Walkthrough steps"
            >
              {STEPS.map((s, i) => (
                <button
                  key={s.line2}
                  role="tab"
                  type="button"
                  aria-selected={i === index}
                  aria-label={`Step ${i + 1}`}
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                  }}
                  className={cn(
                    'cursor-pointer rounded-full transition-all duration-300',
                    i === index
                      ? 'h-3 w-[30px] bg-brand-green-2'
                      : 'h-3 w-3 bg-brand-green-2/40 hover:bg-brand-green-2/60',
                  )}
                />
              ))}
            </div>

            <div className="flex w-full items-center justify-center">
              <BaseButton
                variant="custom"
                size="large"
                pill
                onClick={onStart}
                className="w-[240px] bg-brand-green-3 text-brand-green-2 transition-opacity hover:opacity-90"
              >
                Start Battery Check
              </BaseButton>
            </div>
          </div>
        </section>

        <div>
          <footer className="flex w-full flex-col items-center justify-center pt-8 md:pt-10">
            <GreenX7LogoDark className="h-10 w-auto" />
          </footer>
          <div aria-hidden className="h-[50px]" />
        </div>
      </div>
    </div>
  );
}
