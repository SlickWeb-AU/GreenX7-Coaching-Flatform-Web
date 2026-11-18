import { BATTERY_MARKER_KEY_PREFIX } from '@/constants/battery';
import { WELLBEING_AREA_DISPLAY_ORDER } from '@/constants/clients';
import { ZONE_COLORS } from '@/constants/tokens';
import type { BatteryZone } from '@/types/battery';

/** Map API area keys (usually UPPER_CASE) to canonical Title-case display labels. */
export function normalizeAreaLabel(area: unknown): string {
  if (typeof area !== 'string') return '';
  const found = (WELLBEING_AREA_DISPLAY_ORDER as readonly string[]).find(
    (a) => a.toUpperCase() === area.toUpperCase(),
  );
  return found ?? area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();
}

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

/** Normalize any zone key or label string to a canonical ZONE_COLORS key, or null if unrecognised. */
export function resolveZoneKey(input: string): keyof typeof ZONE_COLORS | null {
  const raw = input.trim().toLowerCase();
  if (raw.includes('thrive')) return 'Thrive';
  if (raw.includes('momentum')) return 'Momentum';
  if (raw.includes('function')) return 'Function';
  if (raw.includes('survive')) return 'Survive';
  return null;
}

export function buildDraftKey(clientSlug: string, departmentSlug: string, period: string): string {
  return `${BATTERY_MARKER_KEY_PREFIX}-draft-${clientSlug}-${departmentSlug}-${period}`;
}

export function isDraftFresh(savedAt: number, now: number = Date.now()): boolean {
  return now - savedAt < 60 * 60 * 1000;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem('gx7-device-id');
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    window.localStorage.setItem('gx7-device-id', id);
  }
  return id;
}
