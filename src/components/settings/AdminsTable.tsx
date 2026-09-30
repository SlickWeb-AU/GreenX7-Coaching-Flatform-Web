import { BaseTable, type BaseColumn } from '@/components/base';
import { cn, formatRoleLabel } from '@/lib/utils';
import { USER_ROLES, USER_STATUSES } from '@/types/auth';
import type { AdminUser } from '@/types';

export interface AdminsTableProps {
  admins: AdminUser[];
  loading?: boolean;
  currentUserId?: string;
  canManage?: boolean;
  onToggleStatus?: (admin: AdminUser) => void;
  onDelete?: (admin: AdminUser) => void;
  busyId?: string | null;
}

const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

export function AdminsTable({
  admins,
  loading = false,
  currentUserId,
  canManage = false,
  onToggleStatus,
  onDelete,
  busyId,
}: AdminsTableProps) {
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
      render: (_value, record) => formatRoleLabel(record.role),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_value, record) =>
        record.status ? (
          <span
            className={cn(
              'body-12-medium inline-flex items-center rounded-full px-2 py-0.5',
              record.status === USER_STATUSES.ACTIVE
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

  if (canManage) {
    columns.push({
      key: 'actions',
      title: '',
      align: 'right',
      render: (_value, record) => {
        const isSuperAdminRole = record.role === USER_ROLES.SUPER_ADMIN;
        const isSelf = Boolean(currentUserId && record.id === currentUserId);

        // SUPER_ADMIN accounts and self cannot be deactivated or deleted
        if (isSuperAdminRole || isSelf) {
          return null;
        }

        const isActive = record.status === USER_STATUSES.ACTIVE;
        const isBusy = busyId === record.id;

        return (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onToggleStatus?.(record)}
              className="body-14-bold text-brand-green-2 transition-colors hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onDelete?.(record)}
              className="body-14-bold text-secondary-red-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        );
      },
    });
  }

  return (
    <BaseTable
      columns={columns}
      data={admins}
      rowKey="id"
      loading={loading}
      emptyTitle="No administrators yet"
      emptyDescription="Invite an administrator to get started."
    />
  );
}
