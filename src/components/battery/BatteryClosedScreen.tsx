import { BaseButton } from '@/components/base';

export function BatteryClosedScreen({ nextOpensLabel }: { nextOpensLabel?: string | null }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-green-1 px-6 text-center">
      <h1 className="heading-32-bold text-white">Submissions are closed</h1>
      <p className="body-16-regular mt-3 text-white/80">
        {nextOpensLabel
          ? `The next check-in opens ${nextOpensLabel}.`
          : 'The current check-in window has ended.'}
      </p>
      <a href="https://greenx7.com" className="mt-8">
        <BaseButton pill>Return to GreenX7</BaseButton>
      </a>
    </main>
  );
}
