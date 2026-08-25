'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';

import { productsApi } from '../api/products.api';
import type { ProductInput, ProductListParams } from '../schemas';

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.list(params),
    // Giữ dữ liệu trang cũ khi chuyển trang => bảng không nháy trắng
    placeholderData: (previous) => previous,
  });
}

export function useAdminProducts(params: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products.adminList(params),
    queryFn: () => productsApi.adminList(params),
    placeholderData: (previous) => previous,
  });
}

export function useProduct(idOrSlug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(idOrSlug),
    queryFn: () => productsApi.detail(idOrSlug),
    enabled: enabled && !!idOrSlug,
  });
}

export function useProductStatistics() {
  return useQuery({
    queryKey: queryKeys.products.statistics,
    queryFn: productsApi.statistics,
  });
}

/** Invalidate TOÀN BỘ nhánh 'products' — vừa list public, vừa list admin, vừa statistics */
function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (input: ProductInput) => productsApi.create(input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Tạo sản phẩm thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      productsApi.update(id, input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Cập nhật sản phẩm thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: async () => {
      await invalidate();
      toast.success('Xoá sản phẩm thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
