import type { UserStatus } from './auth';

export interface Industry {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  clientCount: number;
}

export interface AdminUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  status?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface InviteAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface UpdateAdminUserPayload {
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
}
