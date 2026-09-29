import { FIXED_WELLBEING_AREAS } from '@/constants/dashboard';
import type { InsightBadgeItem, WellbeingItemData } from '@/types';

export function calculateStrengthsAndFocus(items: WellbeingItemData[]): {
  strengths: InsightBadgeItem[];
  focus: InsightBadgeItem[];
} {
  if (!items || items.length === 0) {
    return { strengths: [], focus: [] };
  }

  // ponytail: tie-break by fixed area order so equal scores are deterministic
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
