'use client';

import { useRouter } from 'next/navigation';

import { BaseTable, type BaseColumn } from '@/components/base';
import { CLIENT_STATUSES } from '@/constants/clients';
import { cn, getInitials } from '@/lib/utils';
import { formatBatteryScore, industryName } from '@/lib/clients';
import type { ClientListItem, ClientsSortField, PaginationMeta } from '@/types';

export interface ClientsTableProps {
  rows: ClientListItem[];
  meta?: PaginationMeta | null;
  sortField: ClientsSortField;
  sortAsc: boolean;
  onToggleSort: (f: ClientsSortField) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function ClientsTable({
  rows,
  meta,
  sortField,
  sortAsc,
  onToggleSort,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: ClientsTableProps) {
  const router = useRouter();

  const columns: BaseColumn<ClientListItem>[] = [
    {
      key: 'name',
      title: 'Client',
      sorter: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <span className="body-12-medium flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-green-2 text-brand-green-2">
            {getInitials(row.businessName)}
          </span>
          <span className="body-16-bold text-neutral-grey-1">{row.businessName}</span>
        </div>
      ),
    },
    {
      key: 'industry',
      title: 'Industry',
      sorter: 'industry',
      render: (_, row) => industryName(row.industry),
    },
    {
      key: 'departments',
      title: 'Departments',
      render: (_, row) => row.departmentCount ?? 0,
    },
    {
      key: 'batteryScore',
      title: 'Battery Score',
      sorter: 'batteryScore',
      render: (_, row) => (
        <span className="font-medium text-brand-green-2">
          {formatBatteryScore(row.currentBatteryScore)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, row) => (
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-bold',
            row.status === CLIENT_STATUSES.ACTIVE
              ? 'bg-secondary-green-2 text-secondary-green-4'
              : 'bg-neutral-grey-7 text-neutral-grey-3',
          )}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={rows}
      rowKey="id"
      meta={meta}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      sortField={sortField}
      sortOrder={sortAsc ? 'asc' : 'desc'}
      onSortChange={(field) => onToggleSort(field as ClientsSortField)}
      loading={loading}
      emptyTitle="No clients found"
      emptyDescription="Get started by adding your first client."
      onRowClick={(row) => router.push(`/admin/clients/${row.id}`)}
    />
  );
}
