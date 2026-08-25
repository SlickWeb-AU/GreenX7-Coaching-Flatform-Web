import 'server-only';

import { cookies } from 'next/headers';

import type { PaginatedResult } from '@/types/api';

import { backendFetch, isSuccess } from './backend';
import { COOKIE_NAMES } from './cookies';

/**
 * Gọi API từ SERVER COMPONENT.
 *
 * Vì sao cần cái này khi đã có axios? Server component chạy trên server, không có
 * `window`, không đi qua BFF. Nó đọc thẳng access token từ cookie và gọi NestJS —
 * bớt được một chặng mạng, và dữ liệu có sẵn ngay trong HTML lần đầu (tốt cho SEO
 * và cảm giác nhanh).
 *
 * Server component KHÔNG tự refresh token được (không set được cookie).
 * Việc đó do middleware lo trước khi request chạm tới page — xem src/middleware.ts.
 */
async function accessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_NAMES.accessToken)?.value;
}

export async function serverGet<T>(path: string): Promise<T | null> {
  const { body } = await backendFetch<T>(path, { accessToken: await accessToken() });
  return isSuccess(body) ? body.data : null;
}

export async function serverGetPaginated<T>(path: string): Promise<PaginatedResult<T>> {
  const { body } = await backendFetch<T[]>(path, { accessToken: await accessToken() });

  if (!isSuccess(body)) {
    return {
      items: [],
      meta: {
        page: 1,
        pageSize: 0,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return {
    items: body.data,
    meta: body.meta ?? {
      page: 1,
      pageSize: body.data.length,
      total: body.data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}
