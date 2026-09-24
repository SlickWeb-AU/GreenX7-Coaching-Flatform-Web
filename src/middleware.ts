import { type NextRequest, NextResponse } from 'next/server';

import { COOKIE_NAMES } from '@/lib/cookies';
import { verifyAccessToken } from '@/lib/jwt';
import {
  DEFAULT_REDIRECT_BY_ROLE,
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTE_RULES,
  ROUTES,
} from '@/config/routes';
import { USER_ROLES, type AccessTokenPayload, type AuthTokens, type UserRole } from '@/types/auth';

/**
 * MIDDLEWARE — first line of defense for authorization.
 *
 * Runs at the Edge, before React renders. Three duties:
 *
 *  1. VERIFY (not just decode) the access token with the HS256 secret shared with the BE.
 *     Decoding alone would let anyone forge a token like `{"role":"ADMIN"}`.
 *
 *  2. Silently renew the session when the access token expired but the refresh token is alive.
 *     This MUST live in middleware: server components cannot set cookies,
 *     so without a refresh here the user would be kicked out every 15 minutes
 *     in the middle of browsing.
 *
 *  3. Block routes by role before any content leaks.
 *
 * NOTE: this is a NAVIGATION-BLOCKING layer, not a BE authorization replacement.
 * Data must still be protected by the BE — middleware only covers experience and attack surface.
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
  const options = {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
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

  // Broken/expired access token but refresh token still alive => try silent renewal
  if (!payload && refreshToken) {
    const outcome = await tryRefresh(refreshToken);
    payload = outcome.payload;
    renewedTokens = outcome.tokens;
    sessionDied = !outcome.payload;
  }

  const isAuthenticated = payload !== null;
  const role: UserRole = isAuthenticated
    ? USER_ROLES.ADMINISTRATOR
    : USER_ROLES.GUEST;

  /** Wrap every response so the just-renewed cookies are never forgotten */
  const finalize = (response: NextResponse): NextResponse => {
    response.headers.set('x-pathname', pathname);
    if (renewedTokens) return applyTokens(response, renewedTokens);
    if (sessionDied) return clearTokens(response);
    return response;
  };

  const nextWithPathname = (): NextResponse => {
    const headers = new Headers(request.headers);
    headers.set('x-pathname', pathname);
    return finalize(NextResponse.next({ request: { headers } }));
  };

  const cleanSearch = search && search !== '?' ? search : '';

  // ---- 0. Redirect legacy admin routes ----
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return finalize(NextResponse.redirect(new URL(ROUTES.login, request.url)));
  }

  // Home '/' was removed — guests here are redirected to the matching area
  if (pathname === '/') {
    const target = isAuthenticated ? `${ROUTES.admin.dashboard}${cleanSearch}` : ROUTES.login;
    return finalize(NextResponse.redirect(new URL(target, request.url)));
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    return finalize(
      NextResponse.redirect(new URL(`${ROUTES.admin.dashboard}${cleanSearch}`, request.url)),
    );
  }

  // ---- 1. Guest-only routes ----
  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && role) {
      const redirectUrl = DEFAULT_REDIRECT_BY_ROLE[role as UserRole] ?? ROUTES.admin.dashboard;
      return finalize(NextResponse.redirect(new URL(redirectUrl, request.url)));
    }
    return nextWithPathname();
  }

  // ---- 2. Protected routes ----
  const rule = PROTECTED_ROUTE_RULES.find(
    (r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`),
  );

  if (rule) {
    if (!isAuthenticated || !role) {
      return finalize(NextResponse.redirect(new URL(ROUTES.login, request.url)));
    }

    if (!rule.roles.includes(role as any)) {
      return finalize(NextResponse.redirect(new URL('/forbidden', request.url)));
    }
  }

  return nextWithPathname();
}

export const config = {
  matcher: [
    /*
     * Skip:
     *  - /api/*        (BFF handles its own auth)
     *  - /_next/*      (build assets)
     *  - static files with an extension
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
