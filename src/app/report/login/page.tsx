'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense, type FormEvent } from 'react';

import { BaseButton, BaseInput, BaseLoading } from '@/components/base';
import {
  DecorativeWaveBottomRight,
  DecorativeWaveTopRight,
  EyeClosedIcon,
  EyeOpenIcon,
} from '@/components/icons';
import {
  REPORT_FALLBACK_PASSWORD,
  isReportPasswordValid,
  reportSessionKey,
} from '@/features/report-login/report-auth';
import { get } from '@/lib/axios';

interface ReportClient {
  id: string;
  name?: string;
  reportPassword?: string | null;
}

export default function ReportLoginPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading..." fullScreen />}>
      <ReportLoginContent />
    </Suspense>
  );
}

function ReportLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId') || searchParams.get('client') || 'mirvac';

  const { data: client } = useQuery({
    queryKey: ['report-client', clientId],
    queryFn: () => get<ReportClient>(`/clients/${clientId}`),
    retry: false,
  });

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the report password.');
      return;
    }
    setLoading(true);
    const expected = client?.reportPassword || REPORT_FALLBACK_PASSWORD;
    if (isReportPasswordValid(password, expected)) {
      sessionStorage.setItem(reportSessionKey(clientId), 'true');
      router.push(`/report/view?clientId=${encodeURIComponent(clientId)}`);
    } else {
      setLoading(false);
      setError('The password is incorrect. Please check and try again.');
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
          <p className="body-18-bold mb-2 text-secondary-yellow-1">Report Access</p>
          <h1 className="heading-64-bold mb-10 text-neutral-white-solid">Your wellbeing report</h1>
          <p className="body-16-medium text-neutral-grey-4">
            Enter the password from your email to view your monthly report.
          </p>
        </div>
        <p className="body-14-bold relative z-10 text-neutral-grey-4">© 2026 GreenX7</p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-10 md:px-14 lg:w-1/2 lg:px-[120px]">
        <div className="pointer-events-none absolute right-0 top-0">
          <DecorativeWaveTopRight width={328} height={340} />
        </div>
        <div className="relative z-10 my-auto w-full max-w-[480px]">
          <h1 className="heading-28-bold text-neutral-grey-1">Enter report password</h1>
          <p className="body-16-medium mb-10 mt-2 leading-relaxed text-neutral-grey-2">
            This report is protected.
            <br />
            Enter the password from your email to continue.
          </p>
          <form onSubmit={handleSubmit} action="#" method="post" noValidate>
            <div className="mb-12">
              <BaseInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                size="mediumPlus"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                error={Boolean(error)}
                helperText={error}
                required
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="flex cursor-pointer select-none items-center justify-center text-neutral-grey-2 transition-opacity hover:opacity-80"
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                }
              />
            </div>
            <BaseButton type="submit" size="mediumPlus" fullWidth loading={loading}>
              View report
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  );
}

