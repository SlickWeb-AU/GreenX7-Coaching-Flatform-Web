import { redirect } from 'next/navigation';

import { serverGet } from '@/lib/server-api';
import { USER_ROLES, type AuthUser } from '@/types/auth';

export default async function HomePage() {
  const user = await serverGet<AuthUser>('/auth/me');
  if (user?.role === USER_ROLES.ADMINISTRATOR || user?.role === USER_ROLES.SUPER_ADMIN) {
    redirect('/admin/dashboard');
  }
  redirect('/login');
}
