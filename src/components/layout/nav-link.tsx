'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BaseButton } from '@/components/base';
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
      <Link href={item.href} onClick={onNavigate} className="inline-block">
        <BaseButton variant={isActive ? 'primary' : 'ghost'}>{item.label}</BaseButton>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className="block w-full"
    >
      <BaseButton
        variant={isActive ? 'primary' : 'ghost'}
        fullWidth
        className={cn(
          'justify-start',
          isActive ? 'body-14-bold' : 'body-14-medium',
          collapsed && 'justify-center px-0',
        )}
        startIcon={<Icon size={20} className="shrink-0" aria-hidden />}
      >
        {!collapsed && <span className="truncate">{item.label}</span>}
      </BaseButton>
    </Link>
  );
}
