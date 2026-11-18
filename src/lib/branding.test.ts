import { describe, expect, it } from 'vitest';
import { CLIENT_LOGO_HEIGHT_DEFAULTS } from '@/constants/clients';
import { getResponsiveLogoHeightProps, resolveLogoHeights } from './branding';

describe('resolveLogoHeights', () => {
  it('returns null when branding is missing or has no numeric logo heights', () => {
    expect(resolveLogoHeights(null)).toBeNull();
    expect(resolveLogoHeights(undefined)).toBeNull();
    expect(resolveLogoHeights({})).toBeNull();
    expect(
      resolveLogoHeights({
        logoHeightDesktop: null,
        logoHeightTablet: Number.NaN,
        logoHeightMobile: undefined,
      }),
    ).toBeNull();
  });

  it('fills missing device heights with defaults when at least one finite height is provided', () => {
    expect(resolveLogoHeights({ logoHeightDesktop: 64 })).toEqual({
      desktop: 64,
      tablet: CLIENT_LOGO_HEIGHT_DEFAULTS.tablet,
      mobile: CLIENT_LOGO_HEIGHT_DEFAULTS.mobile,
    });
  });

  it('returns all provided device heights', () => {
    expect(
      resolveLogoHeights({
        logoHeightDesktop: 72,
        logoHeightTablet: 52,
        logoHeightMobile: 36,
      }),
    ).toEqual({
      desktop: 72,
      tablet: 52,
      mobile: 36,
    });
  });
});

describe('getResponsiveLogoHeightProps', () => {
  it('returns fallback class and undefined style when logoHeights is nullish', () => {
    expect(getResponsiveLogoHeightProps(null, 'h-15')).toEqual({
      style: undefined,
      heightClass: 'h-15',
    });
  });

  it('returns CSS custom properties and responsive Tailwind classes when logoHeights is set', () => {
    const result = getResponsiveLogoHeightProps({ desktop: 72, tablet: 52, mobile: 36 }, 'h-15');
    expect(result.style).toEqual({
      '--logo-h-mobile': '36px',
      '--logo-h-tablet': '52px',
      '--logo-h-desktop': '72px',
    });
    expect(result.heightClass).toBe(
      'h-[var(--logo-h-mobile)] md:h-[var(--logo-h-tablet)] lg:h-[var(--logo-h-desktop)]',
    );
  });
});
