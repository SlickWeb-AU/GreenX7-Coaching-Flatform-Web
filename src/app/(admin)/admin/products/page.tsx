import { PageHeader } from '@/components/shared/page-header';
import { AdminProductsTable } from '@/features/products/components/admin-products-table';

export const metadata = { title: 'Quản lý sản phẩm' };

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader
        title="Sản phẩm"
        description="Thêm, sửa và quản lý trạng thái hiển thị của sản phẩm"
      />
      <AdminProductsTable />
    </>
  );
}
