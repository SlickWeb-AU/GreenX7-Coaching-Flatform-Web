import 'server-only';

import type { ApiErrorResponse, ApiSuccessResponse } from '@/types/api';

/**
 * Địa chỉ NestJS. CHỈ tồn tại ở phía server (route handler, server component, middleware).
 * Trình duyệt không bao giờ biết URL này.
 */
export const API_URL = process.env.API_URL ?? 'http://localhost:8000/api/v1';

export interface BackendResult<T> {
  status: number;
  ok: boolean;
  body: ApiSuccessResponse<T> | ApiErrorResponse;
}

/** Gọi NestJS từ phía server Next. Không bao giờ throw — luôn trả status + body để caller tự xử lý. */
export async function backendFetch<T>(
  path: string,
  init: RequestInit & { accessToken?: string } = {},
): Promise<BackendResult<T>> {
  const { accessToken, headers, ...rest } = init;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      cache: 'no-store',
    });

    const text = await response.text();
    const body = (text ? JSON.parse(text) : null) as ApiSuccessResponse<T> | ApiErrorResponse;

    return { status: response.status, ok: response.ok, body };
  } catch {
    return {
      status: 503,
      ok: false,
      body: {
        success: false,
        statusCode: 503,
        message: 'Failed to connect to server. Please try again.',
        errorCode: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        path,
      },
    };
  }
}

export function isSuccess<T>(
  body: ApiSuccessResponse<T> | ApiErrorResponse,
): body is ApiSuccessResponse<T> {
  return body?.success === true;
}
