export const CLIENTS_PAGE_SIZE = 10;
export const ALL_FILTER_VALUE = 'ALL';

export interface ClientsQuery {
  page: number;
  search?: string;
  industry?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

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

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
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
  if (score === null || score === undefined) return '—';
  return `${score}%`;
}
