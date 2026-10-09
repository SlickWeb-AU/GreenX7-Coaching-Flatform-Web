import Image from 'next/image';

import { BaseButton } from '@/components/base';
import { ClientDepartmentHeader } from '@/components/clients';
import { ENV } from '@/constants';
import {
  GreenX7LogoLight,
  HowsYourBatterySticker,
  WheelLgIcon,
  WheelSmIcon,
  WheelXsIcon,
} from '@/components/icons';

interface BatteryLandingProps {
  clientName: string;
  departmentName: string;
  clientLogoUrl?: string | null;
  onStart: () => void;
  onHowItWorks: () => void;
}

export function BatteryLanding({
  clientName,
  departmentName,
  clientLogoUrl,
  onStart,
  onHowItWorks,
}: BatteryLandingProps) {
  return (
    <main className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-brand-green-2 text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-1600 flex-1 flex-col justify-between px-[60px] pb-6 pt-9 md:px-[80px]">
        <div className="pointer-events-none absolute -top-8 left-0 z-0 w-full md:hidden">
          <WheelXsIcon className="h-auto w-full object-cover opacity-60" />
        </div>

        <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden md:block lg:hidden">
          <WheelSmIcon className="h-auto max-w-[60vw] object-contain opacity-50" />
        </div>

        <div className="pointer-events-none absolute bottom-0 right-10 z-0 hidden lg:block 2xl:right-28">
          <WheelLgIcon className="h-[460px] w-auto object-contain opacity-70 2xl:h-[580px]" />
        </div>

        <header className="relative z-10 flex w-full items-center justify-center md:justify-start">
          <ClientDepartmentHeader
            clientName={clientName}
            departmentName={departmentName}
            clientLogoUrl={clientLogoUrl}
            align="left"
            className="items-center text-center md:items-start md:text-left"
            logoWrapperClassName="justify-center md:justify-start"
            nameClassName="heading-24-bold text-white"
          />
        </header>

        <section className="relative z-10 my-auto flex w-full flex-col items-center py-2 text-center md:items-start md:py-6 md:text-left lg:w-3/5">
          <div className="mb-3 flex w-full items-center justify-center md:mb-5 md:justify-start">
            <HowsYourBatterySticker className="h-[240px] w-[250px] object-contain drop-shadow-md md:h-[270px] md:w-[280px]" />
          </div>

          <p className="body-18-medium md:body-20-medium mb-4 max-w-[400px] leading-relaxed text-brand-green-5 md:mb-11">
            Take 60 seconds to bring awareness to your wellbeing.{' '}
            <button
              type="button"
              onClick={onHowItWorks}
              className="hidden font-bold text-brand-green-5 underline underline-offset-4 transition-colors hover:text-white md:inline"
            >
              How it works?
            </button>
          </p>

          <div className="flex flex-col items-center md:items-start">
            <BaseButton
              variant="custom"
              size="large"
              pill
              onClick={onStart}
              className="min-w-[240px] bg-brand-green-3 px-8 text-brand-green-2 transition-all hover:opacity-90 active:scale-[0.99]"
            >
              Start Battery Check
            </BaseButton>

            <button
              type="button"
              onClick={onHowItWorks}
              className="body-18-bold mt-4 text-brand-green-5 underline underline-offset-4 transition-colors hover:text-white md:hidden"
            >
              How it works?
            </button>
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 mx-auto hidden h-0 max-w-1600 lg:block">
        <div className="absolute bottom-0 right-14 translate-y-1/4 2xl:right-28">
          <Image
            src="/images/phone.webp"
            alt="GreenX7 App Mockup"
            width={420}
            height={880}
            className="h-auto w-[300px] object-contain object-bottom drop-shadow-2xl lg:w-[340px] 2xl:w-[420px]"
          />
        </div>
      </div>

      <footer className="relative z-10 w-full bg-[#004030] py-4">
        <div className="mx-auto flex w-full max-w-1600 items-center justify-center px-[60px] sm:justify-start md:px-[80px]">
          <a
            href={ENV.GREENX7_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <GreenX7LogoLight className="h-[31px] w-auto" />
          </a>
        </div>
      </footer>
    </main>
  );
}
