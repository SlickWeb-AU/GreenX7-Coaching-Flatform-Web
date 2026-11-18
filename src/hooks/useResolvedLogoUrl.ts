'use client';

import { useEffect, useState } from 'react';
import { resolveImageUrl } from '@/lib/utils';

/** Resolve a preview URL from an uploaded File (object URL) or a persisted image path. */
export function useResolvedLogoUrl(file?: File | null, currentUrl?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(currentUrl ? resolveImageUrl(currentUrl) : null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, currentUrl]);

  return url;
}
