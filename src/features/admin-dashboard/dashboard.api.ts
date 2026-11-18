'use client';

import { get } from '@/lib/axios';
import type { AdminDashboardDto } from '@/types';

export const dashboardApi = {
  getDashboard: (queryString: string) => get<AdminDashboardDto>(`/dashboard?${queryString}`),
};
