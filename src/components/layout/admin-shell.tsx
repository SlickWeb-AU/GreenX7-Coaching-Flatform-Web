'use client';

import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-grey-8">
      <AdminSidebar />
      <div className="lg:pl-56">
        <AdminHeader />
        <main className="p-4 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
