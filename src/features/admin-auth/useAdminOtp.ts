'use client';

import { useMutation } from '@tanstack/react-query';

import type { AuthUser } from '@/types/auth';

async function postAuth<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as { success: boolean; message: string; data: T };
  if (!response.ok || body.success !== true) {
    throw new Error(body.message || 'Request failed. Please try again.');
  }
  return body.data;
}

export function useAdminOtp() {
  const requestCode = useMutation({
    mutationFn: (email: string) => postAuth<unknown>('request-code', { email }),
  });
  const verifyCode = useMutation({
    mutationFn: (payload: { email: string; code: string }) =>
      postAuth<AuthUser>('verify-code', payload),
  });
  return { requestCode, verifyCode };
}
