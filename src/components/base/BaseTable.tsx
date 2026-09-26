'use client';

import { cn } from '@/lib/utils';

import { BasePagination } from './BasePagination';
import {
  TableBody,
  TableEmpty,
  TableHeader,
  TableLoadingOverlay,
  type BaseColumn,
  type BaseColumnAlign,
  type BaseSortOrder,
  type BaseTableProps,
} from './table';

export type { BaseColumn, BaseColumnAlign, BaseSortOrder, BaseTableProps };
export * from './table';

export function BaseTable<T>({
  columns,
  data,
  rowKey,
  meta,
  page,
  totalPages,
  onPageChange,
  sortField,
  sortOrder,
  onSortChange,
  loading = false,
  loadingRows = 5,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your filters.',
  emptyAction,
  onRowClick,
  showFooter = true,
  className,
}: BaseTableProps<T>) {
  if (!loading && data.length === 0) {
    return (
      <TableEmpty
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  const showPagination = showFooter && Boolean(onPageChange) && Boolean(meta || page !== undefined);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-grey-6 bg-white shadow-none">
        {loading && data.length > 0 && <TableLoadingOverlay />}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left" aria-busy={loading || undefined}>
            <TableHeader
              columns={columns}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            />
            <TableBody
              columns={columns}
              data={data}
              rowKey={rowKey}
              loading={loading}
              loadingRows={loadingRows}
              onRowClick={onRowClick}
            />
          </table>
        </div>
      </div>

      {showPagination && onPageChange ? (
        <BasePagination
          meta={meta}
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}

export default BaseTable;
