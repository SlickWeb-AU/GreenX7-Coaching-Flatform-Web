import { USER_ROLES, USER_STATUSES } from '@/types/auth';

export const LOGIN_STEPS = {
  EMAIL: 'email',
  OTP: 'otp',
} as const;

export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];

export const OTP_EXPIRY_SECONDS = 600;
export const RESEND_COOLDOWN_SECONDS = 60;

export { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from '@/types/auth';

/** Display labels for user roles; fallback to key if unmapped */
export const USER_ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMINISTRATOR]: 'Administrator',
  [USER_ROLES.GUEST]: 'Guest',
};

/** Display labels for user statuses; fallback to key if unmapped */
export const USER_STATUS_LABELS: Record<string, string> = {
  [USER_STATUSES.ACTIVE]: 'Active',
  [USER_STATUSES.INACTIVE]: 'Inactive',
  [USER_STATUSES.BANNED]: 'Banned',
};
