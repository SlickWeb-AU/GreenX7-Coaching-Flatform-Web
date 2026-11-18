'use client';

import { useMutation } from '@tanstack/react-query';

import { type ApiError } from '@/lib/api-error';
import { post } from '@/lib/axios';
import type { AuthUser, RequestCodeResponse } from '@/types/auth';

export function useAdminOtp() {
  const requestCode = useMutation<RequestCodeResponse, ApiError, string>({
    mutationFn: (email: string) =>
      post<RequestCodeResponse>('/api/auth/request-code', { email }, { baseURL: '' }),
  });
  const verifyCode = useMutation<AuthUser, ApiError, { email: string; code: string }>({
    mutationFn: (payload: { email: string; code: string }) =>
      post<AuthUser>('/api/auth/verify-code', payload, { baseURL: '' }),
  });
  return { requestCode, verifyCode };
}
