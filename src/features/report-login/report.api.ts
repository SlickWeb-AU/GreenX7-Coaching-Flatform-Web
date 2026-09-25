'use client';

import { get } from '@/lib/axios';

export interface ReportClient {
  id: string;
  name?: string;
  reportPassword?: string | null;
}

export const reportApi = {
  getClient: (clientId: string) => get<ReportClient>(`/clients/${clientId}`),
};
