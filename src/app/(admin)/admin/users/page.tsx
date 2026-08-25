import { PageHeader } from '@/components/shared/page-header';
import { AdminUsersTable } from '@/features/users/components/admin-users-table';

export const metadata = { title: 'Quản lý người dùng' };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Người dùng" description="Quản lý tài khoản, vai trò và trạng thái truy cập" />
      <AdminUsersTable />
    </>
  );
}
