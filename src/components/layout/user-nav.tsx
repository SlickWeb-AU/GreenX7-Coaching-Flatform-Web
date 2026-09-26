'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { BaseLink } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { authApi } from '@/features/auth';
import { toApiError } from '@/lib/api-error';
import { useAuth } from '@/components/providers';
import { getInitials } from '@/lib/utils';

export function UserNav() {
  const { user, isAdmin, setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Signed out successfully');
      router.replace(ROUTES.login);
      router.refresh();
    },
    onError: (err) => toast.error(toApiError(err).message),
  });

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <BaseLink href={ROUTES.login}>Sign in</BaseLink>
      </div>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-green-2 focus-visible:ring-offset-2"
        aria-label="User account menu"
        aria-expanded={isOpen}
      >
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-grey-7 text-xs font-bold text-neutral-grey-1">
          {getInitials(displayName)}
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 animate-fade-in overflow-hidden rounded-xl border border-neutral-grey-5 bg-white p-1 text-neutral-grey-1 shadow-lg shadow-black/5"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-neutral-grey-1">{displayName}</p>
            <p className="truncate text-xs text-neutral-grey-3">{user.email}</p>
          </div>
          <div className="-mx-1 my-1 h-px bg-neutral-grey-6" />

          {isAdmin && (
            <Link
              href={ROUTES.admin.dashboard}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-grey-1 transition-colors hover:bg-neutral-grey-7"
              role="menuitem"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-neutral-grey-3" />
              <span>Admin panel</span>
            </Link>
          )}

          <div className="-mx-1 my-1 h-px bg-neutral-grey-6" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout.mutate();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-red-4 transition-colors hover:bg-secondary-red-2"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 shrink-0 text-secondary-red-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
