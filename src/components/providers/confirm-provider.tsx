'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

import { BaseButton, BaseDialog } from '@/components/base';
import { cn } from '@/lib/utils';

export interface ConfirmOptions {
  title?: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}

type ConfirmFunction = (options: ConfirmOptions) => Promise<boolean>;

interface ConfirmContextValue {
  showConfirm: ConfirmFunction;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
  }>({
    isOpen: false,
    options: {},
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirm = useCallback<ConfirmFunction>((options) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        isOpen: true,
        options,
      });
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  const {
    title = 'Confirm',
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    variant = 'primary',
  } = dialogState.options;

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {dialogState.isOpen && (
        <BaseDialog title={title} onClose={() => handleClose(false)}>
          {message && <div className="body-14-medium mb-6 text-neutral-grey-2">{message}</div>}
          <div className="flex items-center justify-end gap-3">
            <BaseButton variant="secondary" size="medium" pill onClick={() => handleClose(false)}>
              {cancelText}
            </BaseButton>
            <BaseButton
              variant="primary"
              size="medium"
              pill
              className={cn(
                variant === 'danger' &&
                  'bg-secondary-red-4 hover:bg-secondary-red-4/90 focus-visible:ring-secondary-red-4',
              )}
              onClick={() => handleClose(true)}
            >
              {confirmText}
            </BaseButton>
          </div>
        </BaseDialog>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
