import { ALL_FILTER_VALUE, CLIENTS_PAGE_SIZE } from '@/constants/clients';
import { formatScoreToPercent } from '@/lib/utils';
import type { ClientsQuery } from '@/types';

export function buildClientsQuery(q: ClientsQuery): string {
  const params = new URLSearchParams({
    page: String(q.page),
    pageSize: String(CLIENTS_PAGE_SIZE),
  });
  if (q.search) params.set('search', q.search);
  if (q.industry && q.industry !== ALL_FILTER_VALUE) params.set('industryId', q.industry);
  if (q.status && q.status !== ALL_FILTER_VALUE) params.set('status', q.status);
  if (q.sortBy) params.set('sortBy', q.sortBy);
  if (q.sortOrder) params.set('sortOrder', q.sortOrder);
  return params.toString();
}

export function industryName(industry: unknown): string {
  if (!industry) return '—';
  if (typeof industry === 'string') return industry;
  if (typeof industry === 'object' && 'name' in industry) {
    const name = (industry as { name?: unknown }).name;
    return typeof name === 'string' ? name : '—';
  }
  return '—';
}

export function formatBatteryScore(score: number | null | undefined): string {
  const rounded = formatScoreToPercent(score);
  if (rounded === null) return '—';
  return `${rounded}%`;
}
