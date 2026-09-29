'use client';

import { useId } from 'react';
import { LogoUploadBox } from './LogoUploadBox';

export * from './LogoUploadBox';
export * from './ControlledClientLogoUpload';

export interface ClientLogoUploadProps {
  darkLogo?: File | null;
  whiteLogo?: File | null;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
  onDarkLogoChange?: (file: File | null) => void;
  onWhiteLogoChange?: (file: File | null) => void;
}

export function ClientLogoUpload({
  darkLogo,
  whiteLogo,
  darkLogoUrl,
  whiteLogoUrl,
  onDarkLogoChange,
  onWhiteLogoChange,
}: ClientLogoUploadProps) {
  const darkLogoId = useId();
  const whiteLogoId = useId();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LogoUploadBox
        id={darkLogoId}
        variant="dark"
        file={darkLogo ?? null}
        currentUrl={darkLogoUrl}
        onChange={onDarkLogoChange}
      />
      <LogoUploadBox
        id={whiteLogoId}
        variant="reversed"
        file={whiteLogo ?? null}
        currentUrl={whiteLogoUrl}
        onChange={onWhiteLogoChange}
      />
    </div>
  );
}
