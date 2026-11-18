'use client';

import { useOptionalClientBranding } from '@/components/providers';
import { getResponsiveLogoHeightProps } from '@/lib/branding';
import { cn, resolveImageUrl } from '@/lib/utils';
import type { ClientLogoHeights } from '@/types';

export interface ClientDepartmentHeaderProps {
  clientName?: string | null;
  departmentName?: string | null;
  clientLogoUrl?: string | null;
  logoHeights?: ClientLogoHeights | null;
  /** Surface behind the header when reading logo URL from ClientBrandingContext */
  surface?: 'dark' | 'light';
  align?: 'left' | 'center' | 'right';
  className?: string;
  logoWrapperClassName?: string;
  logoClassName?: string;
  nameClassName?: string;
  departmentClassName?: string;
}

export function ClientDepartmentHeader({
  clientName: propClientName,
  departmentName: propDepartmentName,
  clientLogoUrl: propClientLogoUrl,
  logoHeights: propLogoHeights,
  surface = 'dark',
  align = 'center',
  className,
  logoWrapperClassName,
  logoClassName,
  nameClassName,
  departmentClassName,
}: ClientDepartmentHeaderProps) {
  const branding = useOptionalClientBranding();
  const clientName = propClientName !== undefined ? propClientName : branding?.clientName;
  const departmentName =
    propDepartmentName !== undefined ? propDepartmentName : branding?.departmentName;
  const logoHeights = propLogoHeights !== undefined ? propLogoHeights : branding?.logoHeights;
  const clientLogoUrl =
    propClientLogoUrl !== undefined
      ? propClientLogoUrl
      : ((surface === 'light'
          ? branding?.darkLogoUrl || branding?.whiteLogoUrl
          : branding?.whiteLogoUrl || branding?.darkLogoUrl) ?? null);

  if (!clientLogoUrl && !clientName && !departmentName) return null;

  const { style: customHeightStyle, heightClass: resolvedHeightClass } =
    getResponsiveLogoHeightProps(logoHeights, 'h-15');

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
          style={customHeightStyle}
          className={cn(
            'flex items-center',
            resolvedHeightClass,
            align === 'center' && 'justify-center',
            align === 'right' && 'justify-end',
            logoWrapperClassName,
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(clientLogoUrl)}
            alt={clientName ? `${clientName} logo` : 'Client logo'}
            className={cn('w-auto max-w-full object-contain', resolvedHeightClass, logoClassName)}
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
