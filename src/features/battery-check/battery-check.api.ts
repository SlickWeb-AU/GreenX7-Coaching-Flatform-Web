import { get, post } from '@/lib/axios';
import type { BatteryCheckLiveResult } from '@/types';
import type { BatterySubmitPayload, BatterySubmitResult } from '@/types/battery';

export const batteryCheckApi = {
  live: (clientSlug: string, deptSlug: string) =>
    get<BatteryCheckLiveResult>(`/battery-check/${clientSlug}/${deptSlug}/live`),
  submit: (clientSlug: string, deptSlug: string, payload: BatterySubmitPayload) =>
    post<BatterySubmitResult>(`/battery-check/${clientSlug}/${deptSlug}`, payload),
  sendResultsEmail: (clientSlug: string, deptSlug: string, email: string, resultToken?: string) =>
    post<void>(`/battery-check/results/email`, {
      email,
      ...(resultToken ? { resultToken } : {}),
    }),
};
