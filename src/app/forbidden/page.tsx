import { ShieldOff } from 'lucide-react';

import { BaseLink } from '@/components/base';
import { ROUTES } from '@/config/routes';

export const metadata = { title: 'Access Denied' };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-secondary-red-2 p-4">
        <ShieldOff className="h-8 w-8 text-secondary-red-4" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold text-neutral-grey-1">Access Denied</h1>
      <p className="max-w-md text-neutral-grey-3">
        This area is restricted to authorized accounts only. If you believe this is an error, please
        contact your administrator.
      </p>
      <div className="flex gap-2">
        <BaseLink href={ROUTES.home}>Back to home</BaseLink>
        <BaseLink href={ROUTES.admin.dashboard}>Back to dashboard</BaseLink>
      </div>
    </main>
  );
}
