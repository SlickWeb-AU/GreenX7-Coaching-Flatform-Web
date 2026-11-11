'use client';

import { useAdaptiveLogoHeight } from '@/hooks/useAdaptiveLogoHeight';
import { cn, resolveImageUrl } from '@/lib/utils';

export interface ClientDepartmentHeaderProps {
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
  align?: 'left' | 'center' | 'right';
  className?: string;
  logoWrapperClassName?: string;
  logoClassName?: string;
  nameClassName?: string;
  departmentClassName?: string;
  normalHeight?: string;
  verticalHeight?: string;
}

export function ClientDepartmentHeader({
  clientName,
  departmentName,
  clientLogoUrl,
  align = 'center',
  className,
  logoWrapperClassName,
  logoClassName,
  nameClassName,
  departmentClassName,
  normalHeight = 'h-12',
  verticalHeight = 'h-18',
}: ClientDepartmentHeaderProps) {
  const { heightClass, imgRef, handleImageLoad } = useAdaptiveLogoHeight(
    clientLogoUrl,
    normalHeight,
    verticalHeight,
  );

  if (!clientLogoUrl && !clientName && !departmentName) return null;

  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div className={cn('flex flex-col', alignClasses[align], className)}>
      {/* Có logo (khách đã upload) thì chỉ hiện logo; chưa có logo mới hiện tên công ty */}
      {clientLogoUrl ? (
        <div
          className={cn(
            'flex items-center',
            heightClass,
            align === 'center' && 'justify-center',
            align === 'right' && 'justify-end',
            logoWrapperClassName,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={resolveImageUrl(clientLogoUrl)}
            alt={clientName ? `${clientName} logo` : 'Client logo'}
            onLoad={handleImageLoad}
            className={cn('w-auto object-contain', heightClass, logoClassName)}
          />
        </div>
      ) : clientName ? (
        <span className={cn('body-16-bold text-neutral-grey-8', nameClassName)}>{clientName}</span>
      ) : null}
      {departmentName && (
        <span className={cn('body-20-medium mt-2 text-neutral-grey-8', departmentClassName)}>
          {departmentName}
        </span>
      )}
    </div>
  );
}
