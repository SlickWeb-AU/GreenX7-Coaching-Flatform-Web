import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/lib/backend';
import { COOKIE_NAMES } from '@/lib/cookies';

/**
 * PROXY BFF — mọi request từ trình duyệt tới NestJS đều đi qua đây.
 *
 *   axios.get('/products')  ->  /api/bff/products  ->  http://localhost:8000/api/v1/products
 *
 * Nhiệm vụ: đọc access token từ httpOnly cookie và gắn vào header Authorization.
 * Nhờ vậy JavaScript phía client KHÔNG BAO GIỜ chạm vào token (chống XSS),
 * mà vẫn dùng axios bình thường như một API cùng origin (không cần CORS, không cần preflight).
 *
 * Proxy KHÔNG tự refresh token — việc đó do axios interceptor (client) và middleware
 * (điều hướng) đảm nhiệm, để logic refresh chỉ nằm ở một chỗ duy nhất.
 */

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

async function proxy(request: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  const search = request.nextUrl.search;
  const targetUrl = `${API_URL}/${path.join('/')}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && key.toLowerCase() !== 'cookie') {
      headers.set(key, value);
    }
  });
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: 'no-store',
    });

    const responseBody = await upstream.text();

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        statusCode: 503,
        message: 'Không kết nối được tới máy chủ. Vui lòng thử lại.',
        errorCode: 'NETWORK_ERROR',
      },
      { status: 503 },
    );
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx.params);
}
export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx.params);
}
export async function PUT(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx.params);
}
export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx.params);
}
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(request, ctx.params);
}
