'use client';

import { Copy, ExternalLink, QrCode, Share2, X } from 'lucide-react';
import { toast } from 'sonner';

import { BaseButton, BaseIconButton, BasePopover } from '@/components/base';

export interface ShareBatteryCheckPopoverProps {
  departmentName: string;
  shareUrl?: string;
  liveUrl?: string;
  presentationUrl?: string;
  className?: string;
}

export function ShareBatteryCheckPopover({
  departmentName,
  shareUrl = 'battery.greenx7.com/mirvac/construction',
  liveUrl,
  presentationUrl,
  className,
}: ShareBatteryCheckPopoverProps) {
  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    }
  };

  const handleOpenLive = () => {
    if (liveUrl) {
      window.open(liveUrl, '_blank');
    } else {
      toast.info('Live dashboard link not configured');
    }
  };

  const handlePreviewQR = () => {
    toast.info('QR Code preview will be available soon');
  };

  return (
    <BasePopover
      align="end"
      className="w-[520px] max-w-[90vw] p-6 shadow-2xl"
      trigger={
        <BaseButton
          variant="primary"
          size="medium"
          pill
          startIcon={<Share2 size={16} />}
          className={className}
        >
          Share Battery Check
        </BaseButton>
      }
    >
      {({ close }) => (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="heading-18-bold text-neutral-grey-1">
                Share {departmentName} Battery Check
              </h3>
              <p className="body-14-medium text-neutral-grey-3">
                Links are public for this department only.
              </p>
            </div>
            <BaseIconButton
              size={24}
              icon={<X size={18} aria-hidden="true" />}
              aria-label="Close"
              onClick={close}
              className="text-neutral-grey-3 hover:text-neutral-grey-1"
            />
          </div>

          {/* 2x2 Grid with Dividers */}
          <div className="divide-y divide-neutral-grey-6 overflow-hidden rounded-xl border border-neutral-grey-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 divide-y divide-neutral-grey-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {/* Battery Check link */}
              <div className="flex flex-col items-start gap-2 p-4">
                <span className="body-14-bold text-brand-green-2">Battery Check link</span>
                <span
                  className="body-12-medium max-w-full truncate text-neutral-grey-3"
                  title={shareUrl}
                >
                  {shareUrl}
                </span>
                <BaseButton
                  variant="secondary"
                  size="small"
                  pill
                  startIcon={<Copy size={14} />}
                  onClick={() => handleCopy(shareUrl, 'Battery Check link')}
                  className="mt-1"
                >
                  Copy link
                </BaseButton>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-start gap-2 p-4">
                <span className="body-14-bold text-brand-green-2">QR code</span>
                <span className="body-12-medium text-neutral-grey-3">
                  Ready for posters, slides and email.
                </span>
                <BaseButton
                  variant="secondary"
                  size="small"
                  pill
                  startIcon={<QrCode size={14} />}
                  onClick={handlePreviewQR}
                  className="mt-1"
                >
                  Preview QR
                </BaseButton>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 divide-y divide-neutral-grey-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              {/* Live dashboard */}
              <div className="flex flex-col items-start gap-2 p-4">
                <span className="body-14-bold text-brand-green-2">Live dashboard</span>
                <span className="body-12-medium text-neutral-grey-3">
                  Presentation-ready and free of admin controls.
                </span>
                <BaseButton
                  variant="secondary"
                  size="small"
                  pill
                  startIcon={<ExternalLink size={14} />}
                  onClick={handleOpenLive}
                  className="mt-1"
                >
                  Open live view
                </BaseButton>
              </div>

              {/* Presentation link */}
              <div className="flex flex-col items-start gap-2 p-4">
                <span className="body-14-bold text-brand-green-2">Presentation link</span>
                <span className="body-12-medium text-neutral-grey-3">
                  Fixed coaching deck with live results.
                </span>
                <BaseButton
                  variant="secondary"
                  size="small"
                  pill
                  startIcon={<Copy size={14} />}
                  onClick={() => handleCopy(presentationUrl || shareUrl, 'Presentation link')}
                  className="mt-1"
                >
                  Copy link
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </BasePopover>
  );
}

export default ShareBatteryCheckPopover;
