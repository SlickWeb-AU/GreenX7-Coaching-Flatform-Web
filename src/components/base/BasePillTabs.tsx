'use client';

import { cn } from '@/lib/utils';

export interface BasePillTabItem {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface BasePillTabsProps {
  items: BasePillTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function BasePillTabs({ items, activeKey, onChange, className }: BasePillTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Pill Tabs"
      className={cn(
        'inline-flex items-center gap-1 rounded-2xl bg-neutral-grey-7 p-1.5',
        className,
      )}
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
              'body-14-medium rounded-xl px-4 py-1.5 transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-40',
              isActive
                ? 'bg-white font-bold text-brand-green-2 shadow-sm'
                : 'text-neutral-grey-2 hover:text-neutral-grey-1',
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-neutral-grey-3">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default BasePillTabs;
