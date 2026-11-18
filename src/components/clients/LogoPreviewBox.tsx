'use client';

import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LogoPreviewBoxProps {
  surface: 'light' | 'dark';
  alt: string;
  logoUrl: string | null;
  height: number;
}

export function LogoPreviewBox({ surface, alt, logoUrl, height }: LogoPreviewBoxProps) {
  const isDark = surface === 'dark';

  return (
    <div
      className={cn(
        // Fixed h-36 (144px) keeps box height constant across the 24-96px resize range
        'flex h-36 items-center justify-center rounded-xl px-6 py-4',
        isDark ? 'bg-brand-green-2' : 'border border-neutral-grey-6 bg-neutral-grey-8',
      )}
    >
      <div className="flex min-w-0 items-center justify-center">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={alt}
            style={{ height: `${height}px` }}
            className="w-auto max-w-full object-contain transition-all"
          />
        ) : (
          <Leaf
            size={height}
            aria-hidden
            className={cn('transition-all', isDark ? 'text-white' : 'text-brand-green-2')}
          />
        )}
      </div>
    </div>
  );
}
