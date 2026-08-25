import type { Permission } from '@/config/permissions';

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  phone: string | null;
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

/** Payload bên trong access token — middleware đọc để phân quyền ở edge */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  sid?: string;
  iat: number;
  exp: number;
}
