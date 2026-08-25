'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';

import { categoriesApi, type CategoryInput } from '../api/categories.api';

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: [...queryKeys.categories.list, { includeInactive }],
    queryFn: () => categoriesApi.list(includeInactive),
    // Danh mục hiếm khi đổi -> để lâu hơn mặc định, đỡ gọi API vô ích
    staleTime: 10 * 60 * 1000,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    // Sản phẩm hiển thị kèm tên danh mục nên cũng phải làm mới theo
    await queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
  };
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (input: CategoryInput) => categoriesApi.create(input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Tạo danh mục thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CategoryInput> }) =>
      categoriesApi.update(id, input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Cập nhật danh mục thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: async () => {
      await invalidate();
      toast.success('Xoá danh mục thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
