/** Khớp 1-1 với ResponseInterceptor / AllExceptionsFilter bên NestJS */

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode: ApiErrorCode;
  /** Lỗi theo từng field, map thẳng vào react-hook-form */
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}

/** Dữ liệu + meta sau khi bóc khỏi vỏ response */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export type ApiErrorCode =
  | 'INTERNAL_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_CREDENTIALS'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'REFRESH_TOKEN_REVOKED'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_BANNED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'RESOURCE_IN_USE'
  | 'INSUFFICIENT_STOCK'
  | 'NETWORK_ERROR';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
