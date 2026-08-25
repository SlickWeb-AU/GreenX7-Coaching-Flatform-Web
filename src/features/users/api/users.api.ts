'use client';

import { del, get, getPaginated, patch, post } from '@/lib/axios';
import { cleanParams } from '@/lib/utils';
import type { UserStatus } from '@/types/auth';
import type { User, UserStatistics } from '@/types/entities';

import type { CreateUserInput, UpdateUserInput, UserListParams } from '../schemas';

export const usersApi = {
  list: (params: UserListParams) => getPaginated<User>('/users', { params: cleanParams(params) }),

  detail: (id: string) => get<User>(`/users/${id}`),

  create: (input: CreateUserInput) =>
    post<User>('/users', { ...input, ...(input.phone ? {} : { phone: undefined }) }),

  update: (id: string, input: UpdateUserInput) => patch<User>(`/users/${id}`, input),

  updateStatus: (id: string, status: UserStatus) => patch<User>(`/users/${id}/status`, { status }),

  remove: (id: string) => del<{ message: string }>(`/users/${id}`),

  statistics: () => get<UserStatistics>('/users/statistics'),
};
