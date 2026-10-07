'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, type FormEvent } from 'react';

import { BaseButton, BaseInput, BaseLoading } from '@/components/base';
import {
  DecorativeWaveBottomRight,
  DecorativeWaveTopRight,
  GreenX7LogoLight,
} from '@/components/icons';
import { reportApi } from '@/features/report';
import { toApiError } from '@/lib/api-error';
import { reportPasswordKey, reportSessionKey } from '@/lib/report-auth';
import { resolveImageUrl } from '@/lib/utils';
import type { ReportGateDto } from '@/types/reports';

/** Design 16 (Failed): câu ngắn cho sai mật khẩu */
const WRONG_PASSWORD = 'The password is incorrect. Please check and try again.';
/** Link sai / hết hạn (RE/E3) — biết được nhờ GET /reports/:token lúc mở trang */
const INVALID_LINK =
  'This link is invalid or has expired. Please contact your GreenX7 account manager to receive a new report.';

export default function ReportPasswordPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading..." fullScreen />}>
      <ReportPasswordContent />
    </Suspense>
  );
}

function ReportPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('clientId') || '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gate, setGate] = useState<ReportGateDto | null>(null);
  const [linkInvalid, setLinkInvalid] = useState(false);

  // Logo công ty ở góc khối xanh (design 16 - Logo); link hỏng thì báo ngay,
  // khỏi để người nhận gõ mật khẩu rồi mới biết
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    reportApi
      .gate(token)
      .then((g) => !cancelled && setGate(g))
      .catch((e: unknown) => {
        if (!cancelled && toApiError(e).statusCode === 401) {
          setLinkInvalid(true);
          setError(INVALID_LINK);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the report password.');
      return;
    }
    if (!token) {
      setError('Invalid or missing report link token.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reportData = await reportApi.viewReport(token, password.trim());
      sessionStorage.setItem(reportSessionKey(token), JSON.stringify(reportData));
      sessionStorage.setItem(reportPasswordKey(token), password.trim());
      router.push(`/report/view?token=${encodeURIComponent(token)}`);
    } catch (err: unknown) {
      setLoading(false);
      const apiError = toApiError(err);
      // API trả một câu dài chung cho cả link hỏng lẫn sai mật khẩu (RE/E3). Link
      // đã kiểm tra lúc mở trang, nên 401 ở đây là sai mật khẩu -> câu ngắn của design.
      setError(
        apiError.statusCode === 401
          ? linkInvalid
            ? INVALID_LINK
            : WRONG_PASSWORD
          : apiError.message || WRONG_PASSWORD,
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-grey-8 lg:flex-row">
      <div className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-brand-green-2 p-6 text-white md:p-8 lg:w-1/2 lg:p-[40px] lg:pb-[96px]">
        <div className="pointer-events-none absolute bottom-0 right-0">
          <DecorativeWaveBottomRight width={293} height={295} />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-6">
          <GreenX7LogoLight className="h-10 w-auto shrink-0" />
          {/* Logo trắng của công ty (design 16 - Logo) kèm tên; chưa upload logo thì chỉ hiện tên */}
          {gate && (
            <div className="flex min-w-0 items-center gap-3">
              {resolveImageUrl(gate.whiteLogoUrl) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveImageUrl(gate.whiteLogoUrl) as string}
                  alt={gate.businessName}
                  className="h-10 w-auto max-w-[160px] shrink-0 object-contain"
                />
              )}
              <span className="body-18-bold truncate uppercase text-neutral-white-solid">
                {gate.businessName}
              </span>
            </div>
          )}
        </div>
        <div className="relative z-10 my-12 lg:my-0">
          <p className="body-18-bold mb-2 text-secondary-yellow-1">Report access</p>
          {/* Một dòng như design (từ 1280px; màn hẹp hơn thì xuống dòng thay vì tràn) */}
          <h1 className="heading-48-bold mb-4 text-neutral-white-solid xl:whitespace-nowrap xl:text-[56px] xl:leading-[68px]">
            Your wellbeing report
          </h1>
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
          <p className="body-16-medium mb-10 mt-2 text-neutral-grey-2">
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
                // Mã mới là 6 chữ số: mở bàn phím số trên điện thoại. Không chặn chữ —
                // mã chung kiểu cũ (chữ + số) của báo cáo gửi trước đó vẫn hợp lệ.
                inputMode="numeric"
                autoComplete="one-time-code"
                size="mediumPlus"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                error={Boolean(error)}
                helperText={error}
                required
                // Sai mật khẩu: chữ trong ô cũng đỏ như viền (design 16 Failed)
                inputClassName={error ? 'text-secondary-red-4' : 'border-neutral-grey-4'}
                disabled={linkInvalid}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="flex cursor-pointer select-none items-center justify-center text-neutral-grey-2 transition-opacity hover:opacity-80"
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden />
                    ) : (
                      <Eye size={20} aria-hidden />
                    )}
                  </button>
                }
              />
            </div>
            <BaseButton
              type="submit"
              size="mediumPlus"
              fullWidth
              pill
              loading={loading}
              disabled={linkInvalid}
            >
              View report
            </BaseButton>
          </form>
        </div>
      </div>
    </div>
  );
}
