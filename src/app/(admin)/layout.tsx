import { redirect } from 'next/navigation';

import { AdminShell } from '@/components/layout/admin-shell';
import { serverGet } from '@/lib/server-api';
import type { AuthUser } from '@/types/auth';

/**
 * LỚP BẢO VỆ THỨ HAI (middleware là lớp thứ nhất).
 *
 * Vì sao cần cả hai? Middleware tin vào chữ ký của access token. Nếu tài khoản vừa bị
 * hạ quyền hoặc bị khoá, token cũ vẫn còn hợp lệ về mặt chữ ký cho tới khi hết hạn.
 * Lần kiểm tra này hỏi thẳng BE nên phản ánh trạng thái THẬT tại thời điểm request.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await serverGet<AuthUser>('/auth/me');

  if (!user) redirect('/login?next=/admin');
  if (user.role !== 'ADMIN') redirect('/forbidden');

  return <AdminShell>{children}</AdminShell>;
}
