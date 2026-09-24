export interface DashboardQuery {
  month: number;
  year: number;
  industry: string;
}

export function buildDashboardQuery(q: DashboardQuery): string {
  const params = new URLSearchParams({
    month: String(q.month),
    year: String(q.year),
  });
  if (q.industry && q.industry !== 'ALL') params.set('industry', q.industry);
  return params.toString();
}
