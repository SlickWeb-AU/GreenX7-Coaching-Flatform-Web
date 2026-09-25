'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  BasePagination,
  BasePillTabs,
  BaseTable,
  BaseTag,
  type BaseColumn,
  type BaseTagVariant,
} from '@/components/base';
import { ROUTES } from '@/config/routes';
import { cn } from '@/lib/utils';

export interface CheckInHistoryItem {
  id: string;
  reportingPeriod: string;
  timeFrame: string;
  participants: number;
  score: number;
  status: 'Complete' | 'In Progress' | 'Scheduled' | string;
  deliveryStatus: {
    type: 'not_sent' | 'sent' | 'failed' | string;
    label: string;
  };
  departmentKey?: string;
}

const DEFAULT_HISTORY: CheckInHistoryItem[] = [
  {
    id: 'checkin-6',
    reportingPeriod: 'June 2026',
    timeFrame: '1-20 Jun',
    participants: 118,
    score: 64,
    status: 'Complete',
    deliveryStatus: { type: 'not_sent', label: 'Not Sent' },
  },
  {
    id: 'checkin-5',
    reportingPeriod: 'May 2026',
    timeFrame: '1-20 May',
    participants: 109,
    score: 61,
    status: 'Complete',
    deliveryStatus: { type: 'sent', label: 'Sent - 25 May 2026, 08:03 AM' },
  },
  {
    id: 'checkin-4',
    reportingPeriod: 'April 2026',
    timeFrame: '1-20 Apr',
    participants: 97,
    score: 60,
    status: 'Complete',
    deliveryStatus: { type: 'not_sent', label: 'Not Sent' },
  },
  {
    id: 'checkin-3',
    reportingPeriod: 'March 2026',
    timeFrame: '1-20 Mar',
    participants: 84,
    score: 58,
    status: 'Complete',
    deliveryStatus: { type: 'not_sent', label: 'Not Sent' },
  },
  {
    id: 'checkin-2',
    reportingPeriod: 'February 2026',
    timeFrame: '1-20 Feb',
    participants: 66,
    score: 55,
    status: 'Complete',
    deliveryStatus: { type: 'failed', label: 'Failed' },
  },
  {
    id: 'checkin-1',
    reportingPeriod: 'January 2026',
    timeFrame: '1-20 Jan',
    participants: 63,
    score: 52,
    status: 'Complete',
    deliveryStatus: { type: 'sent', label: 'Sent - 23 Jan 2026, 09:05 PM' },
  },
];

const DEPARTMENT_TABS = [
  { key: 'overall', label: 'Overall' },
  { key: 'hr', label: 'HR' },
  { key: 'construction', label: 'Construction' },
  { key: 'administration', label: 'Administration' },
];

const DELIVERY_STATUS_TAG_MAP: Record<string, BaseTagVariant> = {
  not_sent: 'yellow',
  sent: 'cyan',
  failed: 'red',
};

const ASSESSMENT_STATUS_TAG_MAP: Record<string, BaseTagVariant> = {
  Complete: 'green',
  'In Progress': 'green',
  Scheduled: 'yellow',
};

export interface ClientHistoryTabProps {
  clientId: string;
  items?: CheckInHistoryItem[];
  className?: string;
}

export function ClientHistoryTab({
  clientId,
  items = DEFAULT_HISTORY,
  className,
}: ClientHistoryTabProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('overall');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredItems = useMemo(() => {
    if (selectedDepartment === 'overall') return items;
    return items.filter((item) => item.departmentKey === selectedDepartment);
  }, [items, selectedDepartment]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, pageSize]);

  const columns: BaseColumn<CheckInHistoryItem>[] = [
    {
      key: 'reportingPeriod',
      title: 'Reporting period',
      render: (_, row) => (
        <span className="body-16-bold text-neutral-grey-1">{row.reportingPeriod}</span>
      ),
    },
    {
      key: 'timeFrame',
      title: 'Time frame',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">{row.timeFrame}</span>
      ),
    },
    {
      key: 'participants',
      title: 'Participants',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">{row.participants}</span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      render: (_, row) => <span className="body-16-bold text-brand-green-2">{row.score}</span>,
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, row) => (
        <div className="flex flex-wrap items-center gap-2">
          <BaseTag variant={ASSESSMENT_STATUS_TAG_MAP[row.status] ?? 'green'}>{row.status}</BaseTag>

          <BaseTag variant={DELIVERY_STATUS_TAG_MAP[row.deliveryStatus.type] ?? 'yellow'}>
            {row.deliveryStatus.label}
          </BaseTag>
        </div>
      ),
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => {
        const isNotSent = row.deliveryStatus.type === 'not_sent';

        return (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                // Action send/resend
              }}
              className={cn(
                'body-14-bold transition-colors hover:underline',
                isNotSent ? 'text-brand-green-2' : 'text-secondary-orange-1',
              )}
            >
              {isNotSent ? 'Send' : 'Resend'}
            </button>

            <Link
              href={ROUTES.admin.clientDetail(clientId)}
              className="body-14-bold text-brand-green-2 transition-colors hover:underline"
            >
              View
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Sub-tab Department Selector */}
      <div>
        <BasePillTabs
          items={DEPARTMENT_TABS}
          activeKey={selectedDepartment}
          onChange={(key) => {
            setSelectedDepartment(key);
            setPage(1);
          }}
        />
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-neutral-grey-7 bg-white shadow-none">
        <BaseTable
          columns={columns}
          data={paginatedItems}
          rowKey="id"
          emptyTitle="No check-in records"
          emptyDescription="There is no check-in history found for this department."
        />
      </div>

      {/* Pagination */}
      <BasePagination
        page={page}
        totalPages={totalPages}
        meta={{
          total: filteredItems.length,
          page,
          pageSize,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        }}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ClientHistoryTab;
