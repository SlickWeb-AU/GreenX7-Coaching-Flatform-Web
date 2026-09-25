'use client';

import type { ReactNode } from 'react';

export function BaseHeader({
  title,
  actions,
  className,
}: {
  title: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 ${className ?? ''}`}>
      <div className="body-32-bold text-neutral-grey-1">{title}</div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
