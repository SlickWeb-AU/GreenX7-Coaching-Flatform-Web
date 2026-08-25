import { NextResponse } from 'next/server';

/**
 * Healthcheck cho Docker/Nginx/load balancer.
 * CỐ Ý không gọi sang backend: đây là câu hỏi "tiến trình Next còn sống không",
 * không phải "cả hệ thống có khoẻ không". Nếu gộp chung, backend sập sẽ khiến
 * container FE bị restart liên tục dù bản thân nó hoàn toàn bình thường.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'greenx7-fe',
    uptimeSeconds: Math.floor(process.uptime()),
  });
}
