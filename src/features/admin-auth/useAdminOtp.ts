'use client';

import { useMutation } from '@tanstack/react-query';

import type { AuthUser } from '@/types/auth';

export interface AuthApiError extends Error {
  errorCode?: string;
  statusCode?: number;
}

async function postAuth<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as {
    success: boolean;
    message?: string;
    errorCode?: string;
    statusCode?: number;
    data: T;
  };

  if (!response.ok || body.success !== true) {
    const error = new Error(body.message || 'Request failed. Please try again.') as AuthApiError;
    error.errorCode = body.errorCode;
    error.statusCode = body.statusCode ?? response.status;
    throw error;
  }
  return body.data;
}

export function useAdminOtp() {
  const requestCode = useMutation<unknown, AuthApiError, string>({
    mutationFn: (email: string) => postAuth<unknown>('request-code', { email }),
  });
  const verifyCode = useMutation<AuthUser, AuthApiError, { email: string; code: string }>({
    mutationFn: (payload: { email: string; code: string }) =>
      postAuth<AuthUser>('verify-code', payload),
  });
  return { requestCode, verifyCode };
}
