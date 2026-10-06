import type { ComponentType, ReactNode, SVGProps } from 'react';

import type { DepartmentDashboardDto, DepartmentShareLinksDto, WellbeingArea } from './clients';

export type SlideType = 'static' | 'dynamic';

export interface SlideConfig {
  id: number;
  slug: string;
  title: string;
  type: SlideType;
}

export interface InsightBadgeItem {
  area: string;
  label: string;
  score: number | null;
}

export interface WellbeingItemData {
  area: WellbeingArea | string;
  label?: string;
  score: number | null;
  vsPreviousMonth: number | null;
  vsFirstCheck: number | null;
}

/**
 * Data returned by GET /battery-check/{clientSlug}/{departmentSlug}/live
 * Branding and period come from the backend; dashboard aggregates are partial
 * until the first check-in lands.
 */
export interface BatteryBranding {
  clientName?: string | null;
  departmentName?: string | null;
  darkLogoUrl?: string | null;
  whiteLogoUrl?: string | null;
}

export interface BatteryPeriod {
  year?: number | null;
  month?: number | null;
  label?: string | null;
}

export interface BatteryCheckLiveResult extends Omit<Partial<DepartmentDashboardDto>, 'shareUrl'> {
  clientName?: string;
  branding?: BatteryBranding | null;
  period?: BatteryPeriod | null;
  shareLinks?: DepartmentShareLinksDto | null;
  /** false khi kỳ đã đóng — dashboard hiện số liệu kỳ vừa đóng, không có badge LIVE */
  isLive?: boolean;
  /** ISO — thời điểm kỳ đóng, null khi đang live */
  closedAt?: string | null;
  /** Múi giờ của khách, dùng để in ngày đóng kỳ */
  timezone?: string | null;
}

export type StaticSlideVariant = 'default' | 'cover';

export interface BaseSlideProps {
  clientName?: string;
  departmentName?: string;
  clientLogoUrl?: string | null;
  controls?: ReactNode;
  className?: string;
}

export interface SlideLayoutContextValue {
  clientName?: string;
  departmentName?: string;
  clientLogoUrl?: string | null;
  controls?: ReactNode;
}

export interface PresentationContextValue {
  clientSlug: string;
  departmentSlug: string;
  data: BatteryCheckLiveResult | null;
  score: number | null;
  items: WellbeingItemData[];
  isLoading: boolean;
  qrCodeUrl: string | null;
  batteryCheckUrl: string | null;
  clientName: string;
  departmentName: string;
  fullDisplayName: string;
  clientLogoUrl: string | null;
  previousMonthLabel: string | null;
}

export type OrbitIcon = ComponentType<
  { size?: number | string; color?: string } & SVGProps<SVGSVGElement>
>;

export interface OrbitItem {
  key: string;
  label: string;
  angle: number;
  bg: string;
  icon: OrbitIcon;
}
