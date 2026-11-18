import type { BaseColumn, BaseColumnAlign, BaseTableProps } from './types';

export const alignClass: Record<BaseColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function getSortKey<T>(column: BaseColumn<T>): string | null {
  if (!column.sorter) return null;
  return typeof column.sorter === 'string' ? column.sorter : column.key;
}

export function getRowKey<T>(
  rowKey: BaseTableProps<T>['rowKey'],
  record: T,
  index: number,
): string {
  if (typeof rowKey === 'function') return rowKey(record, index);
  const raw = record[rowKey];
  if (raw === null || raw === undefined) return String(index);
  return typeof raw === 'object' ? String(index) : String(raw);
}

export function getCellText<T>(value: T[keyof T] | undefined): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return '—';
  return String(value);
}
