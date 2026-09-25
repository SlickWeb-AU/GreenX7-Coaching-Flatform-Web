export type BaseVariant = 'primary' | 'secondary' | 'ghost';

export type BaseSize = 'small' | 'medium' | 'mediumPlus';

export type PageItem = number | '…';

export interface BaseButtonStyleOptions {
  variant?: BaseVariant;
  size?: BaseSize;
  pill?: boolean;
  fullWidth?: boolean;
  className?: string;
}
