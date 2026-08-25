import { jwtVerify } from 'jose';

import type { AccessTokenPayload } from '@/types/auth';

/**
 * Verify access token ngay tại EDGE (middleware) bằng `jose` — thư viện duy nhất
 * chạy được trong Edge Runtime (jsonwebtoken dùng crypto của Node, không chạy được).
 *
 * Vì sao phải VERIFY chứ không chỉ decode?
 * -> Chỉ decode thì ai cũng tự chế được một token `{"role":"ADMIN"}` và vào thẳng /admin.
 *    Verify chữ ký bằng secret dùng chung với BE mới thực sự chặn được.
 */
const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? '');

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  if (!token || secret.length === 0) return null;

  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    // Hết hạn, sai chữ ký, token rác — đều coi như không đăng nhập
    return null;
  }
}

/** Đọc `exp` mà không verify — chỉ dùng để ước lượng, KHÔNG dùng để phân quyền */
export function isTokenExpiringSoon(payload: AccessTokenPayload, withinSeconds = 60): boolean {
  return payload.exp - Math.floor(Date.now() / 1000) < withinSeconds;
}
