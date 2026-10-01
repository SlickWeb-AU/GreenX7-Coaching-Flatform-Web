import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { LiveIndicator } from './LiveIndicator';

export interface LiveDashboardHeaderProps {
  periodLabel?: string | null;
}

export function LiveDashboardHeader({ periodLabel }: LiveDashboardHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b border-white/10 px-10 py-6">
      <div className="flex items-center">
        <Link
          href={ROUTES.admin.dashboard}
          aria-label="Back to admin dashboard"
          className="inline-block"
        >
          <Image
            src="/icons/greenx7-logo-light.svg"
            alt="GreenX7"
            width={130}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 backdrop-blur-sm">
          <LiveIndicator />
          <span className="body-12-bold text-white">LIVE</span>
        </div>
        {periodLabel && <span className="body-14-medium text-white">{periodLabel}</span>}
      </div>
    </header>
  );
}
