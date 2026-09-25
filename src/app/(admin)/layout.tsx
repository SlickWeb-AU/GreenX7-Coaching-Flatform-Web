import { redirect } from 'next/navigation';

import { AdminShell } from '@/components/layout/admin-shell';
import { serverGet } from '@/lib/server-api';
import { USER_ROLES, type AuthUser } from '@/types/auth';

/**
 * Second defense layer (middleware is the first).
 *
 * Why both? Middleware trusts the access-token signature. If an account was
 * just demoted or locked, the old token stays signature-valid until expiry.
 * This check asks the BE directly, so it reflects the true state at request time.
 */
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await serverGet<AuthUser>('/auth/me');

  if (!user) redirect('/login');
  if (user.role !== USER_ROLES.ADMINISTRATOR) {
    redirect('/forbidden');
  }

  return <AdminShell>{children}</AdminShell>;
}
