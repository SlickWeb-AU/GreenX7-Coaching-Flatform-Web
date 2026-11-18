import { NextResponse } from 'next/server';

import { backendFetch } from '@/lib/backend';

/** BFF request OTP code. No cookies involved. */
export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  const { status, body } = await backendFetch<unknown>('/auth/request-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return NextResponse.json(body, { status });
}
