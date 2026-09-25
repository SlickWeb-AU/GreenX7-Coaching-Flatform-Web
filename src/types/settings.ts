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
  email: string;
  role?: string;
  status?: string;
}
