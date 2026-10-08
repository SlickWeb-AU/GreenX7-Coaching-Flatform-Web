'use client';

import { useEffect, useId, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn, resolveImageUrl } from '@/lib/utils';
import { BaseHelperText } from '../base/BaseHelperText';

export type LogoUploadVariant = 'dark' | 'reversed' | 'white';

export interface LogoUploadBoxProps {
  id?: string;
  variant?: LogoUploadVariant;
  title?: string;
  description?: string;
  inputLabel?: string;
  file?: File | null;
  currentUrl?: string | null;
  onChange?: (file: File | null) => void;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export function LogoUploadBox({
  id,
  variant = 'dark',
  title,
  description,
  inputLabel,
  file,
  currentUrl,
  onChange,
  error = false,
  helperText,
  className,
}: LogoUploadBoxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isReversed = variant === 'reversed' || variant === 'white';

  const defaultTitle = isReversed ? 'White / reversed logo' : 'Dark logo';
  const defaultDesc = isReversed ? 'For dark backgrounds.' : 'For light backgrounds.';

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(currentUrl ? resolveImageUrl(currentUrl) : null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, currentUrl]);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={inputId}
        className={cn(
          'flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl px-6 py-7 text-center transition-all',
          isReversed
            ? 'border border-dashed border-transparent bg-brand-green-2 hover:border-neutral-grey-6 hover:brightness-105'
            : 'border border-dashed border-neutral-grey-5 bg-neutral-grey-8 hover:border-brand-green-2 hover:bg-neutral-grey-7',
          error &&
            'border-secondary-red-4 focus-within:border-secondary-red-4 hover:border-secondary-red-4',
          className,
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={file?.name ?? title ?? defaultTitle}
            className="mb-3 max-h-12 w-auto max-w-full object-contain"
          />
        ) : (
          <Upload
            size={24}
            className={cn('mb-3', isReversed ? 'text-neutral-grey-7' : 'text-neutral-grey-3')}
            aria-hidden
          />
        )}
        <span
          className={cn('body-16-bold', isReversed ? 'text-neutral-grey-7' : 'text-neutral-grey-1')}
        >
          {title ?? defaultTitle}
        </span>
        <p
          className={cn(
            'body-14-regular mt-1',
            isReversed ? 'text-neutral-grey-8' : 'text-neutral-grey-3',
          )}
        >
          {description ?? defaultDesc}
        </p>
        <input
          id={inputId}
          type="file"
          aria-label={inputLabel ?? title ?? defaultTitle}
          aria-invalid={error}
          accept="image/png,image/svg+xml"
          className="sr-only"
          onChange={(event) => onChange?.(event.target.files?.[0] ?? null)}
        />
      </label>
      <BaseHelperText helperText={helperText} error={error} />
    </div>
  );
}
