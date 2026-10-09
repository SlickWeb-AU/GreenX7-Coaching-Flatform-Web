import { describe, expect, it } from 'vitest';

import {
  cleanParams,
  cn,
  formatCheckInDate,
  formatCurrency,
  formatNumber,
  getInitials,
  getMonthName,
} from './utils';

describe('formatCurrency', () => {
  it('định dạng theo chuẩn tiền Việt', () => {
    expect(formatCurrency(25000)).toMatch(/25\.000/);
  });

  it('trả về dấu gạch khi không có giá trị', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
  });

  it('vẫn hiển thị số 0 chứ không coi là rỗng', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('getInitials', () => {
  it('lấy 2 chữ cái cuối của họ tên', () => {
    expect(getInitials('Nguyễn Văn An')).toBe('VA');
    expect(getInitials('Trang')).toBe('T');
  });
});

describe('cleanParams', () => {
  it('bỏ các giá trị rỗng để URL query sạch', () => {
    expect(
      cleanParams({ page: 1, search: '', categoryId: undefined, status: 'ACTIVE', inStock: false }),
    ).toEqual({ page: 1, status: 'ACTIVE', inStock: false });
  });
});

describe('formatCheckInDate', () => {
  it('formats date to day month year', () => {
    expect(formatCheckInDate('2026-08-01T00:00:00.000Z')).toMatch(/1 August 2026/);
    expect(formatCheckInDate(null)).toBe('');
  });

  it('formats in the given timeZone when provided', () => {
    expect(formatCheckInDate('2026-07-31T15:00:00.000Z', 'Australia/Sydney')).toMatch(
      /1 August 2026/,
    );
    expect(formatCheckInDate('2026-08-01T00:00:00.000Z', 'invalid-zone')).toMatch(/1 August 2026/);
  });
});

describe('getMonthName', () => {
  it('returns month name from month number', () => {
    expect(getMonthName(7)).toBe('July');
    expect(getMonthName(1)).toBe('January');
    expect(getMonthName(12)).toBe('December');
    expect(getMonthName(null)).toBe('');
  });
});

describe('cn (tailwind-merge typography)', () => {
  it('overrides body typography classes with later classes', () => {
    expect(cn('body-16-medium', 'body-14-bold')).toBe('body-14-bold');
  });

  it('overrides heading typography classes with body classes', () => {
    expect(cn('heading-64-bold', 'body-16-medium')).toBe('body-16-medium');
  });

  it('overrides body classes with heading classes', () => {
    expect(cn('body-16-medium', 'heading-28-bold')).toBe('heading-28-bold');
  });

  it('overrides caption classes with later typography classes', () => {
    expect(cn('caption-12-regular', 'caption-12-bold')).toBe('caption-12-bold');
    expect(cn('body-14-regular', 'caption-12-bold')).toBe('caption-12-bold');
  });

  it('preserves other non-conflicting tailwind classes like colors', () => {
    expect(cn('body-16-medium text-neutral-grey-2', 'body-14-bold text-brand-green-1')).toBe(
      'body-14-bold text-brand-green-1',
    );
  });

  it('supports responsive and state variants correctly', () => {
    expect(cn('hover:body-16-medium', 'hover:body-14-bold')).toBe('hover:body-14-bold');
    expect(cn('md:heading-64-bold', 'md:heading-48-bold')).toBe('md:heading-48-bold');
    expect(cn('body-16-medium', 'hover:body-14-bold')).toBe('body-16-medium hover:body-14-bold');
  });
});
