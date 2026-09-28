'use client';

import { cn } from '@/lib/utils';

import type { BaseColumn, BaseTableProps } from './types';
import { alignClass, getCellText, getRowKey } from './utils';

export interface TableBodyProps<T> {
  columns: BaseColumn<T>[];
  data: T[];
  rowKey: BaseTableProps<T>['rowKey'];
  loading?: boolean;
  loadingRows?: number;
  onRowClick?: (record: T, index: number) => void;
}

export function TableBody<T>({
  columns,
  data,
  rowKey,
  loading = false,
  loadingRows = 5,
  onRowClick,
}: TableBodyProps<T>) {
  if (loading && data.length === 0) {
    return (
      <tbody>
        {Array.from({ length: loadingRows }).map((_, rowIndex) => (
          <tr
            key={`skeleton-${rowIndex}`}
            className="border-b-2 border-neutral-grey-8 last:border-0"
          >
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3">
                <div aria-hidden className="h-4 w-3/4 animate-pulse rounded bg-neutral-grey-7" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody
      className={cn(
        loading &&
          data.length > 0 &&
          'pointer-events-none opacity-40 transition-opacity duration-200',
      )}
    >
      {data.map((record, index) => (
        <tr
          key={getRowKey(rowKey, record, index)}
          onClick={onRowClick ? () => onRowClick(record, index) : undefined}
          className={cn(
            'border-b-2 border-neutral-grey-8 last:border-0',
            onRowClick && 'cursor-pointer hover:bg-neutral-grey-8',
          )}
        >
          {columns.map((column) => {
            const value = column.dataIndex !== undefined ? record[column.dataIndex] : undefined;
            return (
              <td
                key={column.key}
                className={cn(
                  'body-16-medium px-4 py-3 text-neutral-grey-2',
                  column.align && alignClass[column.align],
                  column.className,
                )}
              >
                {column.render ? column.render(value, record, index) : getCellText(value)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
