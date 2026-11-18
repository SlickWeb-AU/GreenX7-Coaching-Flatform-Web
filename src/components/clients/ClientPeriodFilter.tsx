'use client';

import { useEffect, useMemo } from 'react';

import { BaseSelectInside } from '@/components/base';
import {
  clampMonthToAvailableRange,
  clampYearToAvailableRange,
  getAvailableMonthOptions,
  getAvailableYearOptions,
} from '@/lib/period';
import { cn } from '@/lib/utils';
import type { AvailablePeriodsDto } from '@/types';

export interface ClientPeriodFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  // Single merged update — avoids two router.replace calls overwriting each other.
  // If omitted, falls back to separate onYearChange/onMonthChange (useState batching).
  onPeriodChange?: (next: { year: string; month: string }) => void;
  availablePeriods?: AvailablePeriodsDto | null;
  className?: string;
}

export function ClientPeriodFilter({
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  onPeriodChange,
  availablePeriods,
  className,
}: ClientPeriodFilterProps) {
  const yearOptions = useMemo(() => getAvailableYearOptions(availablePeriods), [availablePeriods]);

  const monthOptions = useMemo(
    () => getAvailableMonthOptions(Number(selectedYear), availablePeriods),
    [selectedYear, availablePeriods],
  );

  const handleYearChange = (newYear: string) => {
    const clampedYear = clampYearToAvailableRange(Number(newYear), availablePeriods);
    const clamped = clampMonthToAvailableRange(
      Number(selectedMonth),
      clampedYear,
      availablePeriods,
    );
    if (onPeriodChange) {
      onPeriodChange({ year: String(clampedYear), month: String(clamped) });
      return;
    }
    onYearChange(String(clampedYear));
    if (clamped !== Number(selectedMonth)) {
      onMonthChange(String(clamped));
    }
  };

  useEffect(() => {
    if (!availablePeriods) return;
    const clampedYear = clampYearToAvailableRange(Number(selectedYear), availablePeriods);
    const clamped = clampMonthToAvailableRange(
      Number(selectedMonth),
      clampedYear,
      availablePeriods,
    );
    const yearChanged = clampedYear !== Number(selectedYear);
    const monthChanged = clamped !== Number(selectedMonth);
    if (!yearChanged && !monthChanged) return;
    if (onPeriodChange) {
      onPeriodChange({ year: String(clampedYear), month: String(clamped) });
    } else {
      if (yearChanged) onYearChange(String(clampedYear));
      if (monthChanged) onMonthChange(String(clamped));
    }
  }, [availablePeriods, selectedMonth, selectedYear, onMonthChange, onYearChange, onPeriodChange]);

  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-3 rounded-2xl bg-white p-3 shadow-none',
        className,
      )}
    >
      <BaseSelectInside
        label="Month"
        placeholder="Select month"
        value={selectedMonth}
        options={monthOptions}
        onChange={onMonthChange}
        variant="secondary"
        compact
        containerClassName="w-full"
        className="w-full"
      />
      <BaseSelectInside
        label="Year"
        placeholder="Select year"
        value={selectedYear}
        options={yearOptions}
        onChange={handleYearChange}
        variant="secondary"
        compact
        containerClassName="w-full"
        className="w-full"
      />
    </div>
  );
}
