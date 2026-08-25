'use client';

import { del, get, patch, post } from '@/lib/axios';
import type { Category } from '@/types/entities';

export interface CategoryInput {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const categoriesApi = {
  list: (includeInactive = false) =>
    get<Category[]>('/categories', { params: includeInactive ? { includeInactive: true } : {} }),

  create: (input: CategoryInput) => post<Category>('/categories', input),
  update: (id: string, input: Partial<CategoryInput>) => patch<Category>(`/categories/${id}`, input),
  remove: (id: string) => del<{ message: string }>(`/categories/${id}`),
};
