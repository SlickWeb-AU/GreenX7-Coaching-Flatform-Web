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
}: ClientDepartmentHeaderProps) {
  if (!clientLogoUrl && !clientName && !departmentName) return null;

  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <div className={cn('flex flex-col', alignClasses[align], className)}>
      <div
        className={cn(
          'flex h-12 items-center',
          align === 'center' && 'justify-center',
          align === 'right' && 'justify-end',
          logoWrapperClassName,
        )}
      >
        {clientLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageUrl(clientLogoUrl)}
            alt={clientName ? `${clientName} logo` : 'Client logo'}
            className={cn('h-12 w-auto object-contain', logoClassName)}
          />
        ) : clientName ? (
          <span className={cn('body-16-bold text-white', nameClassName)}>{clientName}</span>
        ) : null}
      </div>
      {departmentName && (
        <span className={cn('body-20-medium mt-2 text-white/90', departmentClassName)}>
          {departmentName}
        </span>
      )}
    </div>
  );
}
