'use client';

import type { ReactNode } from 'react';
import { ViewportProvider } from '@/hooks/useViewport';

export default function BatteryLayout({ children }: { children: ReactNode }) {
  return <ViewportProvider>{children}</ViewportProvider>;
}
