import { describe, expect, it } from 'vitest';
import {
  CLIENT_CHECK_IN_DAY_MAX,
  CHECK_IN_DAY_SELECT_OPTIONS,
  CLIENT_STATUSES,
} from '@/constants/clients';
import { clientFormSchema } from './clients';

describe('CLIENT_CHECK_IN_DAY_MAX', () => {
  it('is set to 31', () => {
    expect(CLIENT_CHECK_IN_DAY_MAX).toBe(31);
  });

  it('generates 31 options ending with 31st of the month', () => {
    expect(CHECK_IN_DAY_SELECT_OPTIONS).toHaveLength(31);
    expect(CHECK_IN_DAY_SELECT_OPTIONS[0]).toEqual({
      value: '1',
      label: '1st of the month',
    });
    expect(CHECK_IN_DAY_SELECT_OPTIONS[27]).toEqual({
      value: '28',
      label: '28th of the month',
    });
    expect(CHECK_IN_DAY_SELECT_OPTIONS[30]).toEqual({
      value: '31',
      label: '31st of the month',
    });
  });
});

describe('clientFormSchema checkInStartDay and checkInEndDay', () => {
  const baseClient = {
    businessName: 'Acme Corp',
    industryId: 'tech',
    companySize: 'SIZE_1_49',
    state: 'NSW',
    status: CLIENT_STATUSES.ACTIVE,
    contacts: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Manager',
      },
    ],
    departments: [
      {
        name: 'Engineering',
        status: CLIENT_STATUSES.ACTIVE,
      },
    ],
    autoSendReport: true,
  };

  it('allows start day and end day to be the exact same day', () => {
    const resultSameDay15 = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 15,
      checkInEndDay: 15,
    });
    expect(resultSameDay15.success).toBe(true);

    const resultSameDay31 = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 31,
      checkInEndDay: 31,
    });
    expect(resultSameDay31.success).toBe(true);

    const resultSameDay1 = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 1,
      checkInEndDay: 1,
    });
    expect(resultSameDay1.success).toBe(true);
  });

  it('allows days up to 31', () => {
    const result = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 1,
      checkInEndDay: 31,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.checkInStartDay).toBe(1);
      expect(result.data.checkInEndDay).toBe(31);
    }
  });

  it('rejects days exceeding 31', () => {
    const resultStart = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 32,
      checkInEndDay: 32,
    });
    expect(resultStart.success).toBe(false);

    const resultEnd = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 1,
      checkInEndDay: 32,
    });
    expect(resultEnd.success).toBe(false);
  });

  it('rejects when start day is after end day', () => {
    const result = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: 20,
      checkInEndDay: 10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('checkInStartDay'));
      expect(issue?.message).toBe('Start day must be before or equal to end day.');
    }
  });

  it('allows undefined start day and end day', () => {
    const result = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: undefined,
      checkInEndDay: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('coerces string numbers to numbers up to 31', () => {
    const result = clientFormSchema.safeParse({
      ...baseClient,
      checkInStartDay: '31',
      checkInEndDay: '31',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.checkInStartDay).toBe(31);
      expect(result.data.checkInEndDay).toBe(31);
    }
  });
});
