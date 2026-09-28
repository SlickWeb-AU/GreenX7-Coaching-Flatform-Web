import type { Permission } from '@/config/permissions';

export const USER_ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  GUEST: 'GUEST',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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

export interface RequestCodeResponse {
  expiresIn?: number;
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
