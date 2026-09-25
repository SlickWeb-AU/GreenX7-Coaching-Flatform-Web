import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface BaseLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  startIcon?: ReactNode;
  children?: ReactNode;
}

export function BaseLink({ href, startIcon, className, children, ...props }: BaseLinkProps) {
  return (
    <Link
      href={href}
      className={cn('body-14-bold inline-flex items-center gap-1 text-brand-green-2', className)}
      {...props}
    >
      {startIcon && <span className="inline-flex shrink-0 text-current">{startIcon}</span>}
      {children}
    </Link>
  );
}
