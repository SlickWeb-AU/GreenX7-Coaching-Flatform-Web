import { PageHeader } from '@/components/shared/page-header';
import { AdminCategories } from '@/features/categories/components/admin-categories';

export const metadata = { title: 'Quản lý danh mục' };

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader title="Danh mục" description="Nhóm sản phẩm theo danh mục để khách dễ tìm kiếm" />
      <AdminCategories />
    </>
  );
}
