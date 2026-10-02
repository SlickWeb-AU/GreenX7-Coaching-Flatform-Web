import { useState, type FormEvent } from 'react';

import { BaseButton, BaseInput, BaseTag } from '@/components/base';
import { AREA_BADGE } from '@/constants/dashboard';
import { cn } from '@/lib/utils';
import type { BatteryAreaScore } from '@/types/battery';
import { batteryEmailSchema } from '@/validations/battery';

export function BatteryRechargeAccordion({
  areas,
  onSubmitEmail,
}: {
  areas: BatteryAreaScore[];
  onSubmitEmail: (email: string) => Promise<void>;
}) {
  const lowest = [...areas].sort((a, b) => (a.score ?? 99) - (b.score ?? 99)).slice(0, 3);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = batteryEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address');
      return;
    }
    setError(null);
    setSending(true);
    try {
      await onSubmitEmail(parsed.data.email);
      setSent(true);
    } catch {
      setError('Could not send your results. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="px-4 py-6">
      <h2 className="body-16-bold text-neutral-grey-1">Ways to recharge your battery</h2>
      {lowest.map((a) => (
        <details
          key={a.area}
          className="mt-3 rounded-2xl border border-neutral-grey-7 bg-white p-4"
        >
          <summary className="body-14-bold cursor-pointer list-none text-neutral-grey-1">
            <BaseTag
              variant="green-neutral"
              className={cn(AREA_BADGE[a.area], 'text-neutral-grey-1')}
            >
              {a.area}
            </BaseTag>
          </summary>
          <p className="body-14-regular mt-2 text-neutral-grey-2">
            Small daily actions in {a.area.toLowerCase()} help recharge your battery.
          </p>
        </details>
      ))}
      <div className="mt-6 rounded-2xl bg-brand-green-1 p-6 text-center">
        <p className="body-16-bold text-white">Want a copy of your results?</p>
        <p className="body-14-regular mt-1 text-white/80">
          We don&apos;t store your email - used only to send your report.
        </p>
        {sent ? (
          <p className="body-14-bold mt-4 text-white">
            Check your inbox — your results are on the way.
          </p>
        ) : (
          <form noValidate onSubmit={submit} className="mt-4 flex gap-2">
            <BaseInput
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              error={Boolean(error)}
              helperText={error ?? undefined}
              aria-label="Email address"
              className="flex-1"
            />
            <BaseButton
              type="submit"
              pill
              loading={sending}
              disabled={sending}
              aria-label="Send results"
            >
              →
            </BaseButton>
          </form>
        )}
      </div>
    </section>
  );
}
