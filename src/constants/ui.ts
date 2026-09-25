import type { BaseSize, BaseVariant } from '@/types/ui';

export const BASE_BUTTON_SIZE_CLASS: Record<BaseSize, string> = {
  small: 'h-9 px-3 body-14-bold',
  medium: 'h-11 px-4 body-14-bold',
  mediumPlus: 'h-12 px-5 body-16-bold',
};

export const BASE_BUTTON_VARIANT_CLASS: Record<BaseVariant, string> = {
  primary:
    'border border-transparent bg-brand-green-2 text-white hover:bg-brand-green-2/90 shadow-none',
  secondary:
    'border border-neutral-grey-5 bg-white text-brand-green-2 hover:bg-neutral-grey-8 hover:text-brand-green-2 hover:border-neutral-grey-4 shadow-none',
  ghost:
    'border border-transparent bg-transparent text-neutral-grey-2 hover:bg-neutral-grey-7 hover:text-neutral-grey-1 shadow-none',
};
