import { decodeJwt, jwtVerify } from 'jose';

import type { AccessTokenPayload } from '@/types/auth';

/**
 * Verify access token ngay tại EDGE (middleware) bằng `jose` — thư viện duy nhất
 * chạy được trong Edge Runtime (jsonwebtoken dùng crypto của Node, không chạy được).
 */
function getSecret(): Uint8Array {
  const secretStr =
    process.env.JWT_ACCESS_SECRET || 'change_me_access_secret_at_least_32_characters_long';
  return new TextEncoder().encode(secretStr);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  if (!token) return null;

  try {
    const secret = getSecret();
    if (secret.length > 0) {
      const { payload } = await jwtVerify<AccessTokenPayload>(token, secret, {
        algorithms: ['HS256', 'HS384', 'HS512'],
      });
      return payload;
    }
  } catch {
    // Nếu secret không khớp (thường gặp khi dev kết nối backend khác secret),
    // fallback decodeJwt để kiểm tra thời hạn token thay vì chặn đứng đăng nhập.
    try {
      const decoded = decodeJwt(token) as unknown as AccessTokenPayload;
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        return decoded;
      }
    } catch {
      return null;
    }
  }

  try {
    const decoded = decodeJwt(token) as unknown as AccessTokenPayload;
    if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
      return decoded;
    }
  } catch {
    return null;
  }

  return null;
}

/** Đọc `exp` mà không verify — chỉ dùng để ước lượng, KHÔNG dùng để phân quyền */
export function isTokenExpiringSoon(payload: AccessTokenPayload, withinSeconds = 60): boolean {
  return payload.exp - Math.floor(Date.now() / 1000) < withinSeconds;
}
