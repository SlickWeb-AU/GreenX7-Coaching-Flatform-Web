import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { ProductCard } from '@/features/products/components/product-card';
import { serverGetPaginated } from '@/lib/server-api';
import type { Product } from '@/types/entities';

/**
 * Trang chủ render trên SERVER: HTML trả về đã có sẵn sản phẩm.
 * Tốt cho SEO và cho người dùng mạng chậm — không phải chờ JS tải xong mới thấy nội dung.
 */
export default async function HomePage() {
  const { items: featured } = await serverGetPaginated<Product>(
    '/products?pageSize=8&sortBy=createdAt&sortOrder=desc',
  );

  const highlights = [
    { icon: Leaf, title: 'Hữu cơ 100%', description: 'Canh tác không hoá chất, chứng nhận rõ ràng.' },
    { icon: Truck, title: 'Giao trong ngày', description: 'Đặt trước 15h, nhận hàng ngay hôm đó.' },
    { icon: ShieldCheck, title: 'Đổi trả 24h', description: 'Không hài lòng, hoàn tiền không hỏi lý do.' },
  ];

  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary-50 to-background">
        <div className="container grid gap-8 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Leaf className="h-4 w-4" aria-hidden />
              Nông sản sạch mỗi ngày
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Thực phẩm tươi ngon
              <br />
              <span className="text-primary">từ nông trại GreenX7</span>
            </h1>
            <p className="max-w-lg text-muted-foreground">
              Rau củ, trái cây và thực phẩm khô được tuyển chọn kỹ lưỡng, minh bạch nguồn gốc và
              giao đến tận nhà bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.shop.products}>
                  Mua sắm ngay
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.register}>Tạo tài khoản</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="h-fit rounded-md bg-primary-50 p-2 text-primary-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Sản phẩm mới nhất</h2>
            <p className="text-sm text-muted-foreground">Vừa được bổ sung vào cửa hàng</p>
          </div>
          <Button asChild variant="ghost">
            <Link href={ROUTES.shop.products}>
              Xem tất cả
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {featured.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có sản phẩm nào"
            description="Kiểm tra lại backend đã chạy và đã seed dữ liệu chưa (npm run db:seed)."
          />
        )}
      </section>
    </>
  );
}
