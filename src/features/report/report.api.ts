'use client';

import { get, post } from '@/lib/axios';
import type { ReportContentDto, ReportGateDto } from '@/types/reports';

export const reportApi = {
  /** Màn nhập mật khẩu: tên + logo công ty, không có số liệu. Link sai/hết hạn = 401 */
  gate: (token: string) => get<ReportGateDto>(`/reports/${token}`),
  /** `period` = "YYYY-MM" để xem kỳ khác trong `availablePeriods`; bỏ trống = kỳ của báo cáo */
  viewReport: (token: string, password: string, period?: string) =>
    post<ReportContentDto>(`/reports/${token}/view`, period ? { password, period } : { password }),
};
