import type { Permission } from '@/config/permissions';

export const USER_ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  GUEST: 'GUEST',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  permissions: Permission[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}

/** Access-token payload — middleware reads it for edge authorization */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  sid?: string;
  iat: number;
  exp: number;
}
