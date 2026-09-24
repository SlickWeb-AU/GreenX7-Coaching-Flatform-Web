'use client';

import { del, get, patch, post } from '@/lib/axios';

export interface Industry {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  clientCount: number;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
  status?: string;
}

export const settingsApi = {
  getIndustries: () => get<Industry[]>('/industries'),
  createIndustry: (name: string) => post<Industry>('/industries', { name }),
  updateIndustry: (id: string, name: string) => patch<Industry>(`/industries/${id}`, { name }),
  deleteIndustry: (id: string) => del<unknown>(`/industries/${id}`),
  getAdmins: () => get<AdminUser[]>('/admin-users'),
  inviteAdmin: (payload: { name: string; email: string }) =>
    post<AdminUser>('/admin-users/invite', payload),
};
