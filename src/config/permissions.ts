import { USER_ROLES, type UserRole } from '@/types/auth';

/**
 * Permission-based RBAC, not hardcoded roles.
 *
 * Only the ADMINISTRATOR role holds everything today. Keep the permission layer because the
 * Settings screen suggests more roles later (e.g. report-only viewers who cannot edit
 * clients). Then only one ROLE_PERMISSIONS line is added instead of touching
 * decorators across dozens of controllers.
 */
export const PERMISSIONS = {
  // Organization clients
  CLIENT_READ: 'client:read',
  CLIENT_CREATE: 'client:create',
  CLIENT_UPDATE: 'client:update',
  CLIENT_DELETE: 'client:delete',

  // Client contacts & departments
  CONTACT_MANAGE: 'contact:manage',
  DEPARTMENT_MANAGE: 'department:manage',

  // Check-in participants
  PARTICIPANT_READ: 'participant:read',
  PARTICIPANT_MANAGE: 'participant:manage',

  // Check-in cycles
  CHECKIN_READ: 'checkin:read',
  CHECKIN_MANAGE: 'checkin:manage',

  // Reports
  DASHBOARD_VIEW: 'dashboard:view',

  // Administrators (Settings screen)
  ADMIN_READ: 'admin:read',
  ADMIN_MANAGE: 'admin:manage',

  // Personal profile
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMINISTRATOR]: ALL_PERMISSIONS,
  [USER_ROLES.GUEST]: [],
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

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
