import {
  CloudIcon,
  FriendshipsIcon,
  FunIcon,
  HeartIcon,
  MindsetIcon,
  NutritionIcon,
  PurposeIcon,
  RelationshipsIcon,
} from '@/components/icons';
import type { InsightItem } from '@/components/clients/DepartmentInsightListCard';
import type { AreaScoreDto } from '@/types';

/** Icon theo mảng wellbeing — nhận cả mã (PHYSICAL) lẫn nhãn (Physical) */
const ICON_BY_AREA: Record<string, typeof HeartIcon> = {
  PHYSICAL: HeartIcon,
  SLEEP: CloudIcon,
  NUTRITION: NutritionIcon,
  FUN: FunIcon,
  MINDSET: MindsetIcon,
  FRIENDSHIPS: FriendshipsIcon,
  RELATIONSHIPS: RelationshipsIcon,
  PURPOSE: PurposeIcon,
};

/** strengths / focus của API -> dòng của thẻ DepartmentInsightListCard (màn 08, 17) */
export function toInsightItems(
  items?: AreaScoreDto[] | null,
  fallback: InsightItem[] = [],
): InsightItem[] {
  if (!items || items.length === 0) return fallback;
  return items.map((it) => ({
    key: it.area.toLowerCase(),
    label: it.label || it.area,
    score: it.score ?? 0,
    icon:
      ICON_BY_AREA[it.area.toUpperCase()] ??
      ICON_BY_AREA[(it.label ?? '').toUpperCase()] ??
      HeartIcon,
  }));
}
