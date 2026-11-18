import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface BaseBreadcrumbItem {
  label: string;
  href?: string;
}

export function BaseBreadcrumb({
  items,
  className,
}: {
  items: BaseBreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${item.href ?? index}`} className="flex items-center gap-2">
              {isCurrent ? (
                <span aria-current="page" className="body-14-bold text-neutral-grey-3">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="body-14-medium text-neutral-grey-3 transition-colors hover:text-brand-green-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="body-14-medium text-neutral-grey-3">{item.label}</span>
              )}
              {!isCurrent && (
                <span aria-hidden className="text-neutral-grey-4">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
