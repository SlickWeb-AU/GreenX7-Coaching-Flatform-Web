'use client';

import { Monitor, RotateCcw, Smartphone, Tablet } from 'lucide-react';
import { CLIENT_LOGO_HEIGHT_MAX, CLIENT_LOGO_HEIGHT_MIN } from '@/constants/clients';
import { useClientLogoDeviceSettings, type LogoDeviceKey } from '@/features/admin-clients';
import { useResolvedLogoUrl } from '@/hooks/useResolvedLogoUrl';
import { cn } from '@/lib/utils';
import type { ClientLogoHeights } from '@/types';
import { LogoPreviewBox } from './LogoPreviewBox';

const DEVICE_CONFIG: Record<LogoDeviceKey, { label: string; icon: typeof Monitor }> = {
  desktop: { label: 'Desktop', icon: Monitor },
  tablet: { label: 'Tablet', icon: Tablet },
  mobile: { label: 'Mobile', icon: Smartphone },
};

const DEVICE_ORDER: LogoDeviceKey[] = ['desktop', 'tablet', 'mobile'];

export interface ClientLogoDeviceSettingsProps {
  darkLogoFile?: File | null;
  whiteLogoFile?: File | null;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
  heights?: ClientLogoHeights;
  onChange?: (heights: ClientLogoHeights) => void;
}

/**
 * Compact per-device (desktop, tablet, mobile) logo height toolbar with dual-background preview.
 */
export function ClientLogoDeviceSettings({
  darkLogoFile,
  whiteLogoFile,
  darkLogoUrl,
  whiteLogoUrl,
  heights: controlledHeights,
  onChange,
}: ClientLogoDeviceSettingsProps) {
  const {
    activeDevice,
    heights,
    currentHeight,
    inputValue,
    selectDevice,
    setDeviceHeight,
    handleNumberChange,
    handleNumberBlur,
    handleReset,
  } = useClientLogoDeviceSettings({ heights: controlledHeights, onChange });

  const resolvedDarkUrl = useResolvedLogoUrl(darkLogoFile, darkLogoUrl);
  const resolvedWhiteUrl = useResolvedLogoUrl(whiteLogoFile, whiteLogoUrl);
  const currentConfig = DEVICE_CONFIG[activeDevice];

  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-neutral-grey-6 pt-5">
      {/* Single toolbar row: device tabs on the left, slider + px input flush right */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Preview device"
          className="inline-flex items-center gap-1 rounded-xl bg-neutral-grey-6 p-1"
        >
          {DEVICE_ORDER.map((key) => {
            const { label, icon: Icon } = DEVICE_CONFIG[key];
            const isActive = key === activeDevice;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectDevice(key)}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 transition-all',
                  isActive
                    ? 'body-14-bold bg-white text-brand-green-2 shadow-pill-tab'
                    : 'body-14-medium text-neutral-grey-3 hover:text-neutral-grey-1',
                )}
              >
                <Icon size={15} aria-hidden />
                <span>{label}</span>
                <span className="body-12-medium tabular-nums opacity-75">{heights[key]}px</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={CLIENT_LOGO_HEIGHT_MIN}
            max={CLIENT_LOGO_HEIGHT_MAX}
            step={1}
            value={currentHeight}
            onChange={(e) => setDeviceHeight(Number(e.target.value))}
            aria-label={`${currentConfig.label} logo height slider`}
            className="h-2 w-52 cursor-pointer accent-brand-green-2 sm:w-64 md:w-72"
          />
          <div className="flex h-9 w-20 shrink-0 items-center rounded-lg border border-neutral-grey-6 bg-white px-2 focus-within:border-brand-green-2">
            <input
              type="number"
              min={CLIENT_LOGO_HEIGHT_MIN}
              max={CLIENT_LOGO_HEIGHT_MAX}
              value={inputValue}
              onChange={(e) => handleNumberChange(e.target.value)}
              onBlur={handleNumberBlur}
              aria-label={`${currentConfig.label} logo height in pixels`}
              className="body-14-medium w-full bg-transparent text-right tabular-nums text-neutral-grey-1 outline-none"
            />
            <span className="body-12-medium ml-1 text-neutral-grey-3">px</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            title="Reset defaults"
            aria-label="Reset logo sizes to defaults"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-grey-3 transition-colors hover:bg-neutral-grey-7 hover:text-neutral-grey-1"
          >
            <RotateCcw size={16} aria-hidden />
          </button>
        </div>
      </div>

      {/* Centered dual-background preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LogoPreviewBox
          surface="light"
          alt="Dark logo preview"
          logoUrl={resolvedDarkUrl}
          height={currentHeight}
        />
        <LogoPreviewBox
          surface="dark"
          alt="White logo preview"
          logoUrl={resolvedWhiteUrl}
          height={currentHeight}
        />
      </div>
    </div>
  );
}
