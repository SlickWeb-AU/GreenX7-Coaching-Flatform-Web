import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClientBrandingProvider } from '@/components/providers';
import { ClientDepartmentHeader } from './ClientDepartmentHeader';

describe('ClientDepartmentHeader', () => {
  it('returns null if no logo, clientName or departmentName is provided', () => {
    const { container } = render(<ClientDepartmentHeader />);
    expect(container.firstChild).toBeNull();
  });

  it('renders clientName and departmentName when no logo is provided', () => {
    render(<ClientDepartmentHeader clientName="Acme Corp" departmentName="Engineering" />);
    expect(screen.getByText('Acme Corp')).toBeDefined();
    expect(screen.getByText('Engineering')).toBeDefined();
  });

  it('defaults to h-15 when logoHeights is not provided', () => {
    render(<ClientDepartmentHeader clientLogoUrl="https://example.com/logo.png" />);
    const img = screen.getByRole('img');
    expect(img.className).toContain('h-15');
    expect(img.parentElement?.className).toContain('h-15');
  });

  it('applies responsive CSS variables when logoHeights is provided', () => {
    render(
      <ClientDepartmentHeader
        clientLogoUrl="https://example.com/logo.png"
        logoHeights={{ desktop: 72, tablet: 52, mobile: 36 }}
      />,
    );
    const img = screen.getByRole('img');
    const wrapper = img.parentElement as HTMLElement;
    expect(wrapper.style.getPropertyValue('--logo-h-desktop')).toBe('72px');
    expect(wrapper.style.getPropertyValue('--logo-h-tablet')).toBe('52px');
    expect(wrapper.style.getPropertyValue('--logo-h-mobile')).toBe('36px');
    expect(img.className).toContain('h-[var(--logo-h-mobile)]');
    expect(img.className).toContain('md:h-[var(--logo-h-tablet)]');
    expect(img.className).toContain('lg:h-[calc(var(--logo-h-desktop)/var(--deck-scale,1))]');
  });

  it('reads branding, surface logo, and logoHeights from ClientBrandingProvider', () => {
    render(
      <ClientBrandingProvider
        branding={{
          clientName: 'Acme Corp',
          departmentName: 'Sales',
          isCompanyWide: false,
          darkLogoUrl: 'https://example.com/dark.png',
          whiteLogoUrl: 'https://example.com/white.png',
          logoHeightDesktop: 64,
          logoHeightTablet: 48,
          logoHeightMobile: 32,
        }}
      >
        <ClientDepartmentHeader surface="light" />
      </ClientBrandingProvider>,
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://example.com/dark.png');
    expect(screen.getByText('Sales')).toBeDefined();
    expect(img.parentElement?.style.getPropertyValue('--logo-h-desktop')).toBe('64px');
  });
});
