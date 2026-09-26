import { AxiosError } from 'axios';

import type { ApiErrorCode, ApiErrorResponse } from '@/types/api';

/** Lỗi API đã được chuẩn hoá — mọi nơi trong FE chỉ làm việc với kiểu này */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly errorCode: ApiErrorCode,
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isValidationError() {
    return this.errorCode === 'VALIDATION_ERROR' && !!this.fieldErrors;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isForbidden() {
    return this.statusCode === 403;
  }

  get isNotFound() {
    return this.statusCode === 404;
  }
}

/**
 * Biến bất kỳ thứ gì axios ném ra thành ApiError.
 * Nhờ BE luôn trả về đúng một shape lỗi, hàm này chỉ cần viết MỘT LẦN cho cả dự án.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return new ApiError(
        data.message,
        data.statusCode ?? error.response?.status ?? 500,
        data.errorCode ?? 'INTERNAL_ERROR',
        data.errors,
      );
    }

    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      return new ApiError(
        'Failed to connect to server. Please check your network connection.',
        503,
        'NETWORK_ERROR',
      );
    }

    return new ApiError(
      error.message || 'An error occurred',
      error.response?.status ?? 500,
      'INTERNAL_ERROR',
    );
  }

  return new ApiError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    500,
    'INTERNAL_ERROR',
  );
}

/** Đổ lỗi field từ BE vào react-hook-form: setFieldErrors(error, form.setError) */
export function applyFieldErrors(
  error: ApiError,
  setError: (field: string, error: { type: string; message: string }) => void,
): boolean {
  if (!error.fieldErrors) return false;

  let applied = false;
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    if (messages?.[0]) {
      setError(field, { type: 'server', message: messages[0] });
      applied = true;
    }
  }
  return applied;
}
