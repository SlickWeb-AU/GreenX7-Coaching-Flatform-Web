'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import { BaseButton } from '@/components/base';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Replace with Sentry.captureException(error) when APM is integrated
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-secondary-red-2 p-4">
        <AlertTriangle className="h-8 w-8 text-secondary-red-4" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold text-neutral-grey-1">Something went wrong</h1>
      <p className="max-w-md text-neutral-grey-3">
        An unexpected error occurred. Please try again or contact support if the issue persists.
      </p>
      {error.digest && <code className="text-xs text-neutral-grey-3">Error ID: {error.digest}</code>}
      <BaseButton onClick={reset}>Try again</BaseButton>
    </main>
  );
}

