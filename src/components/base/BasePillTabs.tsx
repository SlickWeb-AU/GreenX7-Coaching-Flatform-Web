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
        'inline-flex items-center gap-1.5 rounded-xl bg-neutral-grey-6 p-1.25',
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
              'inline-flex h-8 select-none items-center justify-center rounded-lg px-3 outline-none transition-all focus-visible:ring-1 focus-visible:ring-brand-green-2 disabled:cursor-not-allowed disabled:opacity-40',
              isActive
                ? 'body-14-bold bg-neutral-white-solid text-brand-green-2 shadow-pill-tab'
                : 'body-14-medium text-neutral-grey-2 hover:text-neutral-grey-1',
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 text-xs',
                  isActive
                    ? 'body-12-bold text-brand-green-2/80'
                    : 'body-12-medium text-neutral-grey-3',
                )}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default BasePillTabs;
