import { NextResponse } from 'next/server';

import { backendFetch, isSuccess } from '@/lib/backend';
import { setAuthCookies } from '@/lib/cookies';
import type { AuthResult } from '@/types/auth';

/**
 * BFF đăng nhập.
 * Trình duyệt POST vào ĐÂY (cùng origin) chứ không gọi thẳng NestJS.
 * Route handler nhận cặp token rồi ghi vào httpOnly cookie — token không bao giờ
 * chạm tới JavaScript phía client.
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;

  const { status, body } = await backendFetch<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!isSuccess(body)) {
    return NextResponse.json(body, { status });
  }

  // CHỈ trả về thông tin user. Token ở lại phía server, nằm trong cookie.
  const response = NextResponse.json(
    { success: true, message: body.message, data: body.data.user },
    { status: 200 },
  );

  setAuthCookies(response.cookies, body.data.tokens);
  return response;
}
