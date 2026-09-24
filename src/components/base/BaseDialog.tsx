'use client';

import { useEffect, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface BaseDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BaseDialog({ title, onClose, children, className }: BaseDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-black/50 duration-200 animate-in fade-in-0"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'w-full max-w-md rounded-2xl bg-white p-6 duration-200 animate-in fade-in-0 zoom-in-95',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-20-bold text-neutral-grey-1">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-neutral-grey-3"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default BaseDialog;
