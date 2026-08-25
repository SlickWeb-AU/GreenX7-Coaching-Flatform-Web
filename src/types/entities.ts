import type { UserRole, UserStatus } from './auth';

export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBrief {
  id: string;
  name: string;
  slug: string;
}

export interface Category extends CategoryBrief {
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string | null;
  images: string[];
  status: ProductStatus;
  category: CategoryBrief | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  total: number;
  newThisMonth: number;
  byRole: Partial<Record<UserRole, number>>;
  byStatus: Partial<Record<UserStatus, number>>;
}

export interface ProductStatistics {
  total: number;
  published: number;
  draft: number;
  outOfStock: number;
  lowStock: number;
  totalStock: number;
  averagePrice: number;
}
