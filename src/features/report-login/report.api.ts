'use client';

import { post } from '@/lib/axios';
import type { ReportViewDto } from '@/types/reports';

export const reportApi = {
  viewReport: (token: string, password: string) =>
    post<ReportViewDto>(`/reports/${token}/view`, { password }),
};
