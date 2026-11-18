import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ClientLogoDeviceSettings } from './ClientLogoDeviceSettings';
import {
  CLIENT_LOGO_HEIGHT_DEFAULTS,
  CLIENT_LOGO_HEIGHT_MAX,
  CLIENT_LOGO_HEIGHT_MIN,
} from '@/constants/clients';

describe('ClientLogoDeviceSettings', () => {
  it('switches device tabs and commits height changes for the active device', () => {
    const onChange = vi.fn();
    render(
      <ClientLogoDeviceSettings
        heights={{ desktop: 48, tablet: 40, mobile: 32 }}
        onChange={onChange}
      />,
    );

    const tabletTab = screen.getByRole('tab', { name: /Tablet/i });
    fireEvent.click(tabletTab);

    const numberInput = screen.getByLabelText('Tablet logo height in pixels') as HTMLInputElement;
    expect(numberInput.value).toBe('40');

    fireEvent.change(numberInput, { target: { value: '56' } });
    expect(onChange).toHaveBeenCalledWith({ desktop: 48, tablet: 56, mobile: 32 });
  });

  it('preserves partial input while parent re-renders with a new heights object reference', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ClientLogoDeviceSettings
        heights={{ desktop: 48, tablet: 40, mobile: 32 }}
        onChange={onChange}
      />,
    );

    const numberInput = screen.getByLabelText('Desktop logo height in pixels') as HTMLInputElement;
    // User types '3' (below MIN 24, so onChange has not fired yet)
    fireEvent.change(numberInput, { target: { value: '3' } });
    expect(numberInput.value).toBe('3');
    expect(onChange).not.toHaveBeenCalled();

    // Parent re-renders with a new object reference but same numeric values
    rerender(
      <ClientLogoDeviceSettings
        heights={{ desktop: 48, tablet: 40, mobile: 32 }}
        onChange={onChange}
      />,
    );

    expect(numberInput.value).toBe('3');
  });

  it('clamps out-of-range values on blur and resets to defaults', () => {
    const onChange = vi.fn();
    render(
      <ClientLogoDeviceSettings
        heights={{ desktop: 60, tablet: 50, mobile: 40 }}
        onChange={onChange}
      />,
    );

    const numberInput = screen.getByLabelText('Desktop logo height in pixels') as HTMLInputElement;

    fireEvent.change(numberInput, { target: { value: '10' } });
    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith({
      desktop: CLIENT_LOGO_HEIGHT_MIN,
      tablet: 50,
      mobile: 40,
    });
    expect(numberInput.value).toBe(String(CLIENT_LOGO_HEIGHT_MIN));

    fireEvent.change(numberInput, { target: { value: '200' } });
    fireEvent.blur(numberInput);
    expect(onChange).toHaveBeenCalledWith({
      desktop: CLIENT_LOGO_HEIGHT_MAX,
      tablet: 50,
      mobile: 40,
    });

    const resetBtn = screen.getByRole('button', { name: /Reset logo sizes to defaults/i });
    fireEvent.click(resetBtn);
    expect(onChange).toHaveBeenCalledWith({ ...CLIENT_LOGO_HEIGHT_DEFAULTS });
  });
});
