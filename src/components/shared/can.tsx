'use client';

import type { ReactNode } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import type { Permission } from '@/config/permissions';
import type { UserRole } from '@/types/auth';

interface CanProps {
  /** Cần ĐỦ tất cả permission này */
  permission?: Permission | Permission[];
  /** Chỉ cần MỘT trong số này */
  anyPermission?: Permission[];
  /** Hoặc chặn thẳng theo role */
  role?: UserRole | UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Ẩn/hiện UI theo quyền.
 *
 *   <Can permission={PERMISSIONS.PRODUCT_CREATE}>
 *     <Button>Thêm sản phẩm</Button>
 *   </Can>
 *
 * NHẮC LẠI: đây chỉ là UX. Ẩn nút không ngăn được ai gọi thẳng API —
 * chặn thật nằm ở guard của NestJS.
 */
export function Can({ permission, anyPermission, role, fallback = null, children }: CanProps) {
  const { can, canAny, hasRole } = useAuth();

  if (permission && !can(permission)) return <>{fallback}</>;
  if (anyPermission && !canAny(anyPermission)) return <>{fallback}</>;
  if (role && !hasRole(role)) return <>{fallback}</>;

  return <>{children}</>;
}
