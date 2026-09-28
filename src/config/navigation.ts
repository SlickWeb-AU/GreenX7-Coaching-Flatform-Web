import { LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react';
import { PERMISSIONS, type Permission } from './permissions';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Item chỉ hiện khi user có ĐỦ các permission này */
  permissions?: Permission[];
  /** true => chỉ active khi khớp chính xác */
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
        label: 'Dashboard',
        href: ROUTES.admin.dashboard,
        icon: LayoutDashboard,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
        exact: true,
      },
      {
        label: 'Clients',
        href: ROUTES.admin.clients,
        icon: Users,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
      },
      {
        label: 'Settings',
        href: ROUTES.admin.settings,
        icon: Settings,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
      },
    ],
  },
];
