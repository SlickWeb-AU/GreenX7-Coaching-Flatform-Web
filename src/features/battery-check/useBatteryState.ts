'use client';

import { useQuery } from '@tanstack/react-query';

import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { queryKeys } from '@/lib/query-client';

export interface UseBatteryStateOptions {
  enabled?: boolean;
}

export function useBatteryState(
  clientSlug?: string,
  departmentSlug?: string,
  deviceId?: string,
  options?: UseBatteryStateOptions,
) {
  const { enabled = Boolean(clientSlug && departmentSlug) } = options ?? {};

  return useQuery({
    queryKey: queryKeys.batteryCheck.state(clientSlug || '', departmentSlug || '', deviceId),
    queryFn: () => batteryCheckApi.getState(clientSlug || '', departmentSlug || '', deviceId),
    retry: false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled,
  });
}
