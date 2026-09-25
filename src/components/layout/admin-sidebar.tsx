'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BaseButton } from '@/components/base';
import { AvatarPlaceholderIcon, LogoutIcon } from '@/components/icons';
import { NavLink } from '@/components/layout/nav-link';
import { ADMIN_NAVIGATION } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { authApi } from '@/features/auth';
import { useAuth } from '@/components/providers';
import { useUiStore } from '@/stores/ui.store';

interface SidebarBodyProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarBodyProps) {
  const { user, setUser, can } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Signed out successfully');
      router.replace(ROUTES.login);
      router.refresh();
    },
    onError: () => toast.error('Sign out failed, please try again'),
  });

  return (
    <div className="flex h-full flex-col justify-between px-4 py-6">
      {/* Top section: Logo & Nav items */}
      <div className="flex flex-col">
        {/* Logo */}
        <div className="mb-12">
          <Link href={ROUTES.admin.dashboard} className="inline-block">
            <Image
              src="/icons/greenx7-logo.svg"
              alt="GreenX7"
              width={140}
              height={34}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {ADMIN_NAVIGATION.map((group, index) => {
            const visibleItems = group.items.filter(
              (item) => !item.permissions || can(item.permissions),
            );
            if (!visibleItems.length) return null;

            return (
              <div key={group.title ?? index} className="space-y-1">
                {visibleItems.map((item) => (
                  <NavLink key={item.href} item={item} onNavigate={onNavigate} />
                ))}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: User Info & Sign Out */}
      <div className="space-y-1">
        <div className="mb-4 border-t border-neutral-grey-5" />

        {/* User profile */}
        <div className="flex items-center gap-3 px-4">
          <AvatarPlaceholderIcon className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-neutral-grey-1">{user?.fullName}</p>
            <p className="truncate text-xs text-neutral-grey-3">
              {user?.role === 'ADMINISTRATOR' ? 'Administrator' : 'User'}
            </p>
          </div>
        </div>

        {/* Sign out button */}
        <BaseButton
          variant="ghost"
          size="medium"
          fullWidth
          className="justify-start gap-3"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          startIcon={<LogoutIcon className="shrink-0" />}
        >
          Sign Out
        </BaseButton>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

  return (
    <>
      {/* Sidebar cố định — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r-0.5 border-neutral-grey-5 bg-neutral-grey-7 lg:flex">
        <SidebarContent />
      </aside>

      {/* Drawer — mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Đóng menu"
          />
          <aside className="relative flex h-full w-56 animate-slide-up flex-col border-r-0.5 border-neutral-grey-5 bg-neutral-grey-7">
            <div className="absolute right-3 top-4 z-10">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-grey-2 transition-colors hover:bg-neutral-grey-6"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Đóng menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
