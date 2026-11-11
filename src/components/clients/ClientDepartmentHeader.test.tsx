import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('defaults to horizontal logo height (h-12)', () => {
    render(<ClientDepartmentHeader clientLogoUrl="https://example.com/logo.png" />);
    const img = screen.getByRole('img');
    expect(img.className).toContain('h-12');
    expect(img.parentElement?.className).toContain('h-12');
  });

  it('adjusts height to h-18 (72px) when a vertical logo is loaded', () => {
    render(<ClientDepartmentHeader clientLogoUrl="https://example.com/logo.png" />);
    const img = screen.getByRole('img') as HTMLImageElement;

    // Simulate vertical image load (height > width)
    Object.defineProperty(img, 'naturalWidth', { value: 100, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 200, configurable: true });
    fireEvent.load(img);

    expect(img.className).toContain('h-18');
    expect(img.parentElement?.className).toContain('h-18');
  });

  it('keeps height at h-12 when a horizontal logo is loaded', () => {
    render(<ClientDepartmentHeader clientLogoUrl="https://example.com/logo.png" />);
    const img = screen.getByRole('img') as HTMLImageElement;

    // Simulate horizontal image load (width > height)
    Object.defineProperty(img, 'naturalWidth', { value: 300, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true });
    fireEvent.load(img);

    expect(img.className).toContain('h-12');
    expect(img.parentElement?.className).toContain('h-12');
  });

  it('supports custom normalHeight and verticalHeight props (e.g. h-8 md:h-10 to h-12 md:h-14)', () => {
    render(
      <ClientDepartmentHeader
        clientLogoUrl="https://example.com/logo.png"
        normalHeight="h-8 md:h-10"
        verticalHeight="h-12 md:h-14"
      />,
    );
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.className).toContain('h-8 md:h-10');

    // Simulate vertical image load (height > width)
    Object.defineProperty(img, 'naturalWidth', { value: 100, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 200, configurable: true });
    fireEvent.load(img);

    expect(img.className).toContain('h-12 md:h-14');
    expect(img.parentElement?.className).toContain('h-12 md:h-14');
  });
});
