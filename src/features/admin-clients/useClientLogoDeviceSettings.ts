'use client';

import { useEffect, useState } from 'react';
import {
  CLIENT_LOGO_HEIGHT_DEFAULTS,
  CLIENT_LOGO_HEIGHT_MAX,
  CLIENT_LOGO_HEIGHT_MIN,
} from '@/constants/clients';
import type { ClientLogoHeights } from '@/types';

export type LogoDeviceKey = keyof ClientLogoHeights;

function getDefaultHeights(): ClientLogoHeights {
  return {
    desktop: CLIENT_LOGO_HEIGHT_DEFAULTS.desktop,
    tablet: CLIENT_LOGO_HEIGHT_DEFAULTS.tablet,
    mobile: CLIENT_LOGO_HEIGHT_DEFAULTS.mobile,
  };
}

function clampHeight(value: number): number {
  return Math.min(CLIENT_LOGO_HEIGHT_MAX, Math.max(CLIENT_LOGO_HEIGHT_MIN, Math.round(value)));
}

export interface UseClientLogoDeviceSettingsOptions {
  heights?: ClientLogoHeights;
  onChange?: (heights: ClientLogoHeights) => void;
}

/** Manage active device tab, height clamping, text input state, and reset for logo size settings. */
export function useClientLogoDeviceSettings({
  heights: controlledHeights,
  onChange,
}: UseClientLogoDeviceSettingsOptions) {
  const [activeDevice, setActiveDevice] = useState<LogoDeviceKey>('desktop');
  const [internalHeights, setInternalHeights] = useState<ClientLogoHeights>(getDefaultHeights);
  const heights = controlledHeights ?? internalHeights;

  const currentHeight = heights[activeDevice];
  const [inputValue, setInputValue] = useState<string>(String(heights.desktop));

  useEffect(() => {
    setInputValue(String(currentHeight));
  }, [activeDevice, currentHeight]);

  const commitHeights = (next: ClientLogoHeights) => {
    if (!controlledHeights) {
      setInternalHeights(next);
    }
    onChange?.(next);
  };

  const selectDevice = (device: LogoDeviceKey) => {
    setActiveDevice(device);
    setInputValue(String(heights[device]));
  };

  const setDeviceHeight = (value: number) => {
    const clamped = clampHeight(value);
    commitHeights({ ...heights, [activeDevice]: clamped });
    setInputValue(String(clamped));
  };

  const handleNumberChange = (raw: string) => {
    setInputValue(raw);
    const parsed = Number(raw);
    if (
      raw.trim() !== '' &&
      Number.isFinite(parsed) &&
      parsed >= CLIENT_LOGO_HEIGHT_MIN &&
      parsed <= CLIENT_LOGO_HEIGHT_MAX
    ) {
      commitHeights({ ...heights, [activeDevice]: Math.round(parsed) });
    }
  };

  const handleNumberBlur = () => {
    const parsed = Number(inputValue);
    if (inputValue.trim() === '' || !Number.isFinite(parsed)) {
      setInputValue(String(currentHeight));
      return;
    }
    setDeviceHeight(parsed);
  };

  const handleReset = () => {
    const defaults = getDefaultHeights();
    commitHeights({ ...heights, [activeDevice]: defaults[activeDevice] });
    setInputValue(String(defaults[activeDevice]));
  };

  return {
    activeDevice,
    heights,
    currentHeight,
    inputValue,
    selectDevice,
    setDeviceHeight,
    handleNumberChange,
    handleNumberBlur,
    handleReset,
  };
}
