'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface BasePopoverProps {
  trigger:
    ReactNode | ((props: { isOpen: boolean; toggle: () => void; close: () => void }) => ReactNode);
  children: ReactNode | ((props: { close: () => void }) => ReactNode);
  align?: 'start' | 'end' | 'center';
  placement?: 'bottom' | 'top';
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BasePopover({
  trigger,
  children,
  align = 'end',
  placement = 'bottom',
  className,
  isOpen: controlledOpen,
  onOpenChange,
}: BasePopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const containerRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const toggle = () => setOpen(!isOpen);
  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
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
  }, [isOpen, close]);

  const alignClass = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }[align];

  const placementClass = {
    bottom: 'top-full mt-2',
    top: 'bottom-full mb-2',
  }[placement];

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={toggle} className="inline-flex">
        {typeof trigger === 'function' ? trigger({ isOpen, toggle, close }) : trigger}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          className={cn(
            'absolute z-50 rounded-2xl border border-neutral-grey-6 bg-white p-6 shadow-xl',
            'duration-150 animate-in fade-in-0 zoom-in-95',
            alignClass,
            placementClass,
            className,
          )}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}

export default BasePopover;
