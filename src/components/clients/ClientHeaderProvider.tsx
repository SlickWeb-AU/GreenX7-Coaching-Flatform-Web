'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface ClientHeaderSlot {
  title?: ReactNode;
  actions?: ReactNode;
  breadcrumbLabel?: string;
}

interface ClientHeaderContextValue {
  headerSlot: ClientHeaderSlot | null;
  setHeaderSlot: (slot: ClientHeaderSlot | null) => void;
}

const ClientHeaderContext = createContext<ClientHeaderContextValue>({
  headerSlot: null,
  setHeaderSlot: () => {},
});

export function ClientHeaderProvider({ children }: { children: ReactNode }) {
  const [headerSlot, setHeaderSlot] = useState<ClientHeaderSlot | null>(null);

  return (
    <ClientHeaderContext.Provider value={{ headerSlot, setHeaderSlot }}>
      {children}
    </ClientHeaderContext.Provider>
  );
}

export function useClientHeaderSlot() {
  return useContext(ClientHeaderContext);
}

export function useClientHeader(slot: ClientHeaderSlot) {
  const { setHeaderSlot } = useContext(ClientHeaderContext);
  const slotRef = useRef(slot);
  slotRef.current = slot;

  useEffect(() => {
    setHeaderSlot(slotRef.current);
    return () => setHeaderSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    slot.breadcrumbLabel,
    typeof slot.title === 'string' ? slot.title : undefined,
    setHeaderSlot,
  ]);
}
