'use client';

import { ApiError } from '@/lib/api-error';
import type { ApiErrorResponse } from '@/types/api';

/**
 * Logout đi thẳng vào ROUTE HANDLER của Next (/api/auth/logout),
 * KHÔNG qua /api/bff — vì cần xóa httpOnly cookie, việc mà chỉ route handler làm được.
 */
async function authFetch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json()) as
    { success: true; data: T; message?: string } | ApiErrorResponse;

  if (!response.ok || payload.success !== true) {
    const error = payload as ApiErrorResponse;
    throw new ApiError(
      error.message ?? 'Request failed',
      error.statusCode ?? response.status,
      error.errorCode ?? 'INTERNAL_ERROR',
      error.errors,
    );
  }

  return payload.data;
}

export const authApi = {
  logout: () => authFetch<null>('/api/auth/logout'),
};
