'use client';

import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui.store';

/**
 * Phần khung admin buộc phải là client component vì lề trái của vùng nội dung
 * phụ thuộc trạng thái thu gọn sidebar (zustand). Layout cha vẫn là server component
 * để còn kiểm tra quyền trước khi render.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className={cn('transition-[padding] duration-200', sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64')}>
        <AdminHeader />
        <main className="space-y-6 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
