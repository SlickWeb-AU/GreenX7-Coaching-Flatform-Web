import { FIXED_AREA_SEQUENCE } from '@/constants/presentation';
import type { InsightBadgeItem, WellbeingItemData } from '@/types';

export function calculateStrengthsAndFocus(items: WellbeingItemData[]): {
  strengths: InsightBadgeItem[];
  focus: InsightBadgeItem[];
} {
  if (!items || items.length === 0) {
    return { strengths: [], focus: [] };
  }

  const areaOrder = (area: string) => {
    const i = FIXED_AREA_SEQUENCE.indexOf(area as (typeof FIXED_AREA_SEQUENCE)[number]);
    return i === -1 ? 99 : i;
  };
  const sorted = [...items].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return areaOrder(a.area) - areaOrder(b.area);
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
