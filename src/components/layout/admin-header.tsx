'use client';

import { Menu } from 'lucide-react';

import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/auth-provider';
import { useUiStore } from '@/stores/ui.store';

export function AdminHeader() {
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Mở menu"
      >
        <Menu />
      </Button>

      <div className="flex-1" />

      {user && <Badge variant="secondary">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</Badge>}
      <UserNav />
    </header>
  );
}
