'use client';

import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { ApiSuccessResponse, PaginatedResult } from '@/types/api';

import { toApiError } from './api-error';

/**
 * baseURL trỏ vào BFF của chính Next, KHÔNG trỏ thẳng vào NestJS.
 * Lợi ích: cùng origin (không CORS, không preflight), và access token nằm trong
 * httpOnly cookie do route handler gắn vào — JS phía client không đọc được token.
 */
export const http = axios.create({
  baseURL: '/api/bff',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
  // Cookie cùng origin luôn được gửi kèm; bật cho tường minh
  withCredentials: true,
});

// ---------------------------------------------------------------------------
// Tự động refresh khi gặp 401 — CÓ HÀNG ĐỢI
//
// Vấn đề kinh điển: một màn hình bắn 5 request song song, cả 5 cùng nhận 401
// => nếu mỗi request tự gọi refresh thì có 5 lần refresh. Với refresh token
// rotation của BE, lần refresh thứ 2 dùng token đã revoke => BE coi là token bị
// đánh cắp và huỷ toàn bộ phiên. User bị đá ra dù không làm gì sai.
//
// Cách xử lý: CHỈ request đầu tiên gọi refresh; các request còn lại xếp hàng chờ
// rồi được retry sau khi refresh xong.
// ---------------------------------------------------------------------------

let refreshPromise: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;

/** Cho AuthProvider đăng ký hành vi khi phiên hết hạn hẳn (clear state + điều hướng) */
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

async function refreshSession(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      // Nhả khoá ở tick kế tiếp để các request đang chờ kịp đọc kết quả
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();

  return refreshPromise;
}

interface RetriableConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    const shouldRefresh =
      status === 401 &&
      config &&
      !config._retried &&
      // Do not refresh for auth endpoints themselves (prevents infinite loop)
      !config.url?.includes('/auth/request-code') &&
      !config.url?.includes('/auth/verify-code') &&
      !config.url?.includes('/auth/refresh');

    if (shouldRefresh) {
      config._retried = true;
      const refreshed = await refreshSession();

      if (refreshed) {
        return http.request(config);
      }

      onSessionExpired?.();
    }

    return Promise.reject(toApiError(error));
  },
);

// ---------------------------------------------------------------------------
// Helper bóc vỏ response — service layer không phải viết `res.data.data` ở mọi nơi
// ---------------------------------------------------------------------------

type Wrapped<T> = AxiosResponse<ApiSuccessResponse<T>>;

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: Wrapped<T> = await http.get(url, config);
  return res.data.data;
}

/** Dùng cho endpoint phân trang: trả về cả items lẫn meta */
export async function getPaginated<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<PaginatedResult<T>> {
  const res: Wrapped<T[]> = await http.get(url, config);
  return {
    items: res.data.data,
    meta: res.data.meta ?? {
      page: 1,
      pageSize: res.data.data.length,
      total: res.data.data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: Wrapped<T> = await http.post(url, data, config);
  return res.data.data;
}

export async function patch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res: Wrapped<T> = await http.patch(url, data, config);
  return res.data.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: Wrapped<T> = await http.delete(url, config);
  return res.data.data;
}
