import Image from 'next/image';

import { ClientDepartmentHeader } from '@/components/clients';
import { GreenX7LogoLight, HowsYourBatterySticker } from '@/components/icons';
import { useSlideLayout } from '@/components/presentation/StandardSlideLayout';
import { cn } from '@/lib/utils';
import type { BaseSlideProps } from '@/types';

export function ClosingSlide({
  clientName: propClientName,
  departmentName: propDeptName,
  clientLogoUrl: propLogoUrl,
  controls: propControls,
  className,
}: BaseSlideProps = {}) {
  const ctx = useSlideLayout();
  const clientName = propClientName ?? ctx?.clientName ?? '';
  const departmentName = propDeptName ?? ctx?.departmentName ?? '';
  const clientLogoUrl = propLogoUrl ?? ctx?.clientLogoUrl;
  const controls = propControls ?? ctx?.controls;

  return (
    <div
      className={cn(
        'relative isolate flex h-full w-full select-none flex-col items-center justify-center overflow-hidden bg-brand-green-2 text-white',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Northern-Rivers_Wolllunbin.webp"
          alt="Northern Rivers Wollumbin"
          fill
          sizes="100vw"
          unoptimized
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-brand-green-1/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,#005943_7.21%,rgba(0,89,67,0)_98.15%)]" />
      </div>

      <div className="pointer-events-auto absolute left-1/2 top-10 z-20 flex -translate-x-1/2 items-center">
        <ClientDepartmentHeader
          clientName={clientName}
          departmentName={departmentName}
          clientLogoUrl={clientLogoUrl}
          departmentClassName="text-neutral-grey-8"
          align="center"
        />
      </div>

      <div className="pointer-events-auto absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center">
        <GreenX7LogoLight className="h-10 w-auto" />
      </div>

      {controls && (
        <div className="pointer-events-auto absolute bottom-10 right-10 z-20 flex items-center">
          {controls}
        </div>
      )}

      <div className="relative z-10 -mt-2 flex flex-col items-center justify-center px-8 text-center">
        <h2 className="heading-80-bold text-white drop-shadow-md">
          <span>The </span>
          <span className="text-brand-green-3">Battery</span>
          <span> we bring</span>
          <br />
          <span>shapes the culture</span>
          <br />
          <span>we </span>
          <span className="text-brand-green-3">create</span>
          <span>.</span>
        </h2>

        <div className="mt-8">
          <HowsYourBatterySticker className="h-auto w-[312px] cursor-default select-none drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
