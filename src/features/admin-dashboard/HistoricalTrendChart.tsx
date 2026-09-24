'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardTrendPointDto } from './types';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getMonthLabel(point: DashboardTrendPointDto): string {
  if (typeof point.month === 'number' && point.month >= 1 && point.month <= 12) {
    return MONTH_NAMES[point.month - 1];
  }
  if (point.label) {
    const parts = point.label.split('-');
    const m = Number(parts[1] ?? parts[0]);
    if (!isNaN(m) && m >= 1 && m <= 12) {
      return MONTH_NAMES[m - 1];
    }
    return point.label;
  }
  return '';
}

export function HistoricalTrendChart({
  data,
  title = 'Platform Historical Trend',
  subtitle,
}: {
  data?: DashboardTrendPointDto[];
  title?: string;
  subtitle?: string;
}) {
  const chartData = useMemo(
    () =>
      (data ?? []).map((point) => ({
        ...point,
        displayLabel: getMonthLabel(point),
      })),
    [data],
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full min-h-[260px] flex-col rounded-2xl bg-white p-6 shadow-none">
        <div className="mb-6 flex flex-col gap-0.5">
          <h2 className="heading-20-bold text-neutral-grey-1">{title}</h2>
          {subtitle && <p className="body-14-medium text-neutral-grey-3">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-none">
      <div className="mb-6 flex flex-col gap-0.5">
        <h2 className="heading-20-bold text-neutral-grey-1">{title}</h2>
        {subtitle && <p className="body-14-medium text-neutral-grey-3">{subtitle}</p>}
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 16, left: 16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#CBD1CD" strokeWidth={1} />
            <XAxis
              dataKey="displayLabel"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: '#EDF3EF' }}
              tick={{ fill: '#6A7A72', fontSize: 12, fontWeight: 500 }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-brand-green-2 px-3 py-1.5 text-xs font-medium text-white shadow-none">
                      <span className="font-bold">{label}: </span>
                      <span>{payload[0].value}%</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#005943"
              strokeWidth={3}
              dot={{ r: 5, fill: '#FFFFFF', stroke: '#005943', strokeWidth: 2.5 }}
              activeDot={{ r: 7, fill: '#FFFFFF', stroke: '#005943', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
