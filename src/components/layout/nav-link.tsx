'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

export function useIsActive(item: Pick<NavItem, 'href' | 'exact'>): boolean {
  const pathname = usePathname();
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

interface NavLinkProps {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
  variant?: 'sidebar' | 'header';
}

export function NavLink({ item, collapsed, onNavigate, variant = 'sidebar' }: NavLinkProps) {
  const isActive = useIsActive(item);
  const Icon = item.icon;

  if (variant === 'header') {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-accent text-white'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white',
        collapsed && 'justify-center px-2',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
