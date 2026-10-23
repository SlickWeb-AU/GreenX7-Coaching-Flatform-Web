import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/layout/admin-shell';
import { ROUTES } from '@/config/routes';
import { COOKIE_NAMES } from '@/lib/cookies';
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
  const cookieStore = await cookies();
  const hasTokens =
    Boolean(cookieStore.get(COOKIE_NAMES.accessToken)?.value) ||
    Boolean(cookieStore.get(COOKIE_NAMES.refreshToken)?.value);

  // Nếu hoàn toàn không có token (đã đăng xuất hoặc chưa đăng nhập), điều hướng thẳng về login không kèm lỗi
  if (!hasTokens) {
    redirect(ROUTES.login);
  }

  const { data: user, status, errorCode } = await serverGetWithStatus<AuthUser>('/auth/me');

  if (!user) {
    let reason = 'session_expired';
    if (status === 403 || errorCode === 'ACCOUNT_INACTIVE') {
      reason = 'account_inactive';
    } else if (
      status === 404 ||
      errorCode === 'NOT_FOUND' ||
      (status === 401 && errorCode === 'TOKEN_INVALID')
    ) {
      reason = 'account_deleted';
    }
    redirect(`/api/auth/logout?reason=${reason}`);
  }

  if (user.role !== USER_ROLES.ADMINISTRATOR && user.role !== USER_ROLES.SUPER_ADMIN) {
    redirect('/forbidden');
  }

  return <AdminShell>{children}</AdminShell>;
}
