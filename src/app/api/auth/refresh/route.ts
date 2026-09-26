import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { backendFetch, isSuccess } from '@/lib/backend';
import { clearAuthCookies, COOKIE_NAMES, setAuthCookies } from '@/lib/cookies';
import type { AuthResult } from '@/types/auth';

/**
 * Đổi refresh token lấy cặp token mới.
 * Được gọi bởi: axios interceptor (khi XHR gặp 401) và middleware (khi điều hướng).
 *
 * BE dùng token rotation, nên refresh token cũ bị vô hiệu ngay sau lời gọi này.
 * Nếu BE từ chối => xoá cookie để user quay về màn đăng nhập một cách sạch sẽ.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refreshToken)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        message: 'Session expired',
        errorCode: 'UNAUTHORIZED',
      },
      { status: 401 },
    );
  }

  const { status, body } = await backendFetch<AuthResult>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!isSuccess(body)) {
    const failure = NextResponse.json(body, { status });
    clearAuthCookies(failure.cookies);
    return failure;
  }

  const response = NextResponse.json(
    { success: true, message: body.message, data: body.data.user },
    { status: 200 },
  );

  setAuthCookies(response.cookies, body.data.tokens);
  return response;
}
