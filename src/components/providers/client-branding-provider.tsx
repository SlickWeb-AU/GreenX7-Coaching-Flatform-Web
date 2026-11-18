'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { resolveLogoHeights } from '@/lib/branding';
import { formatSlugLabel } from '@/lib/utils';
import type { ApiBrandingLike, ClientBrandingContextValue } from '@/types';

const ClientBrandingContext = createContext<ClientBrandingContextValue | null>(null);

export function ClientBrandingProvider({
  value,
  branding,
  clientSlug,
  departmentSlug,
  children,
}: {
  value?: ClientBrandingContextValue;
  branding?: ApiBrandingLike | null;
  clientSlug?: string | null;
  departmentSlug?: string | null;
  children: ReactNode;
}) {
  const isCompanyWide =
    branding?.isCompanyWide ||
    departmentSlug === 'company-wide' ||
    branding?.departmentName === null;

  const resolved: ClientBrandingContextValue = value ?? {
    clientName: branding?.clientName ?? (clientSlug ? formatSlugLabel(clientSlug) : null),
    departmentName: isCompanyWide
      ? null
      : (branding?.departmentName ?? (departmentSlug ? formatSlugLabel(departmentSlug) : null)),
    darkLogoUrl: branding?.darkLogoUrl ?? null,
    whiteLogoUrl: branding?.whiteLogoUrl ?? null,
    logoHeights: resolveLogoHeights(branding),
  };

  return (
    <ClientBrandingContext.Provider value={resolved}>{children}</ClientBrandingContext.Provider>
  );
}

export function useOptionalClientBranding(): ClientBrandingContextValue | null {
  return useContext(ClientBrandingContext);
}
