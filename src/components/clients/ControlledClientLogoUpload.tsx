'use client';

import { useId, useMemo } from 'react';
import {
  Controller,
  useController,
  useWatch,
  type Control,
  type UseFormTrigger,
} from 'react-hook-form';
import { CLIENT_LOGO_HEIGHT_DEFAULTS } from '@/constants/clients';
import type { ClientLogoHeights } from '@/types';
import type { ClientFormValues } from '@/validations/clients';
import { ClientLogoDeviceSettings } from './ClientLogoDeviceSettings';
import { LogoUploadBox } from './LogoUploadBox';

export interface ControlledClientLogoUploadProps {
  control: Control<ClientFormValues>;
  trigger?: UseFormTrigger<ClientFormValues>;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
  onDeleteDarkLogo?: () => void;
  onDeleteWhiteLogo?: () => void;
  isDeletingDarkLogo?: boolean;
  isDeletingWhiteLogo?: boolean;
}

export function ControlledClientLogoUpload({
  control,
  trigger,
  darkLogoUrl,
  whiteLogoUrl,
  onDeleteDarkLogo,
  onDeleteWhiteLogo,
  isDeletingDarkLogo = false,
  isDeletingWhiteLogo = false,
}: ControlledClientLogoUploadProps) {
  const darkLogoId = useId();
  const whiteLogoId = useId();
  const darkLogoFile = useWatch({ control, name: 'darkLogo' });
  const whiteLogoFile = useWatch({ control, name: 'whiteLogo' });

  const { field: desktopHeightField } = useController({
    control,
    name: 'logoHeightDesktop',
    defaultValue: CLIENT_LOGO_HEIGHT_DEFAULTS.desktop,
  });
  const { field: tabletHeightField } = useController({
    control,
    name: 'logoHeightTablet',
    defaultValue: CLIENT_LOGO_HEIGHT_DEFAULTS.tablet,
  });
  const { field: mobileHeightField } = useController({
    control,
    name: 'logoHeightMobile',
    defaultValue: CLIENT_LOGO_HEIGHT_DEFAULTS.mobile,
  });

  const heights: ClientLogoHeights = useMemo(
    () => ({
      desktop: desktopHeightField.value ?? CLIENT_LOGO_HEIGHT_DEFAULTS.desktop,
      tablet: tabletHeightField.value ?? CLIENT_LOGO_HEIGHT_DEFAULTS.tablet,
      mobile: mobileHeightField.value ?? CLIENT_LOGO_HEIGHT_DEFAULTS.mobile,
    }),
    [desktopHeightField.value, tabletHeightField.value, mobileHeightField.value],
  );

  const handleHeightsChange = (next: ClientLogoHeights) => {
    if (next.desktop !== desktopHeightField.value) desktopHeightField.onChange(next.desktop);
    if (next.tablet !== tabletHeightField.value) tabletHeightField.onChange(next.tablet);
    if (next.mobile !== mobileHeightField.value) mobileHeightField.onChange(next.mobile);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Controller
          name="darkLogo"
          control={control}
          render={({ field, fieldState }) => (
            <LogoUploadBox
              id={darkLogoId}
              variant="dark"
              file={field.value}
              currentUrl={darkLogoUrl}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              disabled={isDeletingDarkLogo}
              onDelete={() => {
                if (field.value) {
                  field.onChange(null);
                  trigger?.('darkLogo');
                } else if (onDeleteDarkLogo) {
                  onDeleteDarkLogo();
                }
              }}
              onChange={(file) => {
                field.onChange(file);
                trigger?.('darkLogo');
              }}
            />
          )}
        />
        <Controller
          name="whiteLogo"
          control={control}
          render={({ field, fieldState }) => (
            <LogoUploadBox
              id={whiteLogoId}
              variant="reversed"
              file={field.value}
              currentUrl={whiteLogoUrl}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              disabled={isDeletingWhiteLogo}
              onDelete={() => {
                if (field.value) {
                  field.onChange(null);
                  trigger?.('whiteLogo');
                } else if (onDeleteWhiteLogo) {
                  onDeleteWhiteLogo();
                }
              }}
              onChange={(file) => {
                field.onChange(file);
                trigger?.('whiteLogo');
              }}
            />
          )}
        />
      </div>
      <ClientLogoDeviceSettings
        darkLogoFile={darkLogoFile}
        whiteLogoFile={whiteLogoFile}
        darkLogoUrl={darkLogoUrl}
        whiteLogoUrl={whiteLogoUrl}
        heights={heights}
        onChange={handleHeightsChange}
      />
    </div>
  );
}
