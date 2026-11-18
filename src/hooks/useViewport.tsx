'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface ViewportContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DEFAULT_VIEWPORT: ViewportContextValue = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

const ViewportContext = createContext<ViewportContextValue>(DEFAULT_VIEWPORT);

function getDevice(width: number): ViewportContextValue {
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ViewportContextValue>(() =>
    typeof window !== 'undefined' ? getDevice(window.innerWidth) : DEFAULT_VIEWPORT,
  );

  useEffect(() => {
    const onResize = () => setValue(getDevice(window.innerWidth));
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>;
}

export function useViewport(): ViewportContextValue {
  return useContext(ViewportContext);
}
