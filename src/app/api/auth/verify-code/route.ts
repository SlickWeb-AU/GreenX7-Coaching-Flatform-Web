import { NextResponse } from 'next/server';

import { backendFetch, isSuccess } from '@/lib/backend';
import { setAuthCookies } from '@/lib/cookies';
import type { AuthResult } from '@/types/auth';

/**
 * BFF verify OTP code.
 * Receives tokens from NestJS, stores them in httpOnly cookies,
 * returns only the user to the browser.
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  const { status, body } = await backendFetch<AuthResult>('/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!isSuccess(body)) {
    return NextResponse.json(body, { status });
  }

  const response = NextResponse.json(
    { success: true, message: body.message, data: body.data.user },
    { status: 200 },
  );
  setAuthCookies(response.cookies, body.data.tokens);
  return response;
}
