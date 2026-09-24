import { ShieldOff } from 'lucide-react';
import Link from 'next/link';

import { BaseButton } from '@/components/base';
import { ROUTES } from '@/config/routes';

export const metadata = { title: 'Không có quyền truy cập' };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-secondary-red-2 p-4">
        <ShieldOff className="h-8 w-8 text-secondary-red-4" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold text-neutral-grey-1">Bạn không có quyền truy cập</h1>
      <p className="max-w-md text-neutral-grey-3">
        Khu vực này chỉ dành cho tài khoản có quyền phù hợp. Nếu bạn cho rằng đây là nhầm lẫn, hãy
        liên hệ quản trị viên.
      </p>
      <div className="flex gap-2">
        <BaseButton asChild variant="secondary" pill>
          <Link href={ROUTES.home}>Về trang chủ</Link>
        </BaseButton>
        <BaseButton asChild variant="primary">
          <Link href={ROUTES.admin.dashboard}>Về trang quản trị</Link>
        </BaseButton>
      </div>
    </main>
  );
}
