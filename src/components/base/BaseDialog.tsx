'use client';

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BaseIconButton } from './BaseIconButton';

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
      className="fixed inset-0 z-50 m-0 flex animate-fade-in items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'w-full max-w-md animate-dialog-in rounded-2xl bg-white p-6 shadow-xl',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-20-bold text-neutral-grey-1">{title}</h2>
          <BaseIconButton
            size={28}
            icon={<X size={18} aria-hidden="true" />}
            aria-label="Close"
            onClick={onClose}
            className="text-neutral-grey-3 hover:text-neutral-grey-1"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export default BaseDialog;
