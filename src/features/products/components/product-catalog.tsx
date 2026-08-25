'use client';

import { PackageSearch } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchInput } from '@/components/shared/search-input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/features/categories/hooks/use-categories';

import type { ProductListParams } from '../schemas';
import { useProducts } from '../hooks/use-products';
import { ProductCard } from './product-card';
import { ProductCardSkeleton } from './product-card-skeleton';

const ALL = 'all';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Mới nhất' },
  { value: 'price:asc', label: 'Giá tăng dần' },
  { value: 'price:desc', label: 'Giá giảm dần' },
  { value: 'name:asc', label: 'Tên A → Z' },
];

export function ProductCatalog() {
  const [params, setParams] = useState<ProductListParams>({
    page: 1,
    pageSize: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, isError } = useProducts(params);
  const { data: categories } = useCategories();

  /** Mọi thay đổi bộ lọc đều đưa về trang 1 — nếu không, lọc xong có thể rơi vào trang trống */
  const updateFilter = (partial: Partial<ProductListParams>) =>
    setParams((prev) => ({ ...prev, ...partial, page: 1 }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={params.search ?? ''}
          onChange={(search) => updateFilter({ search })}
          placeholder="Tìm sản phẩm..."
          className="lg:max-w-sm"
        />

        <Select
          value={params.categoryId ?? ALL}
          onValueChange={(value) => updateFilter({ categoryId: value === ALL ? undefined : value })}
        >
          <SelectTrigger className="lg:w-52">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tất cả danh mục</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${params.sortBy}:${params.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split(':');
            updateFilter({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
          }}
        >
          <SelectTrigger className="lg:w-48">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          className="lg:ml-auto"
          onClick={() =>
            setParams({ page: 1, pageSize: 12, sortBy: 'createdAt', sortOrder: 'desc' })
          }
        >
          Xoá bộ lọc
        </Button>
      </div>

      {isError && (
        <EmptyState
          icon={PackageSearch}
          title="Không tải được danh sách sản phẩm"
          description="Kiểm tra kết nối tới máy chủ rồi thử lại."
        />
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {data && !isLoading && (
        <>
          {data.items.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="Không tìm thấy sản phẩm phù hợp"
              description="Thử đổi từ khoá hoặc bỏ bớt bộ lọc."
            />
          )}

          <Pagination
            meta={data.meta}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}
