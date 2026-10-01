'use client';

import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { ClientLayoutContent } from '@/components/clients/ClientLayoutContent';
import { ClientHeaderProvider } from '@/components/clients/ClientHeaderProvider';
import { ClientProvider } from '@/components/clients/ClientContext';

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ clientId: string }>();

  return (
    <ClientProvider clientId={params.clientId}>
      <ClientHeaderProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </ClientHeaderProvider>
    </ClientProvider>
  );
}
