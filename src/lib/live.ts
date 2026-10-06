import { FIXED_WELLBEING_AREAS, MONTH_NAMES } from '@/constants/dashboard';
import type { BatteryCheckLiveResult, InsightBadgeItem, WellbeingItemData } from '@/types';
import { formatSlugLabel } from './utils';

export function calculateStrengthsAndFocus(items: WellbeingItemData[]): {
  strengths: InsightBadgeItem[];
  focus: InsightBadgeItem[];
} {
  if (!items || items.length === 0) {
    return { strengths: [], focus: [] };
  }

  const order: Map<string, number> = new Map(FIXED_WELLBEING_AREAS.map((d, i) => [d.area, i]));
  const sorted = [...items]
    .filter((item) => item.score !== null && item.score !== undefined)
    .sort((a, b) => {
      if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
      return (order.get(a.area) ?? 99) - (order.get(b.area) ?? 99);
    });

  const toBadge = (item: WellbeingItemData): InsightBadgeItem => ({
    area: item.area,
    label: item.label ?? item.area,
    score: item.score,
  });

  return {
    strengths: sorted.slice(0, 2).map(toBadge),
    focus: sorted.slice(-2).reverse().map(toBadge),
  };
}

/** Display names prefer API branding, fall back to formatted slugs. */
export function resolveLiveNames(
  data: BatteryCheckLiveResult | null | undefined,
  clientSlug?: string | null,
  departmentSlug?: string | null,
): { clientName: string; departmentName: string } {
  return {
    clientName:
      data?.branding?.clientName ||
      data?.clientName ||
      data?.businessName ||
      formatSlugLabel(clientSlug),
    departmentName:
      data?.branding?.departmentName || data?.departmentName || formatSlugLabel(departmentSlug),
  };
}

/** White logo suits dark surfaces; dark logo is the fallback. */
export function resolveLiveLogoUrl(data: BatteryCheckLiveResult | null | undefined): string | null {
  return data?.branding?.whiteLogoUrl || data?.branding?.darkLogoUrl || null;
}

/** Current period as 'October 2026'; raw label, then null when unknown. */
export function resolvePeriodLabel(data: BatteryCheckLiveResult | null | undefined): string | null {
  if (data?.period?.month && data?.period?.year) {
    return `${MONTH_NAMES[data.period.month - 1]} ${data.period.year}`;
  }
  return data?.period?.label ?? null;
}

/** Kỳ đã đóng: 'Closed on 25 July 2026' theo múi giờ của khách. */
export function resolveClosedLabel(data: BatteryCheckLiveResult | null | undefined): string | null {
  if (!data?.closedAt) return null;
  const date = new Date(data.closedAt);
  if (Number.isNaN(date.getTime())) return null;
  const format = (timeZone?: string) =>
    new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(date);
  try {
    return `Closed on ${format(data.timezone ?? undefined)}`;
  } catch {
    // Múi giờ lạ trình duyệt không hiểu thì in theo giờ máy
    return `Closed on ${format()}`;
  }
}

/** Previous month name as 'September'; wraps January -> December. */
export function resolvePreviousMonthLabel(
  data: BatteryCheckLiveResult | null | undefined,
): string | null {
  if (data?.period?.month) {
    return MONTH_NAMES[(data.period.month - 2 + 12) % 12];
  }
  return null;
}
