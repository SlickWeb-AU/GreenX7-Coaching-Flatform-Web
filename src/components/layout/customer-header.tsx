'use client';

import { Leaf, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { NavLink } from '@/components/layout/nav-link';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import { CUSTOMER_NAVIGATION } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth/auth-provider';

export function CustomerHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { can } = useAuth();

  const items = CUSTOMER_NAVIGATION.filter((item) => !item.permissions || can(item.permissions));

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center gap-4">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-semibold text-primary">
          <Leaf className="h-6 w-6" aria-hidden />
          GreenX7
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {items.map((item) => (
            <NavLink key={item.href} item={item} variant="header" />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <UserNav />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Mở menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="container flex flex-col gap-1 border-t py-3 md:hidden">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              variant="header"
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      )}
    </header>
  );
}
