'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Loader2, Send } from 'lucide-react';
import { batteryEmailSchema } from '@/validations/battery';

export interface BatteryEmailCardProps {
  onSubmitEmail: (email: string) => Promise<void>;
  isPending: boolean;
  disabled?: boolean;
}

export function BatteryEmailCard({ onSubmitEmail, isPending, disabled }: BatteryEmailCardProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const parsed = batteryEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? 'Enter a valid email address');
      return;
    }
    setEmailError(null);
    try {
      await onSubmitEmail(parsed.data.email);
      setIsSent(true);
    } catch {
      setEmailError('Could not send your results. Please try again.');
    }
  };

  return (
    <section className="w-full bg-brand-green-1 px-[40px] py-[40px] text-white shadow-none md:px-10 md:py-12">
      <Send size={32} className="mb-4 -rotate-12 text-secondary-yellow-1" />

      <h3 className="text-[24px] font-bold leading-tight text-white">
        Want a copy of your results?
      </h3>
      <p className="body-14-regular mt-1 text-white">
        We don&apos;t store your email - used only to send your report.
      </p>

      <div className="mt-6">
        {isSent ? (
          <div className="rounded-xl border border-brand-green-3/40 bg-brand-green-2/40 p-4 text-center">
            <p className="body-14-bold text-brand-green-3">Sent 👍 Check your inbox!</p>
            <p className="caption-12-regular mt-1 text-white/80">
              We sent your personalized results to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center gap-2.5">
              <input
                id="battery-result-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                disabled={isPending || disabled}
                className="body-16-medium h-14 flex-1 rounded-xl border border-brand-green-3/40 bg-brand-green-2 px-4 text-white placeholder-white/40 outline-none transition-colors focus:border-brand-green-3"
              />

              <button
                type="submit"
                disabled={isPending || disabled || !email.trim()}
                aria-label="Send results email"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-green-3/40 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <ArrowRight className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            {emailError && (
              <p className="caption-12-regular mt-2 text-secondary-red-4">{emailError}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
