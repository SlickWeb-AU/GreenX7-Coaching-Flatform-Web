'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BaseTagVariant = 'green' | 'yellow' | 'cyan' | 'red';

export interface BaseTagProps {
  variant?: BaseTagVariant;
  children: ReactNode;
  className?: string;
}

const TAG_VARIANTS: Record<BaseTagVariant, string> = {
  green: 'bg-secondary-green-2 text-brand-green-2',
  yellow: 'bg-secondary-yellow-2 text-secondary-yellow-3',
  cyan: 'bg-secondary-cyan-2 text-secondary-cyan-3',
  red: 'bg-secondary-red-2 text-secondary-red-4',
};

export function BaseTag({ variant = 'green', children, className }: BaseTagProps) {
  return (
    <span
      className={cn(
        'body-12-bold inline-flex items-center rounded-full px-2 py-[3px]',
        TAG_VARIANTS[variant] ?? TAG_VARIANTS.green,
        className,
      )}
    >
      {children}
    </span>
  );
}

export default BaseTag;
