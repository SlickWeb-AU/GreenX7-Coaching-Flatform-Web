import { ALL_FILTER_VALUE } from '@/features/admin-clients/clients-display';
import type { ClientsSortField } from '@/features/admin-clients/types';

export const SORT_FIELD_TO_API: Record<ClientsSortField, string> = {
  name: 'businessName',
  industry: 'industry',
  batteryScore: 'currentBatteryScore',
};

export const CLIENT_STATUS_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export const CLIENT_INDUSTRY_OPTIONS = [{ value: ALL_FILTER_VALUE, label: 'All industries' }];
