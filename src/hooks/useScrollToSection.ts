'use client';

import { useEffect } from 'react';

/**
 * Scroll smoothly to element with `targetId` using native scrollIntoView.
 * Retries shortly if element is not in DOM yet.
 */
export function useScrollToSection(targetId?: string) {
  useEffect(() => {
    if (!targetId) return;

    let timer: NodeJS.Timeout;
    let attempts = 0;

    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof window !== 'undefined' && window.location.search.includes('scrollTo')) {
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.delete('scrollTo');
          window.history.replaceState(null, '', nextUrl.pathname + nextUrl.search + nextUrl.hash);
        }
        return;
      }
      if (attempts < 10) {
        attempts++;
        timer = setTimeout(tryScroll, 100);
      }
    };

    timer = setTimeout(tryScroll, 100);

    return () => clearTimeout(timer);
  }, [targetId]);
}

export default useScrollToSection;
