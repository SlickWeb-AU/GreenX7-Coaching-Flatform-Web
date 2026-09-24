export const LOGIN_STEPS = {
  EMAIL: 'email',
  OTP: 'otp',
} as const;

export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];

export const OTP_EXPIRY_SECONDS = 300;
export const RESEND_COOLDOWN_SECONDS = 60;

export { USER_ROLES, type UserRole } from '@/types/auth';
