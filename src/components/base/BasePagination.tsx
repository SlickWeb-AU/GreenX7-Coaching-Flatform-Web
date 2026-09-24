'use client';

import { ArrowBackIcon, ArrowForwardIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/api';

import { BaseButton } from './BaseButton';
import { BaseIconButton } from './BaseIconButton';
import { buildPageItems } from './pagination-helpers';

export interface BasePaginationProps {
  meta?: PaginationMeta | null;
  page?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
  className?: string;
}

export function BasePagination({
  meta,
  page: pageProp,
  totalPages: totalPagesProp,
  onPageChange,
  showTotal = true,
  className,
}: BasePaginationProps) {
  const page = meta?.page ?? pageProp ?? 1;
  const totalPages = Math.max(meta?.totalPages ?? totalPagesProp ?? 1, 1);
  const total = meta?.total ?? null;
  const pageSize = meta?.pageSize ?? null;

  const start =
    total === null || pageSize === null || total === 0 ? null : (page - 1) * pageSize + 1;
  const end =
    total === null || pageSize === null || total === 0 ? null : Math.min(page * pageSize, total);

  const hasPreviousPage = meta ? meta.hasPreviousPage : page > 1;
  const hasNextPage = meta ? meta.hasNextPage : page < totalPages;

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="body-14-medium text-neutral-grey-3">
        {showTotal && total !== null && start !== null && end !== null ? (
          <p>
            Showing {start}–{end} of {total}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <BaseIconButton
          size={32}
          disabled={!hasPreviousPage}
          aria-label="Previous page"
          icon={<ArrowBackIcon size={16} color="#53635C" aria-hidden />}
          onClick={() => onPageChange(page - 1)}
        />
        {buildPageItems(page, totalPages).map((item, index) =>
          item === '…' ? (
            <span
              key={`gap-${index}`}
              className="body-14-medium px-1 text-neutral-grey-3"
              aria-hidden
            >
              …
            </span>
          ) : (
            <BaseButton
              key={item}
              size="small"
              variant={item === page ? 'primary' : 'secondary'}
              pill
              className="h-8 w-8 px-0"
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </BaseButton>
          ),
        )}
        <BaseIconButton
          size={32}
          disabled={!hasNextPage}
          aria-label="Next page"
          icon={<ArrowForwardIcon size={16} color="#53635C" aria-hidden />}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}
