import { Leaf } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/config/routes';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Cột thương hiệu — ẩn trên mobile để nhường chỗ cho form */}
      <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href={ROUTES.home} className="flex items-center gap-2 text-lg font-semibold">
          <Leaf className="h-6 w-6" aria-hidden />
          GreenX7
        </Link>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            Thực phẩm sạch,
            <br />
            từ nông trại đến bàn ăn
          </h2>
          <p className="max-w-sm text-primary-foreground/80">
            Nền tảng quản lý và phân phối nông sản hữu cơ — minh bạch nguồn gốc, tươi mới mỗi ngày.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} GreenX7. All rights reserved.
        </p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
