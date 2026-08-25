'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { hasAnyPermission, hasPermission, type Permission } from '@/config/permissions';
import { setSessionExpiredHandler } from '@/lib/axios';
import type { AuthUser, UserRole } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  /** Có ĐỦ tất cả permission truyền vào */
  can: (permission: Permission | Permission[]) => boolean;
  /** Có ÍT NHẤT MỘT permission trong danh sách */
  canAny: (permissions: Permission[]) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

/**
 * Nguồn sự thật về user cho toàn bộ cây UI.
 *
 * `initialUser` được lấy ở SERVER (root layout) rồi truyền xuống — nhờ vậy lần render
 * đầu tiên đã biết user là ai, không có khoảnh khắc nhấp nháy "chưa đăng nhập"
 * rồi mới hiện menu admin.
 */
export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = React.useState<AuthUser | null>(initialUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Server là nguồn sự thật: khi điều hướng làm layout render lại với user mới, đồng bộ theo.
  React.useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  // Khi refresh token cũng hết hạn, axios báo về đây để dọn state và đưa về màn đăng nhập
  React.useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      queryClient.clear();
      router.replace('/login?reason=session-expired');
    });
  }, [queryClient, router]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'ADMIN',
      isCustomer: user?.role === 'CUSTOMER',
      can: (permission) => hasPermission(user?.permissions, permission),
      canAny: (permissions) => hasAnyPermission(user?.permissions, permissions),
      hasRole: (roles) => {
        if (!user) return false;
        return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
      },
      setUser,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  }
  return context;
}
