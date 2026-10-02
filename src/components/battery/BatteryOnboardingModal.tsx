import { useEffect, useState } from 'react';

import { BaseButton, BaseDialog } from '@/components/base';

const STEPS = [
  { title: 'It starts with self-reflection', body: 'Review your 8 wellness areas.' },
  { title: 'Receive your battery score', body: 'See if you are thriving or just surviving.' },
  { title: 'Grow happier and healthier', body: 'Get your own personalised activity plan.' },
];

export function BatteryOnboardingModal({
  open,
  onClose,
  onStart,
}: {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!open || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % STEPS.length), 4000);
    return () => clearTimeout(t);
  }, [open, paused, index]);

  if (!open) return null;
  return (
    <BaseDialog title="How it works" onClose={onClose} className="max-w-md">
      <div onTouchStart={() => setPaused(true)} onClick={() => setPaused(true)}>
        <h3 className="heading-24-bold text-neutral-grey-1">{STEPS[index].title}</h3>
        <p className="body-16-regular mt-2 text-neutral-grey-2">{STEPS[index].body}</p>
        <div
          className="mt-6 flex justify-center gap-2"
          role="tablist"
          aria-label="Walkthrough steps"
        >
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              role="tab"
              type="button"
              aria-selected={i === index}
              aria-label={`Step ${i + 1}`}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
              className={
                i === index
                  ? 'h-2 w-6 rounded-full bg-brand-green-2 transition-all'
                  : 'h-2 w-2 rounded-full bg-neutral-grey-5 transition-all'
              }
            />
          ))}
        </div>
        <BaseButton pill className="mt-6 w-full" onClick={onStart}>
          Start Battery Check
        </BaseButton>
      </div>
    </BaseDialog>
  );
}
