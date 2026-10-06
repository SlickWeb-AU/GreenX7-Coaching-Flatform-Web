'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Loader2, Send } from 'lucide-react';
import { batteryEmailSchema } from '@/validations/battery';

export interface BatteryEmailCardProps {
  onSubmitEmail: (email: string) => Promise<void>;
  isPending: boolean;
}

export function BatteryEmailCard({ onSubmitEmail, isPending }: BatteryEmailCardProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    <section className="w-full bg-brand-green-1 px-[40px] py-[40px] text-white shadow-none">
      <Send size={32} className="mb-4 -rotate-12 text-secondary-yellow-1" />

      <h3 className="text-[24px] font-bold leading-tight text-white">
        Want a copy of your results?
      </h3>
      <p className="mt-1 text-[24px] font-bold leading-tight text-white">
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
              <div className="relative flex h-14 flex-1 flex-col justify-center rounded-xl border border-brand-green-3/40 bg-[#00271E] px-4 py-2 transition-colors focus-within:border-brand-green-3">
                <label
                  htmlFor="battery-result-email"
                  className="mb-0.5 block text-[11px] font-medium leading-none text-white/70"
                >
                  Email
                </label>
                <input
                  id="battery-result-email"
                  type="email"
                  placeholder="name@email.com.au"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  disabled={isPending}
                  className="body-16-medium w-full bg-transparent leading-none text-white placeholder-white/30 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !email.trim()}
                aria-label="Send results email"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-green-2 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <ArrowRight className="h-6 w-6" />
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
