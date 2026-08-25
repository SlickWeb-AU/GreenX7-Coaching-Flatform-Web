import { describe, expect, it } from 'vitest';

import { hasAnyPermission, hasPermission, PERMISSIONS, ROLE_PERMISSIONS } from './permissions';

describe('RBAC phía FE', () => {
  it('ADMIN có quyền quản trị người dùng', () => {
    expect(hasPermission(ROLE_PERMISSIONS.ADMIN, PERMISSIONS.USER_DELETE)).toBe(true);
  });

  it('CUSTOMER KHÔNG có quyền quản trị người dùng', () => {
    expect(hasPermission(ROLE_PERMISSIONS.CUSTOMER, PERMISSIONS.USER_DELETE)).toBe(false);
  });

  it('hasPermission yêu cầu ĐỦ tất cả quyền được liệt kê', () => {
    expect(
      hasPermission(ROLE_PERMISSIONS.CUSTOMER, [PERMISSIONS.PRODUCT_READ, PERMISSIONS.USER_READ]),
    ).toBe(false);
  });

  it('hasAnyPermission chỉ cần một quyền khớp', () => {
    expect(
      hasAnyPermission(ROLE_PERMISSIONS.CUSTOMER, [PERMISSIONS.USER_READ, PERMISSIONS.PRODUCT_READ]),
    ).toBe(true);
  });

  it('không có quyền nào thì luôn trả false', () => {
    expect(hasPermission(undefined, PERMISSIONS.PROFILE_READ)).toBe(false);
    expect(hasPermission([], PERMISSIONS.PROFILE_READ)).toBe(false);
  });
});
