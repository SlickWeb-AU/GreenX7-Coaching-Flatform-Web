'use client';

import Image from 'next/image';
import { Monitor } from 'lucide-react';

export function AdminMobileWarning() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-neutral-grey-8 p-6 text-center lg:hidden">
      {/* Top Header / Logo */}
      <div className="pt-8">
        <Image
          src="/icons/greenx7-logo.svg"
          alt="GreenX7"
          width={150}
          height={36}
          className="h-8 w-auto"
          priority
        />
      </div>

      {/* Warning Card */}
      <div className="my-auto flex w-full max-w-sm flex-col items-center rounded-2xl border border-neutral-grey-7 bg-white p-8 shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-green-2 text-brand-green-2">
          <Monitor className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="heading-20-bold mb-3 text-neutral-grey-1">Desktop Screen Required</h1>

        <p className="body-14-medium mb-6 text-neutral-grey-3">
          The GreenX7 Admin Portal is designed specifically for desktop viewports to give you the
          best experience for data analytics, client management, and reporting.
        </p>

        <div className="w-full rounded-xl bg-neutral-grey-8 p-3 text-xs font-medium text-neutral-grey-2">
          Please access this page from a laptop, desktop computer, or expand your browser window.
        </div>
      </div>

      {/* Screen Code (URD AP/E9) */}
      <div className="pb-4 text-xs font-medium text-neutral-grey-4">
        Screen Code: <span className="font-semibold text-neutral-grey-3">AP/E9</span>
      </div>
    </div>
  );
}

export default AdminMobileWarning;
