/** Merge a patch into a query string. Returns null when nothing changes. */
export function mergeSearchParams(
  current: string,
  patch: Record<string, string | null>,
): string | null {
  const params = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
  }
  const next = params.toString();
  const normalizedCurrent = new URLSearchParams(current).toString();
  return next === normalizedCurrent ? null : next;
}
