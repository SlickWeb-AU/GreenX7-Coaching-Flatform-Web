'use client';

import { useId } from 'react';
import { Controller, type Control, type UseFormTrigger } from 'react-hook-form';
import type { ClientFormValues } from '@/validations/clients';
import { LogoUploadBox } from './LogoUploadBox';

export interface ControlledClientLogoUploadProps {
  control: Control<ClientFormValues>;
  trigger?: UseFormTrigger<ClientFormValues>;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
}

export function ControlledClientLogoUpload({
  control,
  trigger,
  darkLogoUrl,
  whiteLogoUrl,
}: ControlledClientLogoUploadProps) {
  const darkLogoId = useId();
  const whiteLogoId = useId();

  return (
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
            onChange={(file) => {
              field.onChange(file);
              trigger?.('whiteLogo');
            }}
          />
        )}
      />
    </div>
  );
}
