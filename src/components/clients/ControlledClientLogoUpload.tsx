'use client';

import { useId } from 'react';
import { Controller, type Control } from 'react-hook-form';
import type { ClientFormValues } from '@/validations/clients';
import { LogoUploadBox } from './LogoUploadBox';

export interface ControlledClientLogoUploadProps {
  control: Control<ClientFormValues>;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
}

export function ControlledClientLogoUpload({
  control,
  darkLogoUrl,
  whiteLogoUrl,
}: ControlledClientLogoUploadProps) {
  const darkLogoId = useId();
  const whiteLogoId = useId();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Controller
        name="darkLogo"
        control={control}
        render={({ field }) => (
          <LogoUploadBox
            id={darkLogoId}
            variant="dark"
            file={field.value}
            currentUrl={darkLogoUrl}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="whiteLogo"
        control={control}
        render={({ field }) => (
          <LogoUploadBox
            id={whiteLogoId}
            variant="reversed"
            file={field.value}
            currentUrl={whiteLogoUrl}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  );
}
