'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { BaseLoading } from '@/components/base';
import { BatteryCheckFlow, BatteryStatusScreen } from '@/components/battery';
import { BATTERY_CHECK_STATES } from '@/constants/battery';
import { useBatteryState } from '@/features/battery-check';
import { getOrCreateDeviceId } from '@/lib/battery';

function BatteryCheckPageContent() {
  const { clientSlug, departmentSlug } = useParams<{
    clientSlug: string;
    departmentSlug: string;
  }>();

  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  const {
    data: freshState,
    isLoading,
    isError,
    refetch,
  } = useBatteryState(clientSlug, departmentSlug, deviceId, {
    enabled: Boolean(clientSlug && departmentSlug && deviceId),
  });

  // BC/E7: trạng thái (đóng / đã nộp / mở) xét LÚC MỞ LINK. Đã vào luồng làm bài thì
  // giữ nguyên trạng thái lúc đó: query tự gọi lại khi quay về tab, và ngay sau khi
  // nộp server đã trả "already submitted" — trước đây màn kết quả bị thay bằng màn
  // đã nộp chỉ vì người dùng sang tab khác rồi quay lại. Nộp khi kỳ vừa đóng thì
  // API submit vẫn từ chối và luồng tự hiện màn đóng.
  const lockedState = useRef<typeof freshState>(undefined);
  if (!lockedState.current && freshState?.state === BATTERY_CHECK_STATES.OPEN) {
    lockedState.current = freshState;
  }
  const stateData = lockedState.current ?? freshState;

  if (isLoading || !stateData) {
    if (isError) {
      return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-neutral-grey-8 px-6 text-center">
          <h1 className="body-24-bold text-neutral-grey-1">Battery Check unavailable</h1>
          <p className="body-14-medium text-neutral-grey-2">
            The link may be invalid or the service is down.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="body-14-bold underline underline-offset-2"
          >
            Try again
          </button>
        </main>
      );
    }
    return <BaseLoading message="Loading battery check..." fullScreen />;
  }

  if (
    stateData.state === BATTERY_CHECK_STATES.CLOSED ||
    stateData.state === BATTERY_CHECK_STATES.NOT_CONFIGURED
  ) {
    return (
      <BatteryStatusScreen
        variant="closed"
        clientName={stateData.branding.clientName}
        departmentName={stateData.branding.departmentName}
        clientLogoUrl={stateData.branding.darkLogoUrl}
        nextOpensAt={stateData.nextOpensAt}
        timeZone={stateData.timezone}
      />
    );
  }

  if (stateData.state === BATTERY_CHECK_STATES.ALREADY_SUBMITTED) {
    return (
      <BatteryStatusScreen
        variant="submitted"
        clientName={stateData.branding.clientName}
        departmentName={stateData.branding.departmentName}
        clientLogoUrl={stateData.branding.darkLogoUrl}
        periodMonth={stateData.periodMonth}
        periodYear={stateData.periodYear}
      />
    );
  }

  return (
    <BatteryCheckFlow
      clientSlug={clientSlug}
      departmentSlug={departmentSlug}
      stateData={stateData}
    />
  );
}

export default function BatteryCheckPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading battery check..." fullScreen />}>
      <BatteryCheckPageContent />
    </Suspense>
  );
}
