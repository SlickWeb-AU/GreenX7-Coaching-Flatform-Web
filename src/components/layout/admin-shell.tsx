'use client';

import type { ReactNode } from 'react';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { PresentationMobileWarning } from '@/components/presentation/PresentationMobileWarning';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <>
      <PresentationMobileWarning
        title="Desktop Screen Required"
        description="The GreenX7 Admin Portal is designed specifically for desktop viewports to give you the best experience for data analytics, client management, and reporting."
        helperNotice="Please access this page from a laptop, desktop computer, or expand your browser window."
        showCopyButton={false}
      />
      <div className="hidden min-h-screen bg-neutral-grey-8 lg:block">
        <AdminSidebar />
        <div className="lg:pl-56">
          <main className="p-4 lg:p-10 xl:p-12">{children}</main>
        </div>
      </div>
    </>
  );
}
