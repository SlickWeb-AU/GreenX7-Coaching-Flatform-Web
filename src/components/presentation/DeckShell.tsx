'use client';

import type { ReactNode } from 'react';

import { PRESENTATION_TOTAL_SLIDES } from '@/constants/presentation';
import { usePresentationNav } from '@/lib/presentation-nav';
import { cn } from '@/lib/utils';

export interface DeckShellProps {
  children?: ReactNode;
  currentSlide?: number;
  direction?: 'next' | 'prev';
  className?: string;
}

export function DeckShell({
  children,
  currentSlide: propCurrentSlide,
  direction: propDirection,
  className,
}: DeckShellProps) {
  const nav = usePresentationNav(PRESENTATION_TOTAL_SLIDES);
  const currentSlide = propCurrentSlide ?? nav.currentSlide;
  const direction = propDirection ?? nav.direction;

  const content = children;

  return (
    <div className="hidden min-h-screen w-full items-center justify-center overflow-hidden bg-black p-0 lg:flex">
      <div
        className={cn(
          'relative aspect-[16/9] max-h-screen w-full select-none overflow-hidden bg-brand-green-2 shadow-2xl',
          className,
        )}
      >
        <div
          key={currentSlide}
          className={cn(
            'h-full w-full transition-all duration-300 ease-out',
            direction === 'next'
              ? 'duration-300 animate-in fade-in slide-in-from-right-10'
              : 'duration-300 animate-in fade-in slide-in-from-left-10',
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
