'use client';

import { createContext, useContext, type ReactNode } from 'react';
import Image from 'next/image';

import { HowsYourBatterySticker } from '@/components/icons';
import { cn, resolveImageUrl } from '@/lib/utils';
import { useOptionalPresentation } from '@/components/presentation/PresentationContext';
import type { BaseSlideProps, SlideLayoutContextValue } from '@/types';

export interface StandardSlideLayoutProps extends BaseSlideProps {
  children: ReactNode;
  contentClassName?: string;
}

const SlideLayoutContext = createContext<SlideLayoutContextValue | null>(null);

export const SlideLayoutProvider = SlideLayoutContext.Provider;

export function useSlideLayout(): SlideLayoutContextValue | null {
  const layoutCtx = useContext(SlideLayoutContext);
  const presCtx = useOptionalPresentation();
  if (layoutCtx) {
    return {
      clientName: layoutCtx.clientName ?? presCtx?.clientName,
      departmentName: layoutCtx.departmentName ?? presCtx?.departmentName,
      clientLogoUrl: layoutCtx.clientLogoUrl ?? presCtx?.clientLogoUrl,
      controls: layoutCtx.controls,
    };
  }
  if (presCtx) {
    return {
      clientName: presCtx.clientName,
      departmentName: presCtx.departmentName,
      clientLogoUrl: presCtx.clientLogoUrl,
    };
  }
  return null;
}

export function StandardSlideLayout({
  children,
  clientName: propClientName,
  departmentName: propDeptName,
  clientLogoUrl: propLogoUrl,
  controls: propControls,
  className,
  contentClassName,
}: StandardSlideLayoutProps) {
  const ctx = useSlideLayout();
  const clientName = propClientName ?? ctx?.clientName;
  const departmentName = propDeptName ?? ctx?.departmentName;
  const clientLogoUrl = propLogoUrl ?? ctx?.clientLogoUrl;
  const controls = propControls ?? ctx?.controls;
  const logoContent = (
    <div className="flex h-12 items-center justify-end">
      {clientLogoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageUrl(clientLogoUrl)}
          alt={clientName ? `${clientName} logo` : 'Client logo'}
          className="h-12 w-auto object-contain brightness-0 invert"
        />
      ) : (
        <span className="body-16-bold text-white">{clientName}</span>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'relative h-full w-full select-none overflow-hidden bg-brand-green-2',
        className,
      )}
    >
      <div className="pointer-events-auto absolute left-10 top-10 z-20 flex items-center">
        <HowsYourBatterySticker className="-ml-1 -mt-1 h-auto w-32 cursor-default select-none drop-shadow-md" />
      </div>

      <div className="pointer-events-auto absolute right-10 top-10 z-20 flex items-center">
        <div className="flex flex-col items-end text-right">
          {logoContent}
          {departmentName && (
            <span className="body-20-medium mt-0.5 text-white/90">{departmentName}</span>
          )}
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-10 left-10 z-20 flex items-center">
        <Image
          src="/icons/greenx7-logo-light.svg"
          alt="GreenX7"
          width={200}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </div>

      {controls && (
        <div className="pointer-events-auto absolute bottom-10 right-10 z-20 flex items-center">
          {controls}
        </div>
      )}

      <main className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <div
          className={cn(
            'mx-auto flex h-full w-full max-w-1600 flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-[200px]',
            contentClassName,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
