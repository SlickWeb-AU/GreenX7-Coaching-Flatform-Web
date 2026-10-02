import { FIXED_WELLBEING_AREAS } from '@/constants/dashboard';
import { BATTERY_MARKER_KEY_PREFIX } from '@/constants/battery';
import type { BatteryAreaScore, BatteryZone } from '@/types/battery';

export function calculateBatteryScore(scores: (number | null | undefined)[]): number | null {
  if (scores.length !== 8) return null;
  if (scores.some((s) => s === null || s === undefined || isNaN(s as number))) return null;
  const sum = (scores as number[]).reduce((acc, s) => acc + s * 10, 0);
  return Math.round(sum / 8);
}

export function getBatteryZone(percent: number | null): BatteryZone | null {
  if (percent === null || isNaN(percent)) return null;
  if (percent >= 80) return 'Thrive';
  if (percent >= 70) return 'Momentum';
  if (percent >= 50) return 'Function';
  return 'Survive';
}

export function getStrongestAreas(items: BatteryAreaScore[]): BatteryAreaScore[] {
  const order = new Map<string, number>(FIXED_WELLBEING_AREAS.map((d, i) => [d.area, i]));
  return [...items]
    .filter((i) => i.score !== null)
    .sort((a, b) => {
      if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
      return (order.get(a.area) ?? 99) - (order.get(b.area) ?? 99);
    })
    .slice(0, 3);
}

export function buildSubmissionMarkerKey(departmentSlug: string, period: string): string {
  return `${BATTERY_MARKER_KEY_PREFIX}-${departmentSlug}-${period}`;
}

export function isDraftFresh(savedAt: number, now: number = Date.now()): boolean {
  return now - savedAt < 60 * 60 * 1000;
}
