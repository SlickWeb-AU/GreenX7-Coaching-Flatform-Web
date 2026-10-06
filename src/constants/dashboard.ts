import type { ComponentType, SVGProps } from 'react';

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
import { ALL_FILTER_VALUE, WELLBEING_AREA_DISPLAY_ORDER } from './clients';
import { DASHBOARD_COLORS } from './tokens';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];

export const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  value: String(index + 1),
  label: name,
}));

export const getYearOptions = (count = 10, startYear?: number) => {
  const currentYear = startYear ?? new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });
};

export const YEAR_OPTIONS = getYearOptions(10);

export const DASHBOARD_INDUSTRY_OPTIONS = [{ value: ALL_FILTER_VALUE, label: 'All Industries' }];

export const FIXED_WELLBEING_AREAS = WELLBEING_AREA_DISPLAY_ORDER.map((area) => ({
  area,
  label: area,
}));

export const FIXED_ZONES = [
  { key: 'Thrive', label: 'Thrive Zone' },
  { key: 'Momentum', label: 'Momentum Zone' },
  { key: 'Function', label: 'Function Zone' },
  { key: 'Survive', label: 'Survive Zone' },
] as const;

export type AreaIcon = ComponentType<
  { size?: number | string; color?: string } & SVGProps<SVGSVGElement>
>;

export const AREA_BADGE: Record<string, string> = {
  Physical: 'bg-secondary-orange-2',
  Sleep: 'bg-secondary-cyan-2',
  Nutrition: 'bg-secondary-green-2',
  Fun: 'bg-secondary-yellow-2',
  Mindset: 'bg-secondary-violet-2',
  Friendships: 'bg-secondary-rose-2',
  Relationships: 'bg-secondary-red-2',
  Purpose: 'bg-secondary-teal-2',
};

export const AREA_COLOR: Record<string, string> = {
  Physical: DASHBOARD_COLORS.secondary.orange1,
  Sleep: DASHBOARD_COLORS.secondary.cyan1,
  Nutrition: DASHBOARD_COLORS.secondary.green1,
  Fun: DASHBOARD_COLORS.secondary.yellow1,
  Mindset: DASHBOARD_COLORS.secondary.violet1,
  Friendships: DASHBOARD_COLORS.secondary.rose1,
  Relationships: DASHBOARD_COLORS.secondary.red1,
  Purpose: DASHBOARD_COLORS.secondary.teal1,
};

export const AREA_BAR_COLORS: Record<string, string> = {
  Physical: 'bg-secondary-orange-1',
  Sleep: 'bg-secondary-cyan-1',
  Nutrition: 'bg-secondary-green-1',
  Fun: 'bg-secondary-yellow-1',
  Mindset: 'bg-secondary-violet-1',
  Friendships: 'bg-secondary-rose-1',
  Relationships: 'bg-secondary-red-1',
  Purpose: 'bg-secondary-teal-1',
};

export const AREA_ICON_MAP: Record<string, AreaIcon> = {
  Physical: HeartIcon,
  Sleep: CloudIcon,
  Nutrition: NutritionIcon,
  Fun: FunIcon,
  Mindset: MindsetIcon,
  Friendships: FriendshipsIcon,
  Relationships: RelationshipsIcon,
  Purpose: PurposeIcon,
};
