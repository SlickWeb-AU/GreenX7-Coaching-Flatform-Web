'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { BaseButton, BaseInput, BaseOtp } from '@/components/base';
import {
  ArrowBackIcon,
  DecorativeWaveBottomRight,
  DecorativeWaveTopRight,
  InformationIcon,
  LockedPadlockIcon,
} from '@/components/icons';
import {
  LOGIN_STEPS,
  type LoginStep,
  OTP_EXPIRY_SECONDS,
  RESEND_COOLDOWN_SECONDS,
} from '@/constants';
import { ROUTES } from '@/config/routes';
import { useAdminOtp } from '@/features/admin-auth';
import { formatOtpTimer, maskEmail } from '@/lib/otp';
import { useAuth } from '@/components/providers';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuth();
  const { requestCode, verifyCode } = useAdminOtp();

  const [step, setStep] = useState<LoginStep>(LOGIN_STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  const loading = requestCode.isPending || verifyCode.isPending;
  const error =
    localError ||
    (requestCode.error instanceof Error ? requestCode.error.message : '') ||
    (verifyCode.error instanceof Error ? verifyCode.error.message : '');

  const isResendDisabled = loading || resendCooldown > 0;

  const clearErrors = () => {
    setLocalError('');
    if (requestCode.error) requestCode.reset();
    if (verifyCode.error) verifyCode.reset();
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.admin.dashboard);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (step !== LOGIN_STEPS.OTP) return;
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid work email address.');
      return;
    }
    clearErrors();
    try {
      const res = await requestCode.mutateAsync(email.trim());
      const expiry = res?.expiresIn ?? OTP_EXPIRY_SECONDS;
      setTimeLeft(expiry);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setStep(LOGIN_STEPS.OTP);
    } catch {
      // error surfaces via mutation state
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const code = otp.join('');
    if (code.length < 6) {
      setLocalError('Please enter the complete 6-digit code.');
      return;
    }
    clearErrors();
    try {
      const user = await verifyCode.mutateAsync({ email: email.trim(), code });
      setUser(user);
      router.push(ROUTES.admin.dashboard);
    } catch {
      // error surfaces via mutation state
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-grey-8 lg:flex-row">
      <div className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-brand-green-2 p-6 text-white md:p-8 lg:w-1/2 lg:p-[40px] lg:pb-[96px]">
        <div className="pointer-events-none absolute bottom-0 right-0">
          <DecorativeWaveBottomRight width={293} height={295} />
        </div>
        <div className="relative z-10">
          <Image
            src="/icons/greenx7-logo-light.svg"
            alt="GreenX7 Logo"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div className="relative z-10 my-12 max-w-xl lg:my-0">
          <p className="body-18-bold mb-2 text-secondary-yellow-1">Admin Area</p>
          <h1 className="heading-64-bold mb-10 text-neutral-white-solid">
            GreenX7
            <br />
            Coaching Platform
          </h1>
          <p className="body-16-medium text-neutral-grey-4">
            Manage clients, monthly check-ins, reporting and live presentations.
          </p>
        </div>
        <p className="body-14-bold relative z-10 text-neutral-grey-4">© 2026 GreenX7</p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-10 md:px-14 lg:w-1/2 lg:px-[120px]">
        <div className="pointer-events-none absolute right-0 top-0">
          <DecorativeWaveTopRight width={328} height={340} />
        </div>
        <div className="relative z-10 my-auto w-full max-w-[480px]">
          {step === LOGIN_STEPS.EMAIL && (
            <>
              <div className="mb-6 flex items-center gap-2">
                <LockedPadlockIcon color="#005943" />
                <span className="body-14-bold text-brand-green-2">Secure administrator access</span>
              </div>
              <h1 className="heading-28-bold text-neutral-grey-1">Sign in to GreenX7</h1>
              <p className="body-16-medium mb-10 mt-2 leading-relaxed text-neutral-grey-2">
                Enter your work email. We&apos;ll send you a six-digit verification code.
              </p>
              <form onSubmit={handleEmailSubmit} action="#" method="post" noValidate>
                <div className="mb-12">
                  <BaseInput
                    label="Work Email"
                    type="email"
                    placeholder="name@company.com"
                    size="mediumPlus"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) clearErrors();
                    }}
                    error={Boolean(error)}
                    helperText={error}
                    required
                  />
                </div>
                <BaseButton type="submit" size="mediumPlus" fullWidth loading={loading}>
                  Continue
                </BaseButton>
                <div className="mt-3 flex items-center gap-2">
                  <InformationIcon size={15} className="shrink-0" />
                  <span className="body-12-medium text-neutral-grey-3">
                    Access is limited to approved GreenX7 administrators.
                  </span>
                </div>
              </form>
            </>
          )}

          {step === LOGIN_STEPS.OTP && (
            <>
              <button
                type="button"
                onClick={() => {
                  clearErrors();
                  setOtp(['', '', '', '', '', '']);
                  setStep(LOGIN_STEPS.EMAIL);
                }}
                className="body-14-bold mb-4 inline-flex cursor-pointer items-center gap-2 text-brand-green-2 transition-opacity hover:opacity-80"
              >
                <ArrowBackIcon size={20} className="h-5 w-5" />
                <span>Use a different email</span>
              </button>
              <h1 className="heading-28-bold mb-4 text-neutral-grey-1">Check your email</h1>
              <div className="mb-10 flex flex-col gap-1">
                <p className="body-16-medium text-neutral-grey-2">
                  We sent a verification code to <span>{maskEmail(email)}</span>.
                </p>
                <p className="body-14-medium text-neutral-grey-3">
                  The code expires in {formatOtpTimer(timeLeft)}.
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} action="#" method="post" noValidate>
                <BaseOtp
                  label="Six-Digit Verification Code"
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (error) clearErrors();
                  }}
                  error={Boolean(error)}
                  helperText={error}
                  className="mb-12"
                />
                <BaseButton type="submit" size="mediumPlus" fullWidth loading={loading}>
                  Verify &amp; Continue
                </BaseButton>
                <BaseButton
                  type="button"
                  variant="ghost"
                  size="mediumPlus"
                  fullWidth
                  disabled={isResendDisabled}
                  className="mt-3"
                  onClick={async () => {
                    if (isResendDisabled) return;
                    clearErrors();
                    setOtp(['', '', '', '', '', '']);
                    try {
                      const res = await requestCode.mutateAsync(email.trim());
                      const expiry =
                        (res as { expiresIn?: number })?.expiresIn ?? OTP_EXPIRY_SECONDS;
                      setTimeLeft(expiry);
                      setResendCooldown(RESEND_COOLDOWN_SECONDS);
                    } catch {
                      // error surfaces via mutation state
                    }
                  }}
                >
                  Resend Code
                  {resendCooldown > 0 ? ` (${resendCooldown}s)` : ''}
                </BaseButton>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
