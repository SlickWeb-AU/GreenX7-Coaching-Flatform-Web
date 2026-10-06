'use client';

import { post } from '@/lib/axios';
import type { ReportContentDto } from '@/types/reports';

export const reportApi = {
  /** `period` = "YYYY-MM" để xem kỳ khác trong `availablePeriods`; bỏ trống = kỳ của báo cáo */
  viewReport: (token: string, password: string, period?: string) =>
    post<ReportContentDto>(`/reports/${token}/view`, period ? { password, period } : { password }),
};
