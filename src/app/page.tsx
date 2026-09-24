import { redirect } from 'next/navigation';

import { serverGet } from '@/lib/server-api';
import type { AuthUser } from '@/types/auth';

export default async function HomePage() {
  const user = await serverGet<AuthUser>('/auth/me');
  if (user?.role === 'ADMINISTRATOR' || (user?.role as string) === 'ADMIN') {
    redirect('/admin/dashboard');
  }
  redirect('/login');
}
