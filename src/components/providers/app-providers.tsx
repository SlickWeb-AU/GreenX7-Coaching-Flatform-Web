'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/features/auth/auth-provider';
import type { AuthUser } from '@/types/auth';

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
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4000 }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
