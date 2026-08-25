'use client';

import { Boxes, PackageX, ShoppingBag, TriangleAlert, UserPlus, Users } from 'lucide-react';

import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductStatistics } from '@/features/products/hooks/use-products';
import { useUserStatistics } from '@/features/users/hooks/use-users';
import { formatCurrency, formatNumber } from '@/lib/utils';

function StatSkeleton() {
  return <Skeleton className="h-[104px] w-full rounded-lg" />;
}

export function DashboardOverview() {
  const products = useProductStatistics();
  const users = useUserStatistics();

  const loading = products.isLoading || users.isLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <StatSkeleton key={index} />)
        ) : (
          <>
            <StatCard
              label="Tổng sản phẩm"
              value={formatNumber(products.data?.total ?? 0)}
              hint={`${products.data?.published ?? 0} đang bán · ${products.data?.draft ?? 0} nháp`}
              icon={ShoppingBag}
            />
            <StatCard
              label="Tổng tồn kho"
              value={formatNumber(products.data?.totalStock ?? 0)}
              hint={`Giá trung bình ${formatCurrency(products.data?.averagePrice ?? 0)}`}
              icon={Boxes}
            />
            <StatCard
              label="Người dùng"
              value={formatNumber(users.data?.total ?? 0)}
              hint={`${users.data?.byRole?.ADMIN ?? 0} quản trị · ${users.data?.byRole?.CUSTOMER ?? 0} khách hàng`}
              icon={Users}
            />
            <StatCard
              label="Đăng ký tháng này"
              value={formatNumber(users.data?.newThisMonth ?? 0)}
              icon={UserPlus}
              tone="success"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cảnh báo tồn kho</CardTitle>
            <CardDescription>Những mặt hàng cần nhập thêm sớm</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Hết hàng"
                  value={formatNumber(products.data?.outOfStock ?? 0)}
                  icon={PackageX}
                  tone="destructive"
                />
                <StatCard
                  label="Sắp hết (≤ 10)"
                  value={formatNumber(products.data?.lowStock ?? 0)}
                  icon={TriangleAlert}
                  tone="warning"
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái tài khoản</CardTitle>
            <CardDescription>Phân bố người dùng theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              (['ACTIVE', 'INACTIVE', 'BANNED'] as const).map((status) => {
                const count = users.data?.byStatus?.[status] ?? 0;
                const total = users.data?.total || 1;
                const percent = Math.round((count / total) * 100);
                const label = { ACTIVE: 'Đang hoạt động', INACTIVE: 'Chưa kích hoạt', BANNED: 'Bị khoá' }[status];

                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{label}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
