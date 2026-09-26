export const ALL_FILTER_VALUE = 'ALL';
export const OVERALL_FILTER_VALUE = 'overall';

export const CLIENTS_PAGE_SIZE = 10;

export const CLIENT_SORT_FIELDS = {
  NAME: 'name',
  INDUSTRY: 'industry',
  BATTERY_SCORE: 'batteryScore',
} as const;

export type ClientsSortField = (typeof CLIENT_SORT_FIELDS)[keyof typeof CLIENT_SORT_FIELDS];

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];

export const CLIENT_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[keyof typeof CLIENT_STATUSES];

export const WELLBEING_AREAS = {
  PHYSICAL: 'PHYSICAL',
  SLEEP: 'SLEEP',
  NUTRITION: 'NUTRITION',
  FUN: 'FUN',
  MINDSET: 'MINDSET',
  FRIENDSHIPS: 'FRIENDSHIPS',
  RELATIONSHIPS: 'RELATIONSHIPS',
  PURPOSE: 'PURPOSE',
} as const;

export type WellbeingArea = (typeof WELLBEING_AREAS)[keyof typeof WELLBEING_AREAS];

export const CHECKIN_STATUSES = {
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type CheckinStatus = (typeof CHECKIN_STATUSES)[keyof typeof CHECKIN_STATUSES];

export const REPORT_STATUSES = {
  NOT_SENT: 'NOT_SENT',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

export type ReportStatus = (typeof REPORT_STATUSES)[keyof typeof REPORT_STATUSES];

export const SORT_FIELD_TO_API: Record<ClientsSortField, string> = {
  [CLIENT_SORT_FIELDS.NAME]: 'businessName',
  [CLIENT_SORT_FIELDS.INDUSTRY]: 'industry',
  [CLIENT_SORT_FIELDS.BATTERY_SCORE]: 'currentBatteryScore',
};

export const CLIENT_STATUS_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All statuses' },
  { value: CLIENT_STATUSES.ACTIVE, label: 'Active' },
  { value: CLIENT_STATUSES.INACTIVE, label: 'Inactive' },
];

export const CLIENT_INDUSTRY_OPTIONS = [{ value: ALL_FILTER_VALUE, label: 'All industries' }];

export const CLIENT_FORM_STATUS_OPTIONS = [
  { value: CLIENT_STATUSES.ACTIVE, label: 'Active' },
  { value: CLIENT_STATUSES.INACTIVE, label: 'Inactive' },
];

export const CLIENT_COMPANY_SIZE_OPTIONS = [
  { value: 'SIZE_1_49', label: '1–49 employees' },
  { value: 'SIZE_50_199', label: '50–199 employees' },
  { value: 'SIZE_200_499', label: '200–499 employees' },
  { value: 'SIZE_500_999', label: '500–999 employees' },
  { value: 'SIZE_1000_PLUS', label: '1,000+ employees' },
];

/** CreateClientDto / UpdateClientDto cap check-in days at 28 */
export const CLIENT_CHECK_IN_DAY_MAX = 28;

export const DEFAULT_CLIENT_TIMEZONE = 'Australia/Sydney';

export const CLIENT_TABS = {
  DASHBOARD: 'dashboard',
  DEPARTMENTS: 'departments',
  CHECK_IN_HISTORY: 'check-in-history',
} as const;

export type ClientTab = (typeof CLIENT_TABS)[keyof typeof CLIENT_TABS];

export const CLIENT_STATE_OPTIONS = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

export const MONTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

export const CLIENT_TIMEZONE_OPTIONS = [
  { value: 'Australia/Sydney', label: 'AEST • Sydney' },
  { value: 'Australia/Melbourne', label: 'AEST • Melbourne' },
  { value: 'Australia/Brisbane', label: 'AEST • Brisbane' },
  { value: 'Australia/Adelaide', label: 'ACST • Adelaide' },
  { value: 'Australia/Perth', label: 'AWST • Perth' },
  { value: 'Australia/Darwin', label: 'ACST • Darwin' },
  { value: 'Australia/Hobart', label: 'AEST • Hobart' },
];

export const CHECK_IN_DAY_SELECT_OPTIONS = Array.from(
  { length: CLIENT_CHECK_IN_DAY_MAX },
  (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}${
      (index + 1) % 10 === 1 && (index + 1) % 100 !== 11
        ? 'st'
        : (index + 1) % 10 === 2 && (index + 1) % 100 !== 12
          ? 'nd'
          : (index + 1) % 10 === 3 && (index + 1) % 100 !== 13
            ? 'rd'
            : 'th'
    } of the month`,
  }),
);
