import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@/config/routes';
import { backendFetch } from '@/lib/backend';
import { clearAuthCookies, COOKIE_NAMES } from '@/lib/cookies';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  // Báo BE revoke refresh token. Lỗi ở bước này không chặn việc đăng xuất phía client:
  // xoá cookie là đủ để user thoát khỏi phiên trên trình duyệt.
  if (accessToken) {
    try {
      await backendFetch('/auth/logout', { method: 'POST', accessToken, body: JSON.stringify({}) });
    } catch {
      // Backend failure should not block clearing cookies
    }
  }

  const response = NextResponse.json({ success: true, message: 'Signed out successfully' });
  clearAuthCookies(response.cookies);
  return response;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  if (accessToken) {
    try {
      await backendFetch('/auth/logout', { method: 'POST', accessToken, body: JSON.stringify({}) });
    } catch {
      // Backend failure should not block clearing cookies
    }
  }

  const reason = request.nextUrl.searchParams.get('reason');
  const loginUrl = new URL(ROUTES.login, request.url);
  if (reason) {
    loginUrl.searchParams.set('error', reason);
  }

  const response = NextResponse.redirect(loginUrl);
  clearAuthCookies(response.cookies);
  return response;
}
