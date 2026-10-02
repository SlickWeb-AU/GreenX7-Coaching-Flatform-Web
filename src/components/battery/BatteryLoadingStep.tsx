import { useEffect, useState } from 'react';

import { BatteryIcon, HowsYourBatterySticker } from '@/components/icons';

export function BatteryLoadingStep({ score, onDone }: { score: number; onDone: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setShown(Math.round(score * p));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, onDone]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <HowsYourBatterySticker className="max-w-[200px]" />
      <div className="mt-2 flex justify-center">
        <BatteryIcon percentage={shown} />
      </div>
      <span className="heading-64-bold text-brand-green-2">{`${shown}%`}</span>
      <span className="body-14-medium text-neutral-grey-2">Loading...</span>
      <h1 className="heading-24-bold text-neutral-grey-1">
        Sit tight while we calculate your score
      </h1>
    </main>
  );
}
