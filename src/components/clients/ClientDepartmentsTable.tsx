'use client';

import Link from 'next/link';

import { BaseTable, BaseTrend, type BaseColumn } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { formatBatteryScore } from '@/lib/clients';
import type { ClientDepartment, DepartmentListItemDto, PaginationMeta } from '@/types';

export interface ClientDepartmentsTableProps {
  clientId: string;
  data: (DepartmentListItemDto | ClientDepartment)[];
  meta?: PaginationMeta | null;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
  loading?: boolean;
  className?: string;
  previousMonthName?: string;
}

export function ClientDepartmentsTable({
  clientId,
  data,
  meta,
  page,
  totalPages,
  onPageChange,
  sortField,
  sortOrder,
  onSortChange,
  loading = false,
  className,
  previousMonthName,
}: ClientDepartmentsTableProps) {
  const columns: BaseColumn<DepartmentListItemDto | ClientDepartment>[] = [
    {
      key: 'name',
      title: 'Department',
      sorter: 'name',
      render: (_, row) => <span className="body-14-bold text-neutral-grey-1">{row.name}</span>,
    },
    {
      key: 'participantCount',
      title: 'Participants',
      sorter: 'participantCount',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">
          {row.participantCount && row.participantCount > 0 ? row.participantCount : '—'}
        </span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      sorter: 'score',
      render: (_, row) => {
        const hasSubmissions = (row.participantCount ?? 0) > 0;
        const scoreVal = 'score' in row ? row.score : row.batteryScore;
        return (
          <span className="body-14-bold text-brand-green-2">
            {hasSubmissions && scoreVal !== undefined && scoreVal !== null
              ? formatBatteryScore(scoreVal)
              : '—'}
          </span>
        );
      },
    },
    {
      key: 'vsPrevious',
      title: previousMonthName ? `vs. ${previousMonthName}` : 'vs. Previous',
      sorter: 'vsPreviousChange',
      render: (_, row) => {
        const hasSubmissions = (row.participantCount ?? 0) > 0;
        const vsPrev = hasSubmissions && 'vsPreviousChange' in row ? row.vsPreviousChange : null;
        return <BaseTrend value={vsPrev} />;
      },
    },
    {
      key: 'vsFirstCheck',
      title: 'vs. First Check',
      sorter: 'vsFirstCheckChange',
      render: (_, row) => {
        const hasSubmissions = (row.participantCount ?? 0) > 0;
        const vsFirst =
          hasSubmissions && 'vsFirstCheckChange' in row ? row.vsFirstCheckChange : null;
        return <BaseTrend value={vsFirst} />;
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => (
        <Link
          href={ROUTES.admin.departmentDetail(clientId, row.id)}
          className="body-14-bold text-brand-green-2 transition-colors hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={data}
      rowKey="id"
      meta={meta}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      sortField={sortField}
      sortOrder={sortOrder}
      onSortChange={onSortChange}
      loading={loading}
      className={className}
      emptyTitle="No departments found"
      emptyDescription="This client does not have any departments yet."
    />
  );
}

export default ClientDepartmentsTable;
