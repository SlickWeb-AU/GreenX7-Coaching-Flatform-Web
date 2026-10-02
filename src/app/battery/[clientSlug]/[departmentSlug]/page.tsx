'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { BaseLoading } from '@/components/base';
import { BatteryAlreadySubmittedScreen } from '@/components/battery/BatteryAlreadySubmittedScreen';
import { BatteryCheckFlow } from '@/components/battery/BatteryCheckFlow';
import { BatteryClosedScreen } from '@/components/battery/BatteryClosedScreen';
import { useBatteryLive } from '@/features/battery-check';

function BatteryCheckPageContent() {
  const { clientSlug, departmentSlug } = useParams<{
    clientSlug: string;
    departmentSlug: string;
  }>();
  const { data, isLoading } = useBatteryLive(clientSlug, departmentSlug, {
    refetchInterval: false,
  });
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    setAlreadySubmitted(
      Boolean(
        typeof window !== 'undefined' &&
        (window.localStorage.getItem(`gx7-bc-${departmentSlug}`) ||
          document.cookie.includes(`gx7-bc-${departmentSlug}`)),
      ),
    );
  }, [departmentSlug]);

  if (isLoading && !data) return <BaseLoading message="Loading battery check..." fullScreen />;

  const isClosed = data?.isWindowOpen === false;
  if (isClosed) return <BatteryClosedScreen nextOpensLabel={data?.period?.label} />;
  if (alreadySubmitted) return <BatteryAlreadySubmittedScreen />;

  return <BatteryCheckFlow clientSlug={clientSlug} departmentSlug={departmentSlug} />;
}

export default function BatteryCheckPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading battery check..." fullScreen />}>
      <BatteryCheckPageContent />
    </Suspense>
  );
}
