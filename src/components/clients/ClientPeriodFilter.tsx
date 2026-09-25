'use client';

import { BaseSelectInside } from '@/components/base';
import { cn } from '@/lib/utils';

export interface ClientPeriodFilterProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  className?: string;
}

const MONTH_OPTIONS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const YEAR_OPTIONS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
];

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
