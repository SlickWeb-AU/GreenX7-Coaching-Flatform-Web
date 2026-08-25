'use client';

import { Leaf, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import Link from 'next/link';

import { NavLink } from '@/components/layout/nav-link';
import { Button } from '@/components/ui/button';
import { ADMIN_NAVIGATION } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/auth-provider';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui.store';

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { can } = useAuth();

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {ADMIN_NAVIGATION.map((group, index) => {
        // Lọc theo quyền TRƯỚC khi render tiêu đề nhóm, tránh hiện nhóm rỗng
        const visibleItems = group.items.filter(
          (item) => !item.permissions || can(item.permissions),
        );
        if (!visibleItems.length) return null;

        return (
          <div key={group.title ?? index} className="space-y-1">
            {group.title && !collapsed && (
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.title}
              </p>
            )}
            {visibleItems.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();

  return (
    <>
      {/* Sidebar cố định — desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex',
          sidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
          <Link
            href={ROUTES.admin.dashboard}
            className={cn('flex items-center gap-2 text-white', sidebarCollapsed && 'justify-center')}
          >
            <Leaf className="h-6 w-6 shrink-0" aria-hidden />
            {!sidebarCollapsed && <span className="font-semibold">GreenX7</span>}
          </Link>
        </div>

        <SidebarBody collapsed={sidebarCollapsed} />

        <div className="border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-white"
            aria-label={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Thu gọn
              </>
            )}
          </button>
        </div>
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
          <aside className="relative flex h-full w-64 animate-slide-up flex-col bg-sidebar">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <span className="flex items-center gap-2 font-semibold text-white">
                <Leaf className="h-5 w-5" aria-hidden />
                GreenX7
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-sidebar-accent"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X />
              </Button>
            </div>
            <SidebarBody collapsed={false} onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
