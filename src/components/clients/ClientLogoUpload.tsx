'use client';

import { useId, useState } from 'react';

import { UploadIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export type LogoUploadVariant = 'dark' | 'reversed' | 'white';

export interface LogoUploadBoxProps {
  id?: string;
  variant?: LogoUploadVariant;
  title?: string;
  description?: string;
  inputLabel?: string;
  file?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function LogoUploadBox({
  id,
  variant = 'dark',
  title,
  description,
  inputLabel,
  file,
  onChange,
  className,
}: LogoUploadBoxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isReversed = variant === 'reversed' || variant === 'white';

  const defaultTitle = isReversed ? 'White / reversed logo' : 'Dark logo';
  const defaultDesc = isReversed ? 'For dark backgrounds.' : 'For light backgrounds.';

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-7 text-center transition-all',
        isReversed
          ? 'border border-dashed border-transparent bg-brand-green-2 hover:border-neutral-grey-6 hover:brightness-105'
          : 'border border-dashed border-neutral-grey-5 bg-neutral-grey-8 hover:border-brand-green-2 hover:bg-neutral-grey-7',
        className,
      )}
    >
      <UploadIcon
        color={isReversed ? '#EDF3EF' : '#6A7A72'}
        className={cn('mb-3 h-6 w-6', isReversed ? 'text-neutral-grey-7' : 'text-neutral-grey-3')}
        aria-hidden
      />
      <span
        className={cn('body-16-bold', isReversed ? 'text-neutral-grey-7' : 'text-neutral-grey-1')}
      >
        {file?.name ?? title ?? defaultTitle}
      </span>
      <p
        className={cn(
          'body-14-regular mt-1',
          isReversed ? 'text-neutral-grey-8' : 'text-neutral-grey-3',
        )}
      >
        {file ? 'Selected for this form session' : (description ?? defaultDesc)}
      </p>
      <input
        id={inputId}
        type="file"
        aria-label={inputLabel ?? title ?? defaultTitle}
        accept="image/png,image/jpeg,image/svg+xml"
        className="sr-only"
        onChange={(event) => onChange?.(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}

export function ClientLogoUpload() {
  const darkLogoId = useId();
  const whiteLogoId = useId();
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [whiteLogo, setWhiteLogo] = useState<File | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LogoUploadBox id={darkLogoId} variant="dark" file={darkLogo} onChange={setDarkLogo} />
      <LogoUploadBox id={whiteLogoId} variant="reversed" file={whiteLogo} onChange={setWhiteLogo} />
    </div>
  );
}
