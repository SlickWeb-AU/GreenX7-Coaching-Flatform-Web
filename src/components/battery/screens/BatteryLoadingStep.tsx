'use client';

import { useEffect, useState } from 'react';
import { ClientDepartmentHeader } from '@/components/clients';
import {
  BatteryChargingPillIcon,
  Gx7BadgeRoundIcon,
  HowsYourBatterySticker,
  WheelXsIcon,
} from '@/components/icons';

interface BatteryLoadingStepProps {
  score: number;
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
  onDone: () => void;
}

export function BatteryLoadingStep({
  score,
  clientName,
  departmentName,
  clientLogoUrl,
  onDone,
}: BatteryLoadingStepProps) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const val = Math.round(progress * score);
      setCurrentScore(val);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Trigger completion callback after reaching target
        const timeout = setTimeout(() => {
          onDone();
        }, 300);
        return () => clearTimeout(timeout);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, onDone]);

  return (
    <main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-brand-green-5 text-neutral-grey-1">
      <div className="pointer-events-none absolute -top-8 left-0 z-0 flex max-h-[180px] w-full justify-center overflow-hidden sm:-top-12 sm:max-h-[220px] lg:-top-16 lg:max-h-[240px]">
        <WheelXsIcon className="h-auto w-full max-w-[600px] object-cover opacity-60 sm:max-w-[700px] lg:max-w-[800px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-1600 flex-1 flex-col justify-between px-10 py-8 md:px-[80px] md:py-10">
        <div className="flex w-full items-center justify-center">
          <HowsYourBatterySticker className="h-[170px] w-[170px] cursor-default select-none object-contain drop-shadow-sm sm:h-[210px] sm:w-[210px] md:h-[240px] md:w-[240px]" />
        </div>

        <div className="my-auto flex w-full flex-col items-center py-8">
          <div className="flex w-full justify-center">
            <BatteryChargingPillIcon
              percentage={currentScore}
              className="h-auto max-h-[96px] w-auto max-w-[210px] object-contain drop-shadow-sm sm:max-h-[110px] sm:max-w-[240px]"
            />
          </div>

          <div className="mt-[72px] w-full max-w-[320px] text-left sm:mx-auto sm:max-w-[425px]">
            <p className="body-16-bold text-brand-green-dark sm:text-lg">Loading...</p>
            <h1 className="heading-40-black mt-2 leading-tight text-brand-green-2">
              Sit tight while we calculate your score
            </h1>
          </div>
        </div>

        <footer className="flex w-full items-end justify-between pt-6">
          <div className="flex items-center">
            <ClientDepartmentHeader
              clientName={clientName}
              departmentName={departmentName}
              clientLogoUrl={clientLogoUrl}
              align="left"
            />
          </div>
          <div className="flex items-center">
            <Gx7BadgeRoundIcon className="h-[60px] w-[60px] object-contain" />
          </div>
        </footer>
      </div>
    </main>
  );
}
