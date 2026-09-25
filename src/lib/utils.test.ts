import { describe, expect, it } from 'vitest';

import { cleanParams, formatCurrency, formatNumber, getInitials } from './utils';

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
