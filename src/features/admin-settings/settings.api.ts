'use client';

import { del, get, patch, post } from '@/lib/axios';

import type { AdminUser, Industry, InviteAdminPayload, UpdateAdminUserPayload } from '@/types';

export const settingsApi = {
  getIndustries: () => get<Industry[]>('/industries', { params: { includeInactive: true } }),
  createIndustry: (name: string) => post<Industry>('/industries', { name }),
  updateIndustry: (id: string, name: string) => patch<Industry>(`/industries/${id}`, { name }),
  deleteIndustry: (id: string) => del<unknown>(`/industries/${id}`),
  getAdmins: () => get<AdminUser[]>('/admin-users'),
  inviteAdmin: (payload: InviteAdminPayload) => post<AdminUser>('/admin-users/invite', payload),
  updateAdminUser: (id: string, payload: UpdateAdminUserPayload) =>
    patch<AdminUser>(`/admin-users/${id}`, payload),
  deleteAdminUser: (id: string) => del<unknown>(`/admin-users/${id}`),
};
