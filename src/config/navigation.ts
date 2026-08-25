import {
  LayoutDashboard,
  Leaf,
  Package,
  ShoppingBag,
  Tags,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { PERMISSIONS, type Permission } from './permissions';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Item chỉ hiện khi user có ĐỦ các permission này */
  permissions?: Permission[];
  /** true => chỉ active khi khớp chính xác (dùng cho trang gốc như /admin) */
  exact?: boolean;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

/** Sidebar khu vực ADMIN */
export const ADMIN_NAVIGATION: NavGroup[] = [
  {
    items: [
      {
        label: 'Tổng quan',
        href: ROUTES.admin.dashboard,
        icon: LayoutDashboard,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
        exact: true,
      },
    ],
  },
  {
    title: 'Quản lý',
    items: [
      {
        label: 'Sản phẩm',
        href: ROUTES.admin.products,
        icon: Package,
        permissions: [PERMISSIONS.PRODUCT_READ],
      },
      {
        label: 'Danh mục',
        href: ROUTES.admin.categories,
        icon: Tags,
        permissions: [PERMISSIONS.CATEGORY_READ],
      },
      {
        label: 'Người dùng',
        href: ROUTES.admin.users,
        icon: Users,
        permissions: [PERMISSIONS.USER_READ],
      },
    ],
  },
];

/** Menu chính khu vực CUSTOMER */
export const CUSTOMER_NAVIGATION: NavItem[] = [
  { label: 'Trang chủ', href: ROUTES.home, icon: Leaf, exact: true },
  { label: 'Sản phẩm', href: ROUTES.shop.products, icon: ShoppingBag },
  {
    label: 'Tài khoản',
    href: ROUTES.shop.profile,
    icon: User,
    permissions: [PERMISSIONS.PROFILE_READ],
  },
];
