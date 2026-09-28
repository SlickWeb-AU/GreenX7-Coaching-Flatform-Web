'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface TableEmptyProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function TableEmpty({
  title = 'No results found',
  description = 'Try adjusting your filters.',
  action,
  className,
}: TableEmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-neutral-grey-6 bg-white px-4 py-12 text-center shadow-none',
        className,
      )}
    >
      <p className="body-16-bold mb-1 text-neutral-grey-1">{title}</p>
      <p className="body-14-medium max-w-sm text-neutral-grey-3">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
