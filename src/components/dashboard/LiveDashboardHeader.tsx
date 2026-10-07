import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { GreenX7LogoLight } from '@/components/icons';
import { LiveIndicator } from './LiveIndicator';

export interface LiveDashboardHeaderProps {
  periodLabel?: string | null;
  /** false khi kỳ đã đóng: ẩn badge LIVE, chỉ còn tên kỳ */
  isLive?: boolean;
}

export function LiveDashboardHeader({ periodLabel, isLive = true }: LiveDashboardHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b border-white/10 px-10 py-6">
      <div className="flex items-center">
        <Link
          href={ROUTES.admin.dashboard}
          aria-label="Back to admin dashboard"
          className="inline-block"
        >
          <GreenX7LogoLight className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {isLive && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 backdrop-blur-sm">
            <LiveIndicator />
            <span className="body-12-bold text-white">LIVE</span>
          </div>
        )}
        {periodLabel && <span className="body-14-medium text-[#C6DDD1]">{periodLabel}</span>}
      </div>
    </header>
  );
}
