'use client';

import { del, get, getPaginated, patch, post } from '@/lib/axios';
import { cleanParams } from '@/lib/utils';
import type { Product, ProductStatistics } from '@/types/entities';

import type { ProductInput, ProductListParams } from '../schemas';

/** Chuyển form -> payload BE: chuỗi rỗng phải thành undefined, không được gửi '' cho uuid */
function toPayload(input: ProductInput) {
  return {
    name: input.name,
    price: input.price,
    stock: input.stock,
    status: input.status,
    ...(input.description ? { description: input.description } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.categoryId ? { categoryId: input.categoryId } : {}),
    ...(input.salePrice ? { salePrice: input.salePrice } : {}),
  };
}

export const productsApi = {
  /** Catalogue công khai — chỉ trả về hàng đã PUBLISHED (BE ép, client không lách được) */
  list: (params: ProductListParams) =>
    getPaginated<Product>('/products', { params: cleanParams(params) }),

  detail: (idOrSlug: string) => get<Product>(`/products/${idOrSlug}`),

  /** Khu vực quản trị — thấy cả DRAFT/ARCHIVED */
  adminList: (params: ProductListParams) =>
    getPaginated<Product>('/admin/products', { params: cleanParams(params) }),

  adminDetail: (id: string) => get<Product>(`/admin/products/${id}`),

  create: (input: ProductInput) => post<Product>('/admin/products', toPayload(input)),

  update: (id: string, input: Partial<ProductInput>) =>
    patch<Product>(`/admin/products/${id}`, toPayload(input as ProductInput)),

  remove: (id: string) => del<{ message: string }>(`/admin/products/${id}`),

  statistics: () => get<ProductStatistics>('/admin/products/statistics'),
};
