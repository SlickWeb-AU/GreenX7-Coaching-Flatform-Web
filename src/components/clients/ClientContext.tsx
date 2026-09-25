'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/features/admin-clients';
import type { ClientDetail } from '@/types';

interface ClientContextValue {
  clientId: string;
  client: ClientDetail | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ clientId, children }: { clientId: string; children: ReactNode }) {
  const {
    data: client,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-client', clientId],
    queryFn: () => clientsApi.getById(clientId),
    retry: false,
    enabled: Boolean(clientId),
  });

  return (
    <ClientContext.Provider
      value={{
        clientId,
        client,
        isLoading,
        refetch,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
