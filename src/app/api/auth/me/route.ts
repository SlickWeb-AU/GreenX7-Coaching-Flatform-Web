import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { backendFetch } from '@/lib/backend';
import { COOKIE_NAMES } from '@/lib/cookies';
import type { AuthUser } from '@/types/auth';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'Unauthorized', errorCode: 'UNAUTHORIZED' },
      { status: 401 },
    );
  }

  const { status, body } = await backendFetch<AuthUser>('/auth/me', { accessToken });
  return NextResponse.json(body, { status });
}
