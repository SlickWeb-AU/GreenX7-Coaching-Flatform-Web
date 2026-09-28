'use client';

import type { CSSProperties } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { BaseColumn, BaseSortOrder } from './types';
import { alignClass, getSortKey } from './utils';

export interface TableHeaderProps<T> {
  columns: BaseColumn<T>[];
  sortField?: string | null;
  sortOrder?: BaseSortOrder | null;
  onSortChange?: (sortKey: string) => void;
}

export function TableHeader<T>({
  columns,
  sortField,
  sortOrder,
  onSortChange,
}: TableHeaderProps<T>) {
  return (
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
                  <ArrowUpDown size={14} aria-hidden className="shrink-0" />
                </button>
              ) : (
                <span className="body-14-medium text-neutral-grey-3">{column.title}</span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
