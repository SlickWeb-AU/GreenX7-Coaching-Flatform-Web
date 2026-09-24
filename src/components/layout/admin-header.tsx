'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';

import { useUiStore } from '@/stores/ui.store';

export function AdminHeader() {
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-grey-6 bg-white px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Mở menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-grey-2 transition-colors hover:bg-neutral-grey-7 hover:text-neutral-grey-1"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image
          src="/icons/greenx7-logo.svg"
          alt="GreenX7"
          width={110}
          height={28}
          className="h-6 w-auto"
          priority
        />
      </div>
    </header>
  );
}
