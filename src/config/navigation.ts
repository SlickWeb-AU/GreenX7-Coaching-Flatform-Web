import type { ComponentType, SVGProps } from 'react';

import {
  MenuClientsIcon,
  MenuDashboardIcon,
  MenuSettingsIcon,
} from '@/components/icons';
import { PERMISSIONS, type Permission } from './permissions';
import { ROUTES } from './routes';

export interface NavItemIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<NavItemIconProps>;
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
        icon: MenuDashboardIcon,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
        exact: true,
      },
      {
        label: 'Clients',
        href: ROUTES.admin.clients,
        icon: MenuClientsIcon,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
      },
      {
        label: 'Settings',
        href: ROUTES.admin.settings,
        icon: MenuSettingsIcon,
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
      },
    ],
  },
];
