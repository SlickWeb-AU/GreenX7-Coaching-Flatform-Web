import type { ReactNode } from 'react';
import type { PaginationMeta } from '@/types/api';
import type { SortOrder } from '@/constants/clients';

export type BaseColumnAlign = 'left' | 'center' | 'right';
export type BaseSortOrder = SortOrder;

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
