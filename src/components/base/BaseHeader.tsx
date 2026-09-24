'use client';

import type { ReactNode } from 'react';

export function BaseHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
      <h1 className="body-32-bold text-neutral-grey-1">{title}</h1>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
