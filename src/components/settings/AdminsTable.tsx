import { BaseTable, type BaseColumn } from '@/components/base';
import { CLIENT_STATUSES } from '@/constants/clients';
import { cn } from '@/lib/utils';

import type { AdminUser } from '@/types';

export interface AdminsTableProps {
  admins: AdminUser[];
}

const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

const columns: BaseColumn<AdminUser>[] = [
  {
    key: 'name',
    title: 'Name',
    render: (_value, record) => (
      <span className="body-14-bold text-neutral-grey-1">{record.name || record.email}</span>
    ),
  },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  {
    key: 'role',
    title: 'Role',
    render: (_value, record) => (record.role ? titleCase(record.role) : '—'),
  },
  {
    key: 'status',
    title: 'Status',
    render: (_value, record) =>
      record.status ? (
        <span
          className={cn(
            'body-12-medium inline-flex items-center rounded-full px-2 py-0.5',
            record.status === CLIENT_STATUSES.ACTIVE
              ? 'bg-secondary-green-2 text-secondary-green-4'
              : 'bg-neutral-grey-7 text-neutral-grey-2',
          )}
        >
          {titleCase(record.status)}
        </span>
      ) : (
        '—'
      ),
  },
];

export function AdminsTable({ admins }: AdminsTableProps) {
  return (
    <BaseTable
      columns={columns}
      data={admins}
      rowKey="id"
      emptyTitle="No administrators yet"
      emptyDescription="Invite an administrator to get started."
    />
  );
}
