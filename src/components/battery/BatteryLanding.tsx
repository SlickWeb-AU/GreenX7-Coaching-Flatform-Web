import { BaseButton } from '@/components/base';
import { HowsYourBatterySticker } from '@/components/icons';

interface BatteryLandingProps {
  clientName: string;
  departmentName: string;
  onStart: () => void;
  onHowItWorks: () => void;
}

export function BatteryLanding({
  clientName,
  departmentName,
  onStart,
  onHowItWorks,
}: BatteryLandingProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-brand-green-1 px-6 py-10 text-center">
      <header className="body-14-bold text-white/90">{`${clientName} · ${departmentName}`}</header>
      <section className="flex flex-col items-center">
        <HowsYourBatterySticker className="max-w-[240px] sm:max-w-[280px]" />
        <p className="body-16-regular mt-6 max-w-sm text-white">
          Take 60 seconds to bring awareness to your wellbeing.
        </p>
      </section>
      <footer className="flex w-full max-w-xs flex-col items-center gap-4">
        <BaseButton pill className="w-full" onClick={onStart}>
          Start Battery Check
        </BaseButton>
        <button
          type="button"
          onClick={onHowItWorks}
          className="body-14-medium text-white underline focus:outline-none"
        >
          How it works?
        </button>
      </footer>
    </main>
  );
}
