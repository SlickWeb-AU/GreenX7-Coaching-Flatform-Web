'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { AuthProvider } from './auth-provider';
import type { AuthUser } from '@/types/auth';

import { ConfirmProvider } from './confirm-provider';
import { QueryProvider } from './query-provider';

export function AppProviders({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}) {
  return (
    <QueryProvider>
      <AuthProvider initialUser={initialUser}>
        <ConfirmProvider>
          {children}
          <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 4000 }} />
        </ConfirmProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export * from './confirm-provider';
