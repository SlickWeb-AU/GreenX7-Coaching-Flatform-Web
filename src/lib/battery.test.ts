import { describe, expect, it } from 'vitest';
import {
  buildDraftKey,
  calculateBatteryScore,
  getBatteryZone,
  getOrCreateDeviceId,
  isDraftFresh,
  normalizeAreaLabel,
} from './battery';

describe('calculateBatteryScore', () => {
  it('averages eight 1-10 scores to a percent, half up', () => {
    expect(calculateBatteryScore([7, 7, 7, 7, 7, 7, 7, 8])).toBe(71);
    expect(calculateBatteryScore([10, 10, 10, 10, 10, 10, 10, 10])).toBe(100);
  });

  it('returns null unless all eight areas are scored', () => {
    expect(calculateBatteryScore([7, 7, 7, 7, 7, 7, 7, null])).toBeNull();
    expect(calculateBatteryScore([])).toBeNull();
  });
});

describe('getBatteryZone', () => {
  it('maps boundary scores to the correct zone', () => {
    expect(getBatteryZone(49)).toBe('Survive');
    expect(getBatteryZone(50)).toBe('Function');
    expect(getBatteryZone(69)).toBe('Function');
    expect(getBatteryZone(70)).toBe('Momentum');
    expect(getBatteryZone(79)).toBe('Momentum');
    expect(getBatteryZone(80)).toBe('Thrive');
  });
});

describe('normalizeAreaLabel', () => {
  it('maps API uppercase areas to canonical Title-case labels', () => {
    expect(normalizeAreaLabel('PHYSICAL')).toBe('Physical');
    expect(normalizeAreaLabel('physical')).toBe('Physical');
    expect(normalizeAreaLabel('Physical')).toBe('Physical');
    expect(normalizeAreaLabel('FRIENDSHIPS')).toBe('Friendships');
  });

  it('never throws on non-string input (defense in depth)', () => {
    expect(normalizeAreaLabel(undefined as unknown as string)).toBe('');
    expect(normalizeAreaLabel(null as unknown as string)).toBe('');
    expect(normalizeAreaLabel({ area: 'SLEEP' } as unknown as string)).toBe('');
  });
});

describe('draft helpers', () => {
  it('treats drafts older than 60 minutes as stale', () => {
    expect(isDraftFresh(Date.now() - 59 * 60 * 1000)).toBe(true);
    expect(isDraftFresh(Date.now() - 61 * 60 * 1000)).toBe(false);
  });

  it('builds a period-scoped draft key', () => {
    expect(buildDraftKey('acme', 'sales', '2026-10')).toBe('gx7-bc-draft-acme-sales-2026-10');
  });

  it('generates and persists device ID in localStorage', () => {
    const id = getOrCreateDeviceId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(getOrCreateDeviceId()).toBe(id);
  });
});
