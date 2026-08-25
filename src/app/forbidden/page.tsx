import { ShieldOff } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

export const metadata = { title: 'Không có quyền truy cập' };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <ShieldOff className="h-8 w-8 text-destructive" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold">Bạn không có quyền truy cập</h1>
      <p className="max-w-md text-muted-foreground">
        Khu vực này chỉ dành cho tài khoản có quyền phù hợp. Nếu bạn cho rằng đây là nhầm lẫn,
        hãy liên hệ quản trị viên.
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={ROUTES.home}>Về trang chủ</Link>
        </Button>
        <Button asChild>
          <Link href={ROUTES.shop.products}>Xem sản phẩm</Link>
        </Button>
      </div>
    </main>
  );
}
