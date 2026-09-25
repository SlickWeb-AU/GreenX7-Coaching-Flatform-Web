'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface BaseCardProps {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  titleClassName?: string;
  subtitle?: string;
  actions?: ReactNode;
  prefixIcon?: ReactNode;
}

export function BaseCard({
  children,
  className,
  title,
  titleClassName,
  subtitle,
  actions,
  prefixIcon,
}: BaseCardProps) {
  const hasHeader = Boolean(title || subtitle || prefixIcon || actions);

  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-none', className)}>
      {hasHeader && (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {(title || prefixIcon) && (
              <div className="flex items-center gap-2">
                {prefixIcon && <span className="shrink-0 text-neutral-grey-2">{prefixIcon}</span>}
                {typeof title === 'string' ? (
                  <h2 className={cn('body-20-bold text-neutral-grey-1', titleClassName)}>
                    {title}
                  </h2>
                ) : (
                  title
                )}
              </div>
            )}
            {subtitle && <p className="body-14-medium mt-1 text-neutral-grey-3">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
