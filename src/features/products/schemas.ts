import { z } from 'zod';

export const productSchema = z
  .object({
    name: z.string().min(2, 'Tên sản phẩm quá ngắn').max(255),
    description: z.string().max(5000).optional().or(z.literal('')),
    price: z.coerce.number({ invalid_type_error: 'Giá phải là số' }).min(0, 'Giá không được âm'),
    salePrice: z.coerce.number().min(0).optional().nullable(),
    stock: z.coerce.number().int('Tồn kho phải là số nguyên').min(0, 'Tồn kho không được âm'),
    sku: z.string().max(64).optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    categoryId: z.string().uuid('Danh mục không hợp lệ').optional().or(z.literal('')),
  })
  .refine((data) => !data.salePrice || data.salePrice < data.price, {
    message: 'Giá khuyến mãi phải nhỏ hơn giá gốc',
    path: ['salePrice'],
  });

export type ProductInput = z.infer<typeof productSchema>;

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
