import type { UserRole } from '@/types/auth';

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forbidden: '/forbidden',

  // Khu vực khách hàng
  shop: {
    products: '/products',
    productDetail: (slug: string) => `/products/${slug}`,
    profile: '/profile',
  },

  // Khu vực quản trị
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    products: '/admin/products',
    categories: '/admin/categories',
  },
} as const;

/** Route công khai — không cần đăng nhập */
export const PUBLIC_ROUTES = ['/', '/products', '/forbidden'];

/** Route chỉ dành cho khách CHƯA đăng nhập — đã đăng nhập vào đây sẽ bị đẩy về trang chủ theo role */
export const GUEST_ONLY_ROUTES = ['/login', '/register'];

/**
 * Bảo vệ theo tiền tố đường dẫn.
 * Middleware duyệt từ trên xuống, lấy match ĐẦU TIÊN.
 */
export const PROTECTED_ROUTE_RULES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/profile', roles: ['ADMIN', 'CUSTOMER'] },
];

/** Sau khi đăng nhập, mỗi role được đưa về đâu */
export const DEFAULT_REDIRECT_BY_ROLE: Record<UserRole, string> = {
  ADMIN: ROUTES.admin.dashboard,
  CUSTOMER: ROUTES.shop.products,
};
