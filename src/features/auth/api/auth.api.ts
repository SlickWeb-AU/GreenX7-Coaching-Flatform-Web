'use client';

import { ApiError } from '@/lib/api-error';
import { get, patch, post } from '@/lib/axios';
import type { ApiErrorResponse } from '@/types/api';
import type { AuthUser } from '@/types/auth';
import type { ChangePasswordInput, LoginInput, RegisterInput, UpdateProfileInput } from '../schemas';

/**
 * Login/register/logout/refresh đi thẳng vào ROUTE HANDLER của Next (/api/auth/*),
 * KHÔNG qua /api/bff — vì chúng cần ghi httpOnly cookie, việc mà chỉ route handler làm được.
 * Các API còn lại dùng axios qua /api/bff như bình thường.
 */
async function authFetch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json()) as
    | { success: true; data: T; message?: string }
    | ApiErrorResponse;

  if (!response.ok || payload.success !== true) {
    const error = payload as ApiErrorResponse;
    throw new ApiError(
      error.message ?? 'Yêu cầu thất bại',
      error.statusCode ?? response.status,
      error.errorCode ?? 'INTERNAL_ERROR',
      error.errors,
    );
  }

  return payload.data;
}

export const authApi = {
  login: (input: LoginInput) => authFetch<AuthUser>('/api/auth/login', input),

  register: (input: RegisterInput) =>
    authFetch<AuthUser>('/api/auth/register', {
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      ...(input.phone ? { phone: input.phone } : {}),
    }),

  logout: () => authFetch<null>('/api/auth/logout'),

  refresh: () => authFetch<AuthUser>('/api/auth/refresh'),

  me: () => get<AuthUser>('/auth/me'),

  changePassword: (input: ChangePasswordInput) =>
    post<{ message: string }>('/auth/change-password', {
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    }),

  updateProfile: (input: UpdateProfileInput) =>
    patch<AuthUser>('/users/me', {
      fullName: input.fullName,
      ...(input.phone ? { phone: input.phone } : {}),
    }),
};
