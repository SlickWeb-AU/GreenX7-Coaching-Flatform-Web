'use client';

import { BaseButton } from '../BaseButton';

export function TableLoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all duration-200">
      <BaseButton
        variant="secondary"
        size="small"
        pill
        loading
        className="pointer-events-none bg-white shadow-md"
      >
        Loading...
      </BaseButton>
    </div>
  );
}
