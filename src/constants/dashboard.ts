import { ALL_FILTER_VALUE } from './clients';

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

export const FIXED_WELLBEING_AREAS = [
  { area: 'Physical', label: 'Physical' },
  { area: 'Sleep', label: 'Sleep' },
  { area: 'Nutrition', label: 'Nutrition' },
  { area: 'Fun', label: 'Fun' },
  { area: 'Mindset', label: 'Mindset' },
  { area: 'Friendships', label: 'Friendships' },
  { area: 'Relationships', label: 'Relationships' },
  { area: 'Purpose', label: 'Purpose' },
] as const;

export const FIXED_ZONES = [
  { key: 'Thrive', label: 'Thrive Zone' },
  { key: 'Momentum', label: 'Momentum Zone' },
  { key: 'Function', label: 'Function Zone' },
  { key: 'Survive', label: 'Survive Zone' },
] as const;
