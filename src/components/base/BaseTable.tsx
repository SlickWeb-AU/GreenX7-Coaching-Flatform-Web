'use client';

import type { CSSProperties, ReactNode } from 'react';

import { SortIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/api';

import { BasePagination } from './BasePagination';

export type BaseColumnAlign = 'left' | 'center' | 'right';
export type BaseSortOrder = 'asc' | 'desc';

export interface BaseColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: T[keyof T] | undefined, record: T, index: number) => ReactNode;
  sorter?: boolean | string;
  align?: BaseColumnAlign;
  width?: string | number;
  className?: string;
  headerClassName?: string;
}

export interface BaseTableProps<T> {
  columns: BaseColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T, index: number) => string);
  meta?: PaginationMeta | null;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sortField?: string | null;
  sortOrder?: BaseSortOrder | null;
  onSortChange?: (sortKey: string) => void;
  loading?: boolean;
  loadingRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRowClick?: (record: T, index: number) => void;
  showFooter?: boolean;
  className?: string;
}

const alignClass: Record<BaseColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function getSortKey<T>(column: BaseColumn<T>): string | null {
  if (!column.sorter) return null;
  return typeof column.sorter === 'string' ? column.sorter : column.key;
}

function getRowKey<T>(rowKey: BaseTableProps<T>['rowKey'], record: T, index: number): string {
  if (typeof rowKey === 'function') return rowKey(record, index);
  const raw = record[rowKey];
  if (raw === null || raw === undefined) return String(index);
  return typeof raw === 'object' ? String(index) : String(raw);
}

function getCellText<T>(value: T[keyof T] | undefined): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return '—';
  return String(value);
}

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
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border border-neutral-grey-6 bg-white px-4 py-12 text-center shadow-none',
          className,
        )}
      >
        <p className="body-16-bold mb-1 text-neutral-grey-1">{emptyTitle}</p>
        <p className="body-14-medium max-w-sm text-neutral-grey-3">{emptyDescription}</p>
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </div>
    );
  }

  const showPagination = showFooter && Boolean(onPageChange) && Boolean(meta || page !== undefined);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="overflow-hidden rounded-2xl border border-neutral-grey-6 bg-white shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left" aria-busy={loading || undefined}>
            <thead>
              <tr className="bg-neutral-grey-7">
                {columns.map((column) => {
                  const sortKey = getSortKey(column);
                  const sortable = sortKey !== null && onSortChange;
                  const active = sortable && sortField === sortKey;
                  const style: CSSProperties | undefined =
                    column.width !== undefined ? { width: column.width } : undefined;
                  return (
                    <th
                      key={column.key}
                      style={style}
                      aria-sort={
                        sortable
                          ? active
                            ? sortOrder === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                          : undefined
                      }
                      className={cn(
                        'px-4 py-3',
                        column.align && alignClass[column.align],
                        column.headerClassName,
                      )}
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={() => onSortChange(sortKey)}
                          className={cn(
                            'body-14-medium inline-flex items-center gap-2 text-neutral-grey-3 transition-colors hover:text-neutral-grey-1',
                            column.align === 'center' && 'justify-center',
                            column.align === 'right' && 'justify-end',
                          )}
                        >
                          <span>{column.title}</span>
                          <SortIcon aria-hidden className="shrink-0" />
                        </button>
                      ) : (
                        <span className="body-14-medium text-neutral-grey-3">{column.title}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                    <tr
                      key={`skeleton-${rowIndex}`}
                      className="border-b-2 border-neutral-grey-8 last:border-0"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3">
                          <div
                            aria-hidden
                            className="h-4 w-3/4 animate-pulse rounded bg-neutral-grey-7"
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((record, index) => (
                    <tr
                      key={getRowKey(rowKey, record, index)}
                      onClick={onRowClick ? () => onRowClick(record, index) : undefined}
                      className={cn(
                        'border-b-2 border-neutral-grey-8 last:border-0',
                        onRowClick && 'cursor-pointer hover:bg-neutral-grey-8',
                      )}
                    >
                      {columns.map((column) => {
                        const value =
                          column.dataIndex !== undefined ? record[column.dataIndex] : undefined;
                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'body-16-medium px-4 py-3 text-neutral-grey-2',
                              column.align && alignClass[column.align],
                              column.className,
                            )}
                          >
                            {column.render
                              ? column.render(value, record, index)
                              : getCellText(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
            </tbody>
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
