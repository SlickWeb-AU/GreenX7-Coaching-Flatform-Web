'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useBatteryLive } from '@/features/battery-check';
import { resolveLiveLogoUrl, resolveLiveNames, resolvePeriodLabel } from '@/lib/live';
import type { PresentationContextValue } from '@/types';

const PresentationContext = createContext<PresentationContextValue | null>(null);

export interface PresentationProviderProps {
  clientSlug: string;
  departmentSlug: string;
  children: ReactNode;
}

export function PresentationProvider({
  clientSlug,
  departmentSlug,
  children,
}: PresentationProviderProps) {
  const { data, score, items, isLoading } = useBatteryLive(clientSlug, departmentSlug);

  const qrCodeUrl = data?.qrCodeDataUri ?? null;
  const batteryCheckUrl = data?.shareUrl || data?.batteryCheckUrl || null;

  const { clientName, departmentName } = resolveLiveNames(data, clientSlug, departmentSlug);
  const fullDisplayName = `${clientName} ${departmentName}`.trim();

  const clientLogoUrl = resolveLiveLogoUrl(data);
  const previousMonthLabel = resolvePeriodLabel(data);

  const value: PresentationContextValue = {
    clientSlug,
    departmentSlug,
    data: data ?? null,
    score,
    items,
    isLoading,
    qrCodeUrl,
    batteryCheckUrl,
    clientName,
    departmentName,
    fullDisplayName,
    clientLogoUrl,
    previousMonthLabel,
  };

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}

export function useOptionalPresentation() {
  return useContext(PresentationContext);
}
