export type BaseVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'custom';

export type BaseSize = 'small' | 'medium' | 'mediumPlus' | 'large' | 'xlarge';

export type PageItem = number | '…';

export interface BaseButtonStyleOptions {
  variant?: BaseVariant;
  size?: BaseSize;
  pill?: boolean;
  fullWidth?: boolean;
  className?: string;
}
