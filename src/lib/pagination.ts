import type { PageItem } from '@/types/ui';

export function buildPageItems(page: number, totalPages: number): PageItem[] {
  const last = Math.max(totalPages, 1);
  const current = Math.min(Math.max(page, 1), last);

  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', last];
  if (current >= last - 3) return [1, '…', last - 4, last - 3, last - 2, last - 1, last];
  return [1, '…', current - 1, current, current + 1, '…', last];
}
