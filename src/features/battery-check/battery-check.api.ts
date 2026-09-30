import { get } from '@/lib/axios';
import type { BatteryCheckLiveResult } from '@/types';

export const batteryCheckApi = {
  live: (clientSlug: string, deptSlug: string) =>
    get<BatteryCheckLiveResult>(`/battery-check/${clientSlug}/${deptSlug}/live`),
};
