import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { backendFetch } from '@/lib/backend';
import { clearAuthCookies, COOKIE_NAMES } from '@/lib/cookies';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  // Báo BE revoke refresh token. Lỗi ở bước này không chặn việc đăng xuất phía client:
  // xoá cookie là đủ để user thoát khỏi phiên trên trình duyệt.
  if (accessToken) {
    await backendFetch('/auth/logout', { method: 'POST', accessToken, body: JSON.stringify({}) });
  }

  const response = NextResponse.json({ success: true, message: 'Signed out successfully' });
  clearAuthCookies(response.cookies);
  return response;
}
