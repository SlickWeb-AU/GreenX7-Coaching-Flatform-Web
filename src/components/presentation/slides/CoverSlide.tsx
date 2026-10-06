import Image from 'next/image';

import { ClientDepartmentHeader } from '@/components/clients';
import { StaticSlide } from '@/components/presentation/StaticSlide';
import { useSlideLayout } from '@/components/presentation/StandardSlideLayout';
import { cn } from '@/lib/utils';
import type { BaseSlideProps } from '@/types';

export function CoverSlide({
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
        'relative flex h-full w-full select-none flex-col overflow-hidden bg-brand-green-2',
        className,
      )}
    >
      <header className="z-20 flex w-full flex-shrink-0 items-start justify-between px-10 pt-10">
        <div>
          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="left"
          />
        </div>
        <div>
          <Image
            src="/icons/greenx7-logo-light.svg"
            alt="GreenX7"
            width={200}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>
      </header>

      <main className="z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden">
        <div className="mx-auto my-auto flex h-full max-h-[750px] w-full max-w-1600 flex-col justify-center px-6 sm:px-10">
          <StaticSlide
            variant="cover"
            headline={
              <>
                <span>MEASURE.</span>
                <br />
                <span>UNDERSTAND.</span>
                <br />
                <span>IMPROVE.</span>
                <br />
                <span className="text-brand-green-3">THRIVE.</span>
              </>
            }
          />
        </div>
      </main>

      {controls && (
        <div className="pointer-events-auto absolute bottom-10 right-10 z-20 flex items-center">
          {controls}
        </div>
      )}
    </div>
  );
}
