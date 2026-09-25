'use client';

import { del, get, patch, post } from '@/lib/axios';

import type { AdminUser, Industry } from '@/types';

export type { AdminUser, Industry };

export const settingsApi = {
  getIndustries: () => get<Industry[]>('/industries'),
  createIndustry: (name: string) => post<Industry>('/industries', { name }),
  updateIndustry: (id: string, name: string) => patch<Industry>(`/industries/${id}`, { name }),
  deleteIndustry: (id: string) => del<unknown>(`/industries/${id}`),
  getAdmins: () => get<AdminUser[]>('/admin-users'),
  inviteAdmin: (payload: { name: string; email: string }) =>
    post<AdminUser>('/admin-users/invite', payload),
};
