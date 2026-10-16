import { describe, expect, it } from 'vitest';

import {
  clampMonthToAvailableRange,
  clampYearToAvailableRange,
  getAvailableMonthOptions,
  getAvailableYearOptions,
  getMonthBoundsForYear,
  sortIndustryOptions,
} from './period';
import type { AvailablePeriodsDto } from '@/types';

describe('period utilities', () => {
  describe('sortIndustryOptions', () => {
    it('sorts regular industries A-Z, keeps ALL at start and Other at end', () => {
      const input = [
        { value: '3', label: 'Technology' },
        { value: 'ALL', label: 'All Industries' },
        { value: '4', label: 'Other' },
        { value: '1', label: 'Agriculture' },
        { value: '2', label: 'Education' },
      ];

      const result = sortIndustryOptions(input);
      expect(result.map((r) => r.label)).toEqual([
        'All Industries',
        'Agriculture',
        'Education',
        'Technology',
        'Other',
      ]);
    });
  });

  describe('getAvailableYearOptions', () => {
    it('generates years from latest down to earliest', () => {
      const periods: AvailablePeriodsDto = {
        earliest: { year: 2024, month: 7 },
        latest: { year: 2026, month: 10 },
      };

      const years = getAvailableYearOptions(periods);
      expect(years.map((y) => y.value)).toEqual(['2026', '2025', '2024']);
    });

    it('handles same year for earliest and latest', () => {
      const periods: AvailablePeriodsDto = {
        earliest: { year: 2026, month: 7 },
        latest: { year: 2026, month: 10 },
      };

      const years = getAvailableYearOptions(periods);
      expect(years.map((y) => y.value)).toEqual(['2026']);
    });
  });

  describe('getAvailableMonthOptions', () => {
    const periods: AvailablePeriodsDto = {
      earliest: { year: 2024, month: 7 },
      latest: { year: 2026, month: 10 },
    };

    it('restricts earliest year to months from earliest.month to 12', () => {
      const months = getAvailableMonthOptions(2024, periods);
      expect(months[0].value).toBe('7');
      expect(months[months.length - 1].value).toBe('12');
      expect(months.length).toBe(6);
    });

    it('gives full 12 months for intermediate year', () => {
      const months = getAvailableMonthOptions(2025, periods);
      expect(months[0].value).toBe('1');
      expect(months[months.length - 1].value).toBe('12');
      expect(months.length).toBe(12);
    });

    it('restricts latest year to months 1 through latest.month', () => {
      const months = getAvailableMonthOptions(2026, periods);
      expect(months[0].value).toBe('1');
      expect(months[months.length - 1].value).toBe('10');
      expect(months.length).toBe(10);
    });
  });

  describe('clampMonthToAvailableRange', () => {
    const periods: AvailablePeriodsDto = {
      earliest: { year: 2024, month: 7 },
      latest: { year: 2026, month: 10 },
    };

    it('clamps month before earliest.month in earliest year', () => {
      expect(clampMonthToAvailableRange(3, 2024, periods)).toBe(7);
      expect(clampMonthToAvailableRange(8, 2024, periods)).toBe(8);
    });

    it('clamps month after latest.month in latest year', () => {
      expect(clampMonthToAvailableRange(12, 2026, periods)).toBe(10);
      expect(clampMonthToAvailableRange(5, 2026, periods)).toBe(5);
    });
  });

  describe('getMonthBoundsForYear – year boundary edge cases', () => {
    const periods: AvailablePeriodsDto = {
      earliest: { year: 2024, month: 7 },
      latest: { year: 2026, month: 10 },
    };

    it('gives minMonth=1 for intermediate year (not earliest)', () => {
      const months = getAvailableMonthOptions(2025, periods);
      expect(months[0].value).toBe('1');
    });

    it('gives maxMonth=12 for intermediate year (not latest)', () => {
      const months = getAvailableMonthOptions(2025, periods);
      expect(months[months.length - 1].value).toBe('12');
    });
  });

  describe('year clamping + future guards (regression)', () => {
    it('caps year options at current year when latest.year is in the future', () => {
      const currentYear = new Date().getFullYear();
      const periods: AvailablePeriodsDto = {
        earliest: { year: 2024, month: 1 },
        latest: { year: currentYear + 2, month: 12 },
      };
      const years = getAvailableYearOptions(periods).map((y) => Number(y.value));
      expect(Math.max(...years)).toBe(currentYear);
      expect(years).toContain(currentYear);
    });

    it('caps current-year months even when current year is not latest.year', () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const periods: AvailablePeriodsDto = {
        earliest: { year: currentYear - 1, month: 1 },
        latest: { year: currentYear + 1, month: 12 },
      };
      const { maxMonth } = getMonthBoundsForYear(currentYear, periods);
      expect(maxMonth).toBe(currentMonth);
    });

    it('clamps out-of-range years into [earliest.year, min(latest.year, currentYear)]', () => {
      const periods: AvailablePeriodsDto = {
        earliest: { year: 2024, month: 7 },
        latest: { year: 2026, month: 10 },
      };
      expect(clampYearToAvailableRange(2020, periods)).toBe(2024);
      expect(clampYearToAvailableRange(2025, periods)).toBe(2025);
      expect(clampYearToAvailableRange(2030, periods)).toBe(
        Math.min(2026, new Date().getFullYear()),
      );
    });

    it('passes through year when availablePeriods is missing', () => {
      expect(clampYearToAvailableRange(2030, null)).toBe(2030);
      expect(clampYearToAvailableRange(2020, undefined)).toBe(2020);
    });

    it('never returns minMonth > maxMonth for degenerate same-year bounds', () => {
      const periods: AvailablePeriodsDto = {
        earliest: { year: 2026, month: 11 },
        latest: { year: 2026, month: 2 },
      };
      const { minMonth, maxMonth } = getMonthBoundsForYear(2026, periods);
      expect(minMonth).toBeLessThanOrEqual(maxMonth);
      expect(getAvailableMonthOptions(2026, periods).length).toBeGreaterThan(0);
    });
  });
});
