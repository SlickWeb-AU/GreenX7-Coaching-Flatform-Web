import { type NextRequest, NextResponse } from 'next/server';

import { COOKIE_NAMES } from '@/lib/cookies';
import { verifyAccessToken } from '@/lib/jwt';
import {
  DEFAULT_REDIRECT_BY_ROLE,
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTE_RULES,
} from '@/config/routes';
import type { AccessTokenPayload, AuthTokens, UserRole } from '@/types/auth';

/**
 * MIDDLEWARE — hàng phòng thủ ĐẦU TIÊN của phân quyền.
 *
 * Chạy ở Edge, trước cả khi React render. Ba nhiệm vụ:
 *
 *  1. VERIFY (không phải decode) access token bằng chữ ký HS256 dùng chung với BE.
 *     Chỉ decode thì bất kỳ ai cũng tự chế được token `{"role":"ADMIN"}`.
 *
 *  2. Tự làm mới phiên khi access token hết hạn nhưng refresh token còn sống.
 *     Việc này BẮT BUỘC phải nằm ở middleware: server component không set được
 *     cookie, nên nếu không refresh ở đây thì mỗi 15 phút user sẽ bị đá ra
 *     giữa lúc đang duyệt trang.
 *
 *  3. Chặn route theo role trước khi lộ bất kỳ nội dung nào.
 *
 * LƯU Ý: đây là lớp CHẶN ĐIỀU HƯỚNG, không thay thế phân quyền ở BE.
 * Dữ liệu vẫn phải được BE bảo vệ — middleware chỉ lo trải nghiệm và bề mặt tấn công.
 */

const API_URL = process.env.API_URL ?? 'http://localhost:8000/api/v1';
const isSecure = process.env.COOKIE_SECURE === 'true';

interface RefreshOutcome {
  payload: AccessTokenPayload | null;
  tokens: AuthTokens | null;
}

async function tryRefresh(refreshToken: string): Promise<RefreshOutcome> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) return { payload: null, tokens: null };

    const body = (await response.json()) as { data?: { tokens?: AuthTokens } };
    const tokens = body.data?.tokens;
    if (!tokens?.accessToken) return { payload: null, tokens: null };

    return { payload: await verifyAccessToken(tokens.accessToken), tokens };
  } catch {
    return { payload: null, tokens: null };
  }
}

function applyTokens(response: NextResponse, tokens: AuthTokens): NextResponse {
  const options = { httpOnly: true, secure: isSecure, sameSite: 'lax' as const, path: '/' };
  response.cookies.set(COOKIE_NAMES.accessToken, tokens.accessToken, {
    ...options,
    maxAge: tokens.accessTokenExpiresIn,
  });
  response.cookies.set(COOKIE_NAMES.refreshToken, tokens.refreshToken, {
    ...options,
    maxAge: tokens.refreshTokenExpiresIn,
  });
  return response;
}

function clearTokens(response: NextResponse): NextResponse {
  const options = { httpOnly: true, secure: isSecure, sameSite: 'lax' as const, path: '/', maxAge: 0 };
  response.cookies.set(COOKIE_NAMES.accessToken, '', options);
  response.cookies.set(COOKIE_NAMES.refreshToken, '', options);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get(COOKIE_NAMES.accessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value;

  let payload = accessToken ? await verifyAccessToken(accessToken) : null;
  let renewedTokens: AuthTokens | null = null;
  let sessionDied = false;

  // Access token hỏng/hết hạn nhưng vẫn còn refresh token => thử gia hạn im lặng
  if (!payload && refreshToken) {
    const outcome = await tryRefresh(refreshToken);
    payload = outcome.payload;
    renewedTokens = outcome.tokens;
    sessionDied = !outcome.payload;
  }

  const isAuthenticated = payload !== null;
  const role = payload?.role as UserRole | undefined;

  /** Bọc mọi response để không bao giờ quên ghi cookie vừa gia hạn */
  const finalize = (response: NextResponse): NextResponse => {
    if (renewedTokens) return applyTokens(response, renewedTokens);
    if (sessionDied) return clearTokens(response);
    return response;
  };

  // ---- 1. Route chỉ dành cho khách chưa đăng nhập ----
  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && role) {
      return finalize(NextResponse.redirect(new URL(DEFAULT_REDIRECT_BY_ROLE[role], request.url)));
    }
    return finalize(NextResponse.next());
  }

  // ---- 2. Route được bảo vệ ----
  const rule = PROTECTED_ROUTE_RULES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );

  if (rule) {
    if (!isAuthenticated || !role) {
      const loginUrl = new URL('/login', request.url);
      // Nhớ nơi user định đến để đăng nhập xong quay lại đúng chỗ
      loginUrl.searchParams.set('next', `${pathname}${search}`);
      return finalize(NextResponse.redirect(loginUrl));
    }

    if (!rule.roles.includes(role)) {
      return finalize(NextResponse.redirect(new URL('/forbidden', request.url)));
    }
  }

  return finalize(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Bỏ qua:
     *  - /api/*        (BFF tự xử lý auth của nó)
     *  - /_next/*      (asset build)
     *  - file tĩnh có phần mở rộng
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
