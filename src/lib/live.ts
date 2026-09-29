import type { InsightBadgeItem, WellbeingItemData } from '@/types';

export function calculateStrengthsAndFocus(items: WellbeingItemData[]): {
  strengths: InsightBadgeItem[];
  focus: InsightBadgeItem[];
} {
  if (!items || items.length === 0) {
    return { strengths: [], focus: [] };
  }

  const sorted = [...items]
    .filter((item) => item.score !== null && item.score !== undefined)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

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
