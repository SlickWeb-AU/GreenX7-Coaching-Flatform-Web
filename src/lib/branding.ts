import type { CSSProperties } from 'react';
import { CLIENT_LOGO_HEIGHT_DEFAULTS } from '@/constants/clients';
import type { ClientLogoHeights } from '@/types';

/** Resolve per-device logo heights (px) from API branding, or null when not provided. */
export function resolveLogoHeights(
  branding?: {
    logoHeightDesktop?: number | null;
    logoHeightTablet?: number | null;
    logoHeightMobile?: number | null;
  } | null,
): ClientLogoHeights | null {
  if (!branding) return null;
  const { logoHeightDesktop, logoHeightTablet, logoHeightMobile } = branding;
  if (
    !Number.isFinite(logoHeightDesktop) &&
    !Number.isFinite(logoHeightTablet) &&
    !Number.isFinite(logoHeightMobile)
  ) {
    return null;
  }
  return {
    desktop: Number.isFinite(logoHeightDesktop)
      ? (logoHeightDesktop as number)
      : CLIENT_LOGO_HEIGHT_DEFAULTS.desktop,
    tablet: Number.isFinite(logoHeightTablet)
      ? (logoHeightTablet as number)
      : CLIENT_LOGO_HEIGHT_DEFAULTS.tablet,
    mobile: Number.isFinite(logoHeightMobile)
      ? (logoHeightMobile as number)
      : CLIENT_LOGO_HEIGHT_DEFAULTS.mobile,
  };
}

/** Build responsive CSS-variable height style and className from per-device logo heights. */
export function getResponsiveLogoHeightProps(
  logoHeights: ClientLogoHeights | null | undefined,
  fallbackHeightClass: string,
): { style: CSSProperties | undefined; heightClass: string } {
  if (!logoHeights) {
    return { style: undefined, heightClass: fallbackHeightClass };
  }
  return {
    style: {
      '--logo-h-mobile': `${logoHeights.mobile}px`,
      '--logo-h-tablet': `${logoHeights.tablet}px`,
      '--logo-h-desktop': `${logoHeights.desktop}px`,
    } as CSSProperties,
    heightClass:
      'h-[var(--logo-h-mobile)] md:h-[var(--logo-h-tablet)] lg:h-[calc(var(--logo-h-desktop)/var(--deck-scale,1))]',
  };
}
