import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/layout/admin-shell';
import { serverGetWithStatus } from '@/lib/server-api';
import { USER_ROLES, type AuthUser } from '@/types/auth';

/**
 * Second defense layer (middleware is the first).
 *
 * Why both? Middleware trusts the access-token signature. If an account was
 * just demoted or locked, the old token stays signature-valid until expiry.
 * This check asks the BE directly, so it reflects the true state at request time.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { data: user, status, errorCode } = await serverGetWithStatus<AuthUser>('/auth/me');

  if (!user) {
    const reason =
      status === 403 || errorCode === 'ACCOUNT_INACTIVE' ? 'account_inactive' : 'session_expired';
    redirect(`/api/auth/logout?reason=${reason}`);
  }

  if (user.role !== USER_ROLES.ADMINISTRATOR && user.role !== USER_ROLES.SUPER_ADMIN) {
    redirect('/forbidden');
  }

  return <AdminShell>{children}</AdminShell>;
}
