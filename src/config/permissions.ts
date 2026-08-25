import type { UserRole } from '@/types/auth';

/**
 * PHẢI GIỮ ĐỒNG BỘ với src/common/constants/permission.constant.ts bên BE.
 *
 * Lưu ý quan trọng: bảng này chỉ để QUYẾT ĐỊNH HIỂN THỊ UI.
 * Ẩn một cái nút KHÔNG phải là bảo mật — BE mới là nơi thực sự chặn.
 * Vì vậy sai lệch nhỏ ở đây chỉ gây khó chịu về UX, không gây lỗ hổng.
 */
export const PERMISSIONS = {
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  CATEGORY_READ: 'category:read',
  CATEGORY_MANAGE: 'category:manage',

  DASHBOARD_VIEW: 'dashboard:view',

  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const CUSTOMER_PERMISSIONS: Permission[] = [
  PERMISSIONS.PROFILE_READ,
  PERMISSIONS.PROFILE_UPDATE,
  PERMISSIONS.PRODUCT_READ,
  PERMISSIONS.CATEGORY_READ,
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: CUSTOMER_PERMISSIONS,
  ADMIN: [
    ...CUSTOMER_PERMISSIONS,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.CATEGORY_MANAGE,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
};

export function hasPermission(
  userPermissions: readonly Permission[] | undefined,
  required: Permission | Permission[],
): boolean {
  if (!userPermissions?.length) return false;
  const list = Array.isArray(required) ? required : [required];
  return list.every((p) => userPermissions.includes(p));
}

export function hasAnyPermission(
  userPermissions: readonly Permission[] | undefined,
  required: Permission[],
): boolean {
  if (!userPermissions?.length) return false;
  return required.some((p) => userPermissions.includes(p));
}
