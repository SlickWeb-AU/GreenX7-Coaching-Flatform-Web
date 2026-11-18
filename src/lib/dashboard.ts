import { ALL_FILTER_VALUE } from '@/constants';
import type { DashboardQuery } from '@/types';

export function buildDashboardQuery(q: DashboardQuery): string {
  const params = new URLSearchParams({
    month: String(q.month),
    year: String(q.year),
  });
  if (q.industry && q.industry !== ALL_FILTER_VALUE) {
    params.set('industryId', q.industry);
  }
  return params.toString();
}
