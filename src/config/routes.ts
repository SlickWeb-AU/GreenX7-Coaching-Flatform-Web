import { USER_ROLES, type UserRole } from '@/types/auth';

export const ROUTES = {
  home: '/',
  login: '/login',
  forbidden: '/forbidden',
  live: (clientSlug: string, departmentSlug: string) =>
    `/live/clients/${clientSlug}/departments/${departmentSlug}`,
  presentation: (clientSlug: string, departmentSlug: string) =>
    `/presentation/clients/${clientSlug}/departments/${departmentSlug}`,

  // Admin area
  admin: {
    dashboard: '/admin/dashboard',
    clients: '/admin/clients',
    clientNew: '/admin/clients/new',
    clientDetail: (id: string) => `/admin/clients/${id}`,
    clientEdit: (id: string) => `/admin/clients/${id}/edit`,
    departmentDetail: (clientId: string, deptId: string) =>
      `/admin/clients/${clientId}/departments/${deptId}`,
    settings: '/admin/settings',
    login: '/login',
  },
} as const;

/** Guest-only routes — signed-in users here are redirected home by role */
export const GUEST_ONLY_ROUTES = ['/login'];

/**
 * Path-prefix protection.
 * Middleware scans top-down and takes the FIRST match.
 */
export const PROTECTED_ROUTE_RULES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/admin', roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMINISTRATOR] },
];

/** Where each role lands after sign-in */
export const DEFAULT_REDIRECT_BY_ROLE: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: ROUTES.admin.dashboard,
  [USER_ROLES.ADMINISTRATOR]: ROUTES.admin.dashboard,
  [USER_ROLES.GUEST]: ROUTES.login,
};
