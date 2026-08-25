'use client';

import { MoreHorizontal, PackageSearch, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Can } from '@/components/shared/can';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchInput } from '@/components/shared/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PERMISSIONS } from '@/config/permissions';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Product, ProductStatus } from '@/types/entities';

import { useAdminProducts, useDeleteProduct } from '../hooks/use-products';
import type { ProductListParams } from '../schemas';
import { ProductFormDialog } from './product-form-dialog';

const ALL = 'all';

const STATUS_META: Record<ProductStatus, { label: string; variant: 'success' | 'secondary' | 'outline' }> = {
  PUBLISHED: { label: 'Đang bán', variant: 'success' },
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

export function AdminProductsTable() {
  const [params, setParams] = useState<ProductListParams>({ page: 1, pageSize: 10 });
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const { data, isLoading } = useAdminProducts(params);
  const deleteMutation = useDeleteProduct();

  const updateFilter = (partial: Partial<ProductListParams>) =>
    setParams((prev) => ({ ...prev, ...partial, page: 1 }));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={params.search ?? ''}
              onChange={(search) => updateFilter({ search })}
              placeholder="Tìm theo tên, mô tả hoặc SKU..."
              className="sm:max-w-xs"
            />

            <Select
              value={params.status ?? ALL}
              onValueChange={(value) =>
                updateFilter({ status: value === ALL ? undefined : (value as ProductStatus) })
              }
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả trạng thái</SelectItem>
                <SelectItem value="PUBLISHED">Đang bán</SelectItem>
                <SelectItem value="DRAFT">Nháp</SelectItem>
                <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>

            <Can permission={PERMISSIONS.PRODUCT_CREATE}>
              <Button className="sm:ml-auto" onClick={openCreate}>
                <Plus />
                Thêm sản phẩm
              </Button>
            </Can>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : data?.items.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <p className="font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category?.name ?? '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                        {product.salePrice !== null && (
                          <p className="text-xs text-destructive">
                            KM {formatCurrency(product.salePrice)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock <= 10 ? 'font-medium text-destructive' : ''}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_META[product.status].variant}>
                          {STATUS_META[product.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal />
                              <span className="sr-only">Thao tác</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Can permission={PERMISSIONS.PRODUCT_UPDATE}>
                              <DropdownMenuItem onSelect={() => openEdit(product)}>
                                <Pencil />
                                Sửa
                              </DropdownMenuItem>
                            </Can>
                            <Can permission={PERMISSIONS.PRODUCT_DELETE}>
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setDeleting(product)}
                              >
                                <Trash2 />
                                Xoá
                              </DropdownMenuItem>
                            </Can>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                meta={data.meta}
                onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              />
            </>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="Chưa có sản phẩm nào"
              description="Bắt đầu bằng cách thêm sản phẩm đầu tiên."
              action={
                <Can permission={PERMISSIONS.PRODUCT_CREATE}>
                  <Button onClick={openCreate}>
                    <Plus />
                    Thêm sản phẩm
                  </Button>
                </Can>
              }
            />
          )}
        </CardContent>
      </Card>

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xoá sản phẩm?"
        description={`"${deleting?.name}" sẽ bị ẩn khỏi hệ thống. Dữ liệu vẫn được giữ lại để đối soát.`}
        confirmLabel="Xoá"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleting) return;
          deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />
    </>
  );
}
