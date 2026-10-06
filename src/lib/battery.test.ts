import { describe, expect, it } from 'vitest';
import {
  buildDraftKey,
  buildSubmissionMarkerKey,
  calculateBatteryScore,
  getBatteryZone,
  getLowestAreas,
  getOrCreateDeviceId,
  getStrongestAreas,
  isDraftFresh,
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

describe('getStrongestAreas', () => {
  it('returns the 3 highest areas, deterministic tie-break by fixed order', () => {
    const items = [
      { area: 'Purpose', score: 9 },
      { area: 'Physical', score: 9 },
      { area: 'Sleep', score: 9 },
      { area: 'Nutrition', score: 9 },
      { area: 'Fun', score: 4 },
      { area: 'Mindset', score: 5 },
      { area: 'Friendships', score: 6 },
      { area: 'Relationships', score: 7 },
    ];
    expect(getStrongestAreas(items).map((i) => i.area)).toEqual(['Physical', 'Sleep', 'Nutrition']);
  });
});

describe('getLowestAreas', () => {
  it('returns the 3 lowest areas, deterministic tie-break by fixed order', () => {
    const items = [
      { area: 'Purpose', score: 4 },
      { area: 'Physical', score: 4 },
      { area: 'Sleep', score: 4 },
      { area: 'Nutrition', score: 4 },
      { area: 'Fun', score: 9 },
      { area: 'Mindset', score: 8 },
      { area: 'Friendships', score: 7 },
      { area: 'Relationships', score: 6 },
    ];
    expect(getLowestAreas(items).map((i) => i.area)).toEqual(['Physical', 'Sleep', 'Nutrition']);
  });
});

describe('draft and marker helpers', () => {
  it('builds a period-scoped marker key', () => {
    expect(buildSubmissionMarkerKey('construction', '2026-10')).toBe('gx7-bc-construction-2026-10');
  });

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
