import { PageHeader } from '@/components/shared/page-header';
import { ProductCatalog } from '@/features/products/components/product-catalog';

export const metadata = {
  title: 'Sản phẩm',
  description: 'Danh sách nông sản sạch tại GreenX7',
};

export default function ProductsPage() {
  return (
    <div className="container space-y-6 py-10">
      <PageHeader
        title="Sản phẩm"
        description="Nông sản hữu cơ, thực phẩm sạch được tuyển chọn mỗi ngày"
      />
      <ProductCatalog />
    </div>
  );
}
