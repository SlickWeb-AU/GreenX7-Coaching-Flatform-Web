'use client';

import { ApiError } from '@/lib/api-error';
import { http } from '@/lib/axios';
import type { ApiErrorResponse } from '@/types/api';

interface DownloadOptions {
  method?: 'get' | 'post';
  params?: Record<string, string | number | undefined>;
  data?: unknown;
  /** Tên file dùng khi máy chủ không gửi Content-Disposition */
  fallbackName: string;
  /** Trang công khai (báo cáo token) không có phiên đăng nhập để làm mới */
  requiresAuth?: boolean;
}

/** Lấy tên file từ `filename*=UTF-8''...` (giữ được dấu) hoặc `filename="..."` */
function fileNameFrom(disposition: string | undefined, fallback: string): string {
  if (!disposition) return fallback;
  const star = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (star) return decodeURIComponent(star[1]);
  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain ? plain[1] : fallback;
}

/**
 * Tải file nhị phân (PDF) từ API qua BFF rồi bấm tải xuống.
 *
 * Không đi qua interceptor lỗi của axios: lỗi của request dạng blob là một Blob
 * chứa JSON, interceptor không đọc được nên chỉ ra câu chung chung. Ở đây đọc
 * lại thành JSON để hiện đúng thông báo của máy chủ.
 */
export async function downloadFile(url: string, opts: DownloadOptions): Promise<void> {
  // Access token sống 15 phút: gọi nhẹ một API có xác thực để interceptor tự làm
  // mới phiên nếu đã hết hạn, trước khi tải file (request blob không tự retry).
  if (opts.requiresAuth !== false) await http.get('/auth/me');

  const res = await http.request<Blob>({
    url,
    method: opts.method ?? 'get',
    params: opts.params,
    data: opts.data,
    responseType: 'blob',
    validateStatus: () => true,
  });

  if (res.status >= 400) {
    let body: Partial<ApiErrorResponse> = {};
    try {
      body = JSON.parse(await res.data.text()) as ApiErrorResponse;
    } catch {
      // không phải JSON — dùng thông báo mặc định bên dưới
    }
    throw new ApiError(
      body.message ?? 'Could not export the PDF. Please try again.',
      body.statusCode ?? res.status,
      body.errorCode ?? 'INTERNAL_ERROR',
    );
  }

  const name = fileNameFrom(
    res.headers['content-disposition'] as string | undefined,
    opts.fallbackName,
  );
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}
