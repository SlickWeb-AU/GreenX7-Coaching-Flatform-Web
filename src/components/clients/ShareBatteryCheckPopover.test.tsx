import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareBatteryCheckPopover } from './ShareBatteryCheckPopover';

describe('ShareBatteryCheckPopover', () => {
  const mockShareLinks = {
    batteryCheckUrl: 'https://example.com/check',
    liveDashboardUrl: 'https://example.com/live',
    presentationUrl: 'https://example.com/pres',
    qrCodeDataUri:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };

  it('renders trigger button and opens popover', () => {
    render(<ShareBatteryCheckPopover departmentName="Engineering" shareLinks={mockShareLinks} />);

    const triggerButton = screen.getByRole('button', { name: /share battery check/i });
    expect(triggerButton).toBeDefined();

    fireEvent.click(triggerButton);
    expect(screen.getByText('Share Engineering Battery Check')).toBeDefined();
    expect(screen.getByRole('button', { name: /preview qr/i })).toBeDefined();
  });

  it('opens QR modal and displays download button', async () => {
    render(<ShareBatteryCheckPopover departmentName="Engineering" shareLinks={mockShareLinks} />);

    // Open popover
    fireEvent.click(screen.getByRole('button', { name: /share battery check/i }));

    // Click Preview QR
    fireEvent.click(screen.getByRole('button', { name: /preview qr/i }));

    // QR modal elements
    expect(screen.getByText('Engineering QR Code')).toBeDefined();
    expect(
      screen.getByText('Scan this QR code with any camera to open the Battery Check.'),
    ).toBeDefined();

    const downloadButton = screen.getByRole('button', { name: /download qr code/i });
    expect(downloadButton).toBeDefined();

    // Mock click download button
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(appendSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });
    appendSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('normalizes department name with accents for downloaded filename', async () => {
    render(
      <ShareBatteryCheckPopover departmentName="Phòng Kỹ Thuật" shareLinks={mockShareLinks} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /share battery check/i }));
    fireEvent.click(screen.getByRole('button', { name: /preview qr/i }));

    let downloadedFilename = '';
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLAnchorElement) {
        downloadedFilename = node.download;
      }
      return node;
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: /download qr code/i }));

    await waitFor(() => {
      expect(downloadedFilename).toBe('phong-ky-thuat-qr-code.png');
    });

    appendSpy.mockRestore();
    clickSpy.mockRestore();
  });
});
