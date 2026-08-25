import { isServer, QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-error';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 60s: đủ để việc điều hướng qua lại không bắn lại request,
        // nhưng vẫn đủ tươi cho dashboard admin.
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Đừng retry lỗi do người dùng (401/403/404/422) — chỉ tốn thời gian
          if (error instanceof ApiError && error.statusCode < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: tạo mới mỗi request (không được chia sẻ cache giữa các user).
 * Browser: dùng lại một instance duy nhất, và KHÔNG tạo lại khi React re-render
 * trong lúc suspense — nếu tạo lại, toàn bộ cache sẽ mất.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

/** Query key tập trung — tránh gõ tay chuỗi rời rạc rồi invalidate trượt */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: unknown) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    statistics: ['users', 'statistics'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: unknown) => ['products', 'list', params] as const,
    adminList: (params: unknown) => ['products', 'admin-list', params] as const,
    detail: (idOrSlug: string) => ['products', 'detail', idOrSlug] as const,
    statistics: ['products', 'statistics'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: ['categories', 'list'] as const,
  },
} as const;
