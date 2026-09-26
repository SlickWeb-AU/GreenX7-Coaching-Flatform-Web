'use client';

import { BaseSelectInside } from '@/components/base';
import { MONTH_OPTIONS, YEAR_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';

export interface ClientPeriodFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  className?: string;
}

export function ClientPeriodFilter({
  selectedMonth,
  onMonthChange,
  selectedYear,
  onYearChange,
  className,
}: ClientPeriodFilterProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-3 rounded-2xl bg-white p-4 shadow-none',
        className,
      )}
    >
      <BaseSelectInside
        label="Month"
        placeholder="Select month"
        value={selectedMonth}
        options={MONTH_OPTIONS}
        onChange={onMonthChange}
        variant="secondary"
        containerClassName="w-full"
        className="w-full min-w-0"
      />
      <BaseSelectInside
        label="Year"
        placeholder="Select year"
        value={selectedYear}
        options={YEAR_OPTIONS}
        onChange={onYearChange}
        variant="secondary"
        containerClassName="w-full"
        className="w-full min-w-0"
      />
    </div>
  );
}
