'use client';

import { useState } from 'react';
import { Copy, ExternalLink, QrCode, Share2, X } from 'lucide-react';
import { toast } from 'sonner';

import { BaseButton, BaseDialog, BaseIconButton, BasePopover } from '@/components/base';
import { normalizeUrl } from '@/lib/utils';
import type { DepartmentShareLinksDto } from '@/types';

export interface ShareBatteryCheckPopoverProps {
  departmentName: string;
  label?: string;
  shareLinks?: DepartmentShareLinksDto;
  isLoading?: boolean;
  className?: string;
}

export function ShareBatteryCheckPopover({
  departmentName,
  label = 'Share Battery Check',
  shareLinks,
  isLoading = false,
  className,
}: ShareBatteryCheckPopoverProps) {
  const [showQrModal, setShowQrModal] = useState(false);

  const batteryCheckUrl = shareLinks?.batteryCheckUrl || '';
  const liveDashboardUrl = shareLinks?.liveDashboardUrl || '';
  const presentationUrl = shareLinks?.presentationUrl || '';
  const qrCode = shareLinks?.qrCodeDataUri || shareLinks?.qrCode;

  const handleCopy = async (rawUrl: string | undefined, copyLabel: string) => {
    if (!rawUrl) {
      toast.error(`No link available for ${copyLabel}`);
      return;
    }
    const urlToCopy = normalizeUrl(rawUrl);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(urlToCopy);
        toast.success(`${copyLabel} copied to clipboard`);
        return;
      }
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = urlToCopy;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        toast.success(`${copyLabel} copied to clipboard`);
      } else {
        toast.error(`Failed to copy ${copyLabel}`);
      }
    } catch {
      toast.error(`Failed to copy ${copyLabel}`);
    }
  };

  return (
    <>
      <BasePopover
        align="end"
        className="w-[640px] max-w-[90vw] p-6 shadow-2xl"
        trigger={
          <BaseButton
            variant="primary"
            size="medium"
            pill
            startIcon={<Share2 size={16} />}
            loading={isLoading}
            className={className}
          >
            {label}
          </BaseButton>
        }
      >
        {({ close }) => (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="body-16-bold text-neutral-grey-1">
                  Share {departmentName} Battery Check
                </h3>
                <p className="body-14-medium text-neutral-grey-2">
                  Links are public for this department only.
                </p>
              </div>
              <BaseIconButton
                size={32}
                icon={<X size={20} aria-hidden="true" />}
                aria-label="Close"
                onClick={close}
                className="text-neutral-grey-3 hover:text-neutral-grey-1"
              />
            </div>

            <div className="divide-y divide-neutral-grey-6 overflow-hidden rounded-xl border border-neutral-grey-6">
              <div className="grid grid-cols-2 divide-x divide-neutral-grey-6">
                <div className="flex flex-col items-start p-4">
                  <span className="body-14-bold text-brand-green-2">Battery Check link</span>
                  <span
                    className="body-12-medium mt-0.5 max-w-full truncate text-neutral-grey-3"
                    title={batteryCheckUrl || (isLoading ? 'Loading...' : 'Not available')}
                  >
                    {batteryCheckUrl || (isLoading ? 'Loading...' : 'Not available')}
                  </span>
                  <BaseButton
                    variant="secondary"
                    size="small"
                    pill
                    disabled={!batteryCheckUrl}
                    startIcon={<Copy size={16} />}
                    onClick={() => handleCopy(batteryCheckUrl, 'Battery Check link')}
                    className="mt-5"
                  >
                    Copy link
                  </BaseButton>
                </div>

                <div className="flex flex-col items-start p-4">
                  <span className="body-14-bold text-brand-green-2">QR code</span>
                  <span className="body-12-medium mt-0.5 text-neutral-grey-3">
                    Ready for posters, slides and email.
                  </span>
                  <BaseButton
                    variant="secondary"
                    size="small"
                    pill
                    disabled={!qrCode}
                    startIcon={<QrCode size={16} />}
                    onClick={() => qrCode && setShowQrModal(true)}
                    className="mt-5"
                  >
                    Preview QR
                  </BaseButton>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-neutral-grey-6">
                <div className="flex flex-col items-start p-4">
                  <span className="body-14-bold text-brand-green-2">Live dashboard</span>
                  <span className="body-12-medium mt-0.5 text-neutral-grey-3">
                    Presentation-ready and free of admin controls.
                  </span>
                  <BaseButton
                    variant="secondary"
                    size="small"
                    pill
                    disabled={!liveDashboardUrl}
                    startIcon={<ExternalLink size={16} />}
                    onClick={() =>
                      window.open(normalizeUrl(liveDashboardUrl), '_blank', 'noopener,noreferrer')
                    }
                    className="mt-5"
                  >
                    Open live view
                  </BaseButton>
                </div>

                <div className="flex flex-col items-start p-4">
                  <span className="body-14-bold text-brand-green-2">Presentation link</span>
                  <span className="body-12-medium mt-0.5 text-neutral-grey-3">
                    Fixed coaching deck with live results.
                  </span>
                  <BaseButton
                    variant="secondary"
                    size="small"
                    pill
                    disabled={!presentationUrl}
                    startIcon={<Copy size={16} />}
                    onClick={() => handleCopy(presentationUrl, 'Presentation link')}
                    className="mt-5"
                  >
                    Copy link
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </BasePopover>

      {showQrModal && (
        <BaseDialog
          title={`${departmentName} QR Code`}
          onClose={() => setShowQrModal(false)}
          className="max-w-sm text-center"
        >
          <div className="flex flex-col items-center justify-center p-4">
            {qrCode && (
              // QR data URI bypasses next/image optimizer
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCode}
                alt={`${departmentName} QR code`}
                className="h-64 w-64 rounded-lg border border-neutral-grey-6 object-contain p-2"
              />
            )}
            <p className="body-14-medium mt-4 text-neutral-grey-2">
              Scan this QR code with any camera to open the Battery Check.
            </p>
          </div>
        </BaseDialog>
      )}
    </>
  );
}

export default ShareBatteryCheckPopover;
