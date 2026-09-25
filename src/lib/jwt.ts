import { decodeJwt, jwtVerify } from 'jose';

import type { AccessTokenPayload } from '@/types/auth';

/**
 * Verify access token at the EDGE (middleware) with `jose` — the only library
 * running in Edge Runtime (jsonwebtoken needs Node crypto).
 *
 * SECURITY: JWT_ACCESS_SECRET is required. Missing config throws at startup
 * (fail closed), never falls back to a placeholder.
 */
function getSecret(): Uint8Array {
  const secretStr = process.env.JWT_ACCESS_SECRET;
  if (!secretStr) {
    throw new Error('JWT_ACCESS_SECRET environment variable is missing.');
  }
  return new TextEncoder().encode(secretStr);
}

/**
 * Verify token signature HS256/HS384/HS512.
 * Returns payload if valid; null if signature invalid, expired, or malformed.
 *
 * WARNING: never fall back to `decodeJwt` on verify failure.
 * `decodeJwt` only base64-decodes without checking the signature — it lets
 * forged tokens pass as authorized.
 */
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtVerify<AccessTokenPayload>(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Read token payload WITHOUT verifying the signature.
 * UI-only use (e.g. estimating exp); NEVER for auth or route guards.
 */
export function readTokenClaims(token: string): AccessTokenPayload | null {
  try {
    return decodeJwt(token) as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}

/** Read `exp` without verifying — estimate only, never for auth */
export function isTokenExpiringSoon(payload: AccessTokenPayload, withinSeconds = 60): boolean {
  return payload.exp - Math.floor(Date.now() / 1000) < withinSeconds;
}
