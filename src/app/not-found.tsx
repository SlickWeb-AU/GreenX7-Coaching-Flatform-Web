import Link from 'next/link';

import { BaseButton } from '@/components/base';
import { ROUTES } from '@/config/routes';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-brand-green-2">404</p>
      <h1 className="text-2xl font-semibold text-neutral-grey-1">Page not found</h1>
      <p className="max-w-md text-neutral-grey-3">
        The page you are looking for does not exist or has been moved.
      </p>
      <BaseButton asChild>
        <Link href={ROUTES.home}>Back to home</Link>
      </BaseButton>
    </main>
  );
}

