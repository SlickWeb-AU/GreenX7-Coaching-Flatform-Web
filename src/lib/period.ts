import type { SelectOption } from '@/components/base';
import { ALL_FILTER_VALUE, MONTH_NAMES } from '@/constants';
import type { AvailablePeriodsDto } from '@/types';

/**
 * Sorts industry options alphabetically (A–Z).
 * - The "All industries" option (matching `allValue`) is placed at the top.
 * - "Other" / "Others" options are pinned to the bottom of the list.
 */
export function sortIndustryOptions<T extends { value: string; label: string }>(
  options: T[],
  allValue: string = ALL_FILTER_VALUE,
): T[] {
  let allOption: T | undefined;
  const regular: T[] = [];
  const other: T[] = [];

  for (const opt of options) {
    if (opt.value === allValue) {
      allOption = opt;
      continue;
    }
    const clean = opt.label.trim().toLowerCase();
    if (clean === 'other' || clean === 'others') {
      other.push(opt);
    } else {
      regular.push(opt);
    }
  }

  regular.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  other.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

  return [...(allOption ? [allOption] : []), ...regular, ...other];
}

/**
 * Returns available year options from earliest.year to latest.year in descending order.
 * Excludes years outside the available reporting periods.
 */
export function getAvailableYearOptions(
  availablePeriods?: AvailablePeriodsDto | null,
): SelectOption[] {
  const currentYear = new Date().getFullYear();
  const maxYear = Math.min(availablePeriods?.latest?.year ?? currentYear, currentYear);
  const minYear = availablePeriods?.earliest?.year ?? currentYear;

  const years: SelectOption[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push({ value: String(y), label: String(y) });
  }

  if (years.length === 0) {
    years.push({ value: String(currentYear), label: String(currentYear) });
  }

  return years;
}

/**
 * Calculates valid [minMonth, maxMonth] bounds for the selected year.
 */
export function getMonthBoundsForYear(
  selectedYear: number,
  availablePeriods?: AvailablePeriodsDto | null,
): { minMonth: number; maxMonth: number } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (availablePeriods?.earliest && availablePeriods?.latest) {
    const { earliest, latest } = availablePeriods;
    let minMonth = selectedYear === earliest.year ? earliest.month : 1;
    let maxMonth = selectedYear === latest.year ? latest.month : 12;
    // Never allow future months for current year, regardless of latest.year
    if (selectedYear === currentYear) maxMonth = Math.min(maxMonth, currentMonth);
    // Guard degenerate bounds (e.g. earliest.month > latest.month same year)
    if (minMonth > maxMonth) minMonth = maxMonth;

    return {
      minMonth: Math.max(1, Math.min(12, minMonth)),
      maxMonth: Math.max(1, Math.min(12, maxMonth)),
    };
  }

  // Fallback when availablePeriods is not yet loaded:
  // Restrict current year up to current month (no future months).
  const maxMonth = selectedYear >= currentYear ? currentMonth : 12;
  return { minMonth: 1, maxMonth };
}

/**
 * Returns available month options for the selected year based on availablePeriods.
 * - Current year: limited up to latest.month / current month.
 * - Earliest year: starts from earliest.month.
 */
export function getAvailableMonthOptions(
  selectedYear: number,
  availablePeriods?: AvailablePeriodsDto | null,
): SelectOption[] {
  const { minMonth, maxMonth } = getMonthBoundsForYear(selectedYear, availablePeriods);

  const options: SelectOption[] = [];
  for (let m = minMonth; m <= maxMonth; m++) {
    options.push({
      value: String(m),
      label: MONTH_NAMES[m - 1],
    });
  }

  return options;
}

/**
 * Clamps the selected year into [earliest.year, min(latest.year, currentYear)].
 * Passes through when availablePeriods is missing.
 */
export function clampYearToAvailableRange(
  year: number,
  availablePeriods?: AvailablePeriodsDto | null,
): number {
  if (!availablePeriods?.earliest || !availablePeriods?.latest) return year;
  const currentYear = new Date().getFullYear();
  const maxYear = Math.min(availablePeriods.latest.year, currentYear);
  const minYear = availablePeriods.earliest.year;
  if (minYear > maxYear) return maxYear;
  if (year < minYear) return minYear;
  if (year > maxYear) return maxYear;
  return year;
}

/**
 * Clamps the selected month to the available [minMonth, maxMonth] range for the given year.
 */
export function clampMonthToAvailableRange(
  month: number,
  selectedYear: number,
  availablePeriods?: AvailablePeriodsDto | null,
): number {
  const { minMonth, maxMonth } = getMonthBoundsForYear(selectedYear, availablePeriods);
  if (month < minMonth) return minMonth;
  if (month > maxMonth) return maxMonth;
  return month;
}
