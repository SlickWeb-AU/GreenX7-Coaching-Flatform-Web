export const DASHBOARD_MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const DASHBOARD_YEAR_OPTIONS = [
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
];

export const DASHBOARD_INDUSTRY_OPTIONS = [{ value: 'ALL', label: 'All Industries' }];

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
