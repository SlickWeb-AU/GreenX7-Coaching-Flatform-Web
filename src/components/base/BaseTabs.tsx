'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BaseTabItem {
  key: string;
  label: string;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface BaseTabsProps {
  items: BaseTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function BaseTabs({ items, activeKey, onChange, className }: BaseTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn('flex items-center gap-8 border-b border-neutral-grey-5', className)}
    >
      {items.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.key)}
            className={cn(
              'body-14-bold relative flex items-center gap-2 pb-2.5 pt-1 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
              isActive
                ? 'border-b-2 border-brand-green-2 text-brand-green-2'
                : 'border-b-2 border-transparent text-neutral-grey-3 hover:text-neutral-grey-1',
            )}
          >
            <span>{tab.label}</span>
            {tab.badge && <span className="inline-flex items-center">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
