'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { FIXED_WELLBEING_AREAS } from '@/constants/dashboard';
import { batteryCheckApi } from '@/features/battery-check/battery-check.api';
import { queryKeys } from '@/lib/query-client';
import type { WellbeingItemData } from '@/types';

export interface UseBatteryLiveOptions {
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
  enabled?: boolean;
}

export function useBatteryLive(
  clientSlug?: string,
  departmentSlug?: string,
  options?: UseBatteryLiveOptions,
) {
  const {
    refetchInterval = 10_000,
    refetchIntervalInBackground = true,
    enabled = Boolean(clientSlug && departmentSlug),
  } = options ?? {};

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.batteryCheck.live(clientSlug || '', departmentSlug || ''),
    queryFn: () => batteryCheckApi.live(clientSlug || '', departmentSlug || ''),
    retry: false,
    enabled,
    refetchInterval,
    refetchIntervalInBackground,
  });

  const score = data?.batteryScore ?? null;

  const items: WellbeingItemData[] = useMemo(() => {
    const source: {
      area: string;
      label?: string;
      score: number | null;
      vsPrevious?: { change?: number | null; changePercent?: number | null };
      vsFirstCheck?: { change?: number | null; changePercent?: number | null };
    }[] = data?.wellbeingAreas ?? [];
    const apiAreaMap = new Map(
      source.map(
        (a) =>
          [
            a.area.toUpperCase(),
            {
              label: a.label ?? a.area,
              score: a.score ?? null,
              vsPreviousMonth: a.vsPrevious?.change ?? null,
              vsFirstCheck: a.vsFirstCheck?.change ?? null,
            },
          ] as const,
      ),
    );
    return FIXED_WELLBEING_AREAS.map((def) => {
      const match = apiAreaMap.get(def.area.toUpperCase());
      return {
        area: def.area,
        label: match?.label ?? def.label,
        score: match?.score ?? null,
        vsPreviousMonth: match?.vsPreviousMonth ?? null,
        vsFirstCheck: match?.vsFirstCheck ?? null,
      };
    });
  }, [data]);

  return {
    data,
    score,
    items,
    isLoading,
  };
}
