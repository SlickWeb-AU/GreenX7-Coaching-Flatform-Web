import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BaseDatePicker, formatDayOfMonth } from './BaseDatePicker';

describe('BaseDatePicker', () => {
  it('displays placeholder when no value is provided', () => {
    render(
      <BaseDatePicker placeholder="Select date" format={formatDayOfMonth} disableMonthNavigation />,
    );
    expect(screen.getByText('Select date')).toBeDefined();
  });

  it('correctly displays 31st of the month for value 31', () => {
    render(<BaseDatePicker value={31} format={formatDayOfMonth} disableMonthNavigation />);
    expect(screen.getByText('31st of the month')).toBeDefined();
  });

  it('renders all 31 days and allows selecting day 31 when disableMonthNavigation is true', () => {
    const handleChange = vi.fn();
    render(
      <BaseDatePicker format={formatDayOfMonth} disableMonthNavigation onChange={handleChange} />,
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    const day31Button = screen.getByRole('button', { name: '31' });
    expect(day31Button).toBeDefined();
    expect(day31Button.hasAttribute('disabled')).toBe(false);

    fireEvent.click(day31Button);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(31, expect.any(Date));
    const calledDate = handleChange.mock.calls[0][1] as Date;
    expect(calledDate.getDate()).toBe(31);
  });

  it('allows same day start and end values to be selected up to day 31', () => {
    const handleChangeStart = vi.fn();
    const handleChangeEnd = vi.fn();

    const { rerender } = render(
      <div>
        <BaseDatePicker
          id="start-day"
          label="Start day"
          value={15}
          format={formatDayOfMonth}
          disableMonthNavigation
          onChange={handleChangeStart}
        />
        <BaseDatePicker
          id="end-day"
          label="End day"
          value={15}
          format={formatDayOfMonth}
          disableMonthNavigation
          onChange={handleChangeEnd}
        />
      </div>,
    );

    const startInputs = screen.getAllByText('15th of the month');
    expect(startInputs).toHaveLength(2);

    rerender(
      <div>
        <BaseDatePicker
          id="start-day"
          label="Start day"
          value={31}
          format={formatDayOfMonth}
          disableMonthNavigation
          onChange={handleChangeStart}
        />
        <BaseDatePicker
          id="end-day"
          label="End day"
          value={31}
          format={formatDayOfMonth}
          disableMonthNavigation
          onChange={handleChangeEnd}
        />
      </div>,
    );

    const endInputs = screen.getAllByText('31st of the month');
    expect(endInputs).toHaveLength(2);
  });
});
