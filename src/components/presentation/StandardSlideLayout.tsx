'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { ClientDepartmentHeader } from '@/components/clients';
import { GreenX7LogoLight, HowsYourBatterySticker } from '@/components/icons';
import { cn } from '@/lib/utils';
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
        <ClientDepartmentHeader
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          departmentClassName="text-neutral-grey-8"
          align="right"
        />
      </div>

      <div className="pointer-events-auto absolute bottom-10 left-10 z-20 flex items-center">
        <GreenX7LogoLight className="h-10 w-auto" />
      </div>

      {controls && (
        <div className="pointer-events-auto absolute bottom-10 right-10 z-20 flex items-center">
          {controls}
        </div>
      )}

      <main className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <div
          className={cn(
            // Slide luôn dựng ở khung 1600 (DeckShell co giãn cả khung) nên lề cố định 200
            // như Figma, không đổi theo bề ngang màn hình
            'mx-auto flex h-full w-full max-w-1600 flex-col justify-center px-[200px]',
            contentClassName,
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
