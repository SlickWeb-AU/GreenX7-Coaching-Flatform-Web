import { NextResponse } from 'next/server';

import { backendFetch, isSuccess } from '@/lib/backend';
import { setAuthCookies } from '@/lib/cookies';
import type { AuthResult } from '@/types/auth';

export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;

  const { status, body } = await backendFetch<AuthResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!isSuccess(body)) {
    return NextResponse.json(body, { status });
  }

  const response = NextResponse.json(
    { success: true, message: body.message, data: body.data.user },
    { status: 201 },
  );

  setAuthCookies(response.cookies, body.data.tokens);
  return response;
}
