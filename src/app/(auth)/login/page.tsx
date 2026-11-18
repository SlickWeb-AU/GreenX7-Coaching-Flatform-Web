'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Info, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { BaseButton, BaseInput, BaseOtp } from '@/components/base';
import {
  DecorativeWaveBottomRight,
  DecorativeWaveTopRight,
  GreenX7LogoLight,
} from '@/components/icons';
import { PresentationMobileWarning } from '@/components/presentation/PresentationMobileWarning';
import { useAuth } from '@/components/providers';
import { ROUTES } from '@/config/routes';
import {
  LOGIN_STEPS,
  type LoginStep,
  OTP_EXPIRY_SECONDS,
  RESEND_COOLDOWN_SECONDS,
} from '@/constants';
import { useAdminOtp } from '@/features/admin-auth';
import { formatOtpTimer, maskEmail } from '@/lib/otp';
import {
  loginEmailSchema,
  loginOtpSchema,
  type LoginEmailValues,
  type LoginOtpValues,
} from '@/validations';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuth();
  const { requestCode, verifyCode } = useAdminOtp();

  const [step, setStep] = useState<LoginStep>(LOGIN_STEPS.EMAIL);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  const emailForm = useForm<LoginEmailValues>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<LoginOtpValues>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: { code: '' },
  });

  const loading = requestCode.isPending || verifyCode.isPending;
  const error =
    emailForm.formState.errors.email?.message ||
    otpForm.formState.errors.code?.message ||
    (requestCode.error instanceof Error ? requestCode.error.message : '') ||
    (verifyCode.error instanceof Error ? verifyCode.error.message : '');

  const isResendDisabled = loading || resendCooldown > 0;

  const clearErrors = () => {
    emailForm.clearErrors();
    otpForm.clearErrors();
    if (requestCode.error) requestCode.reset();
    if (verifyCode.error) verifyCode.reset();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get('error');

    if (errorParam) {
      let msg = '';
      if (errorParam === 'account_deleted') {
        msg = 'This account no longer exists. Please contact your administrator.';
      } else if (errorParam === 'account_inactive') {
        msg = 'This account has been deactivated. Please contact your administrator.';
      } else if (errorParam === 'session_expired') {
        msg = 'Your session has expired. Please sign in again.';
      }

      if (msg) {
        setTimeout(() => {
          toast.error(msg, { duration: 5000 });
        }, 150);
      }

      url.searchParams.delete('error');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }, []);

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

  const handleEmailSubmit = async (values: LoginEmailValues) => {
    if (loading) return;
    clearErrors();
    try {
      const res = await requestCode.mutateAsync(values.email.trim());
      const expiry = res?.expiresIn ?? OTP_EXPIRY_SECONDS;
      setTimeLeft(expiry);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      otpForm.reset({ code: '' });
      setStep(LOGIN_STEPS.OTP);
    } catch {
      // error surfaces via mutation state
    }
  };

  const handleVerifyOtp = async (values: LoginOtpValues) => {
    if (loading) return;
    clearErrors();
    try {
      const user = await verifyCode.mutateAsync({
        email: emailForm.getValues('email').trim(),
        code: values.code.trim(),
      });
      setUser(user);
      router.push(ROUTES.admin.dashboard);
    } catch {
      // error surfaces via mutation state
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled) return;
    clearErrors();
    otpForm.reset({ code: '' });
    try {
      const res = await requestCode.mutateAsync(emailForm.getValues('email').trim());
      const expiry = (res as { expiresIn?: number })?.expiresIn ?? OTP_EXPIRY_SECONDS;
      setTimeLeft(expiry);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      // error surfaces via mutation state
    }
  };

  return (
    <>
      <PresentationMobileWarning
        title="Desktop Screen Required"
        description="The GreenX7 Admin Portal is designed specifically for desktop viewports to give you the best experience for data analytics, client management, and reporting."
        helperNotice="Please access this page from a laptop, desktop computer, or expand your browser window."
        showCopyButton={false}
      />
      <div className="hidden min-h-screen flex-col bg-neutral-grey-8 lg:flex lg:flex-row">
        <div className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-brand-green-2 p-6 text-white lg:w-1/2 lg:p-[40px] lg:pb-[96px]">
          <div className="pointer-events-none absolute bottom-0 right-0">
            <DecorativeWaveBottomRight width={293} height={295} />
          </div>
          <div className="relative z-10">
            <GreenX7LogoLight className="h-10 w-auto" />
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

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-10 lg:w-1/2 lg:px-10 xl:px-[120px]">
          <div className="pointer-events-none absolute right-0 top-0">
            <DecorativeWaveTopRight width={328} height={340} />
          </div>
          <div className="relative z-10 my-auto w-full max-w-[480px]">
            {step === LOGIN_STEPS.EMAIL && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <Lock size={18} className="text-brand-green-2" aria-hidden />
                  <span className="body-14-bold text-brand-green-2">
                    Secure administrator access
                  </span>
                </div>
                <h1 className="heading-28-bold text-neutral-grey-1">Sign in to GreenX7</h1>
                <p className="body-16-medium mb-10 mt-2 text-neutral-grey-2">
                  Enter your work email. We&apos;ll send you a six-digit verification code.
                </p>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} noValidate>
                  <div className="mb-12">
                    <BaseInput
                      label="Work Email"
                      type="email"
                      placeholder="name@company.com"
                      size="mediumPlus"
                      error={Boolean(error)}
                      helperText={error}
                      required
                      inputClassName="border-neutral-grey-4"
                      {...emailForm.register('email', {
                        onChange: () => {
                          if (error) clearErrors();
                        },
                      })}
                    />
                  </div>
                  <BaseButton type="submit" size="mediumPlus" fullWidth pill loading={loading}>
                    Continue
                  </BaseButton>
                  <div className="mt-3 flex items-center gap-2">
                    <Info size={15} className="shrink-0 text-neutral-grey-3" aria-hidden />
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
                    otpForm.reset({ code: '' });
                    setStep(LOGIN_STEPS.EMAIL);
                  }}
                  className="body-14-bold mb-4 inline-flex cursor-pointer items-center gap-2 text-brand-green-2 transition-opacity hover:opacity-80"
                >
                  <ArrowLeft size={20} className="h-5 w-5" aria-hidden />
                  <span>Use a different email</span>
                </button>
                <h1 className="heading-28-bold mb-4 text-neutral-grey-1">Check your email</h1>
                <div className="mb-10 flex flex-col gap-1">
                  <p className="body-16-medium text-neutral-grey-2">
                    We sent a verification code to{' '}
                    <span>{maskEmail(emailForm.getValues('email'))}</span>.
                  </p>
                  <p className="body-14-medium text-neutral-grey-3">
                    The code expires in {formatOtpTimer(timeLeft)}.
                  </p>
                </div>
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} noValidate>
                  <Controller
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => {
                      const chars = (field.value || '').split('');
                      const otpArray = Array.from({ length: 6 }, (_, i) => chars[i] || '');
                      return (
                        <BaseOtp
                          label="Six-Digit Verification Code"
                          value={otpArray}
                          onChange={(val) => {
                            field.onChange(val.join(''));
                            if (error) clearErrors();
                          }}
                          error={Boolean(error)}
                          helperText={error}
                          className="mb-12"
                          inputClassName="border-neutral-grey-4"
                        />
                      );
                    }}
                  />
                  <BaseButton type="submit" size="mediumPlus" fullWidth pill loading={loading}>
                    Verify &amp; Continue
                  </BaseButton>
                  <BaseButton
                    type="button"
                    variant="ghost"
                    size="mediumPlus"
                    fullWidth
                    pill
                    disabled={isResendDisabled}
                    className="mt-3"
                    onClick={handleResendCode}
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
    </>
  );
}
