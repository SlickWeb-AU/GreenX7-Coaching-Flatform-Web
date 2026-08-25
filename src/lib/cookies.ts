import type { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import type { AuthTokens } from '@/types/auth';

/**
 * Token nằm trong httpOnly cookie của CHÍNH domain Next.js.
 * JavaScript phía trình duyệt không đọc được => XSS không lấy được token.
 * Trình duyệt cũng không bao giờ gọi thẳng NestJS: mọi request đi qua BFF của Next.
 */
export const COOKIE_NAMES = {
  accessToken: 'gx7_at',
  refreshToken: 'gx7_rt',
} as const;

const isSecure = process.env.COOKIE_SECURE === 'true';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

function baseOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: isSecure,
    // 'lax' cho phép cookie đi kèm khi điều hướng từ site khác sang (link, redirect OAuth)
    // nhưng vẫn chặn cross-site POST => đủ an toàn mà không vỡ luồng đăng nhập.
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

export function setAuthCookies(cookies: ResponseCookies, tokens: AuthTokens): void {
  cookies.set(
    COOKIE_NAMES.accessToken,
    tokens.accessToken,
    baseOptions(tokens.accessTokenExpiresIn),
  );
  cookies.set(
    COOKIE_NAMES.refreshToken,
    tokens.refreshToken,
    baseOptions(tokens.refreshTokenExpiresIn),
  );
}

export function clearAuthCookies(cookies: ResponseCookies): void {
  cookies.set(COOKIE_NAMES.accessToken, '', { ...baseOptions(0), maxAge: 0 });
  cookies.set(COOKIE_NAMES.refreshToken, '', { ...baseOptions(0), maxAge: 0 });
}
