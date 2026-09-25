'use client';

import Link from 'next/link';

import { BaseTable, BaseTag, type BaseColumn, type BaseTagVariant } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { formatBatteryScore } from '@/lib/clients';
import { cn, formatDateTime } from '@/lib/utils';
import type { CheckInHistoryItemDto, CheckinStatus, PaginationMeta, ReportStatus } from '@/types';

const CHECKIN_STATUS_TAG_MAP: Record<CheckinStatus, BaseTagVariant> = {
  SCHEDULED: 'yellow',
  OPEN: 'green',
  CLOSED: 'cyan',
};

const REPORT_STATUS_TAG_MAP: Record<ReportStatus, { variant: BaseTagVariant; label: string }> = {
  NOT_SENT: { variant: 'yellow', label: 'Not Sent' },
  SENT: { variant: 'cyan', label: 'Sent' },
  FAILED: { variant: 'red', label: 'Failed' },
};

export interface ClientCheckInHistoryTableProps {
  clientId: string;
  data: CheckInHistoryItemDto[];
  meta?: PaginationMeta | null;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  className?: string;
}

export function ClientCheckInHistoryTable({
  clientId,
  data,
  meta,
  page,
  totalPages,
  onPageChange,
  loading = false,
  className,
}: ClientCheckInHistoryTableProps) {
  const columns: BaseColumn<CheckInHistoryItemDto>[] = [
    {
      key: 'periodLabel',
      title: 'Reporting period',
      render: (_, row) => (
        <span className="body-16-bold text-neutral-grey-1">
          {row.periodLabel || `${row.periodMonth}/${row.periodYear}`}
        </span>
      ),
    },
    {
      key: 'timeFrame',
      title: 'Time frame',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">{row.timeFrame || '—'}</span>
      ),
    },
    {
      key: 'participants',
      title: 'Participants',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">{row.participants ?? 0}</span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      render: (_, row) => (
        <span className="body-16-bold text-brand-green-2">{formatBatteryScore(row.score)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, row) => {
        const checkinVariant = CHECKIN_STATUS_TAG_MAP[row.checkInStatus] ?? 'green';
        const reportConfig = REPORT_STATUS_TAG_MAP[row.reportStatus] ?? {
          variant: 'yellow' as BaseTagVariant,
          label: row.reportStatus,
        };
        const deliveryLabel =
          row.reportStatus === 'SENT' && row.reportSentAt
            ? `Sent - ${formatDateTime(row.reportSentAt)}`
            : reportConfig.label;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <BaseTag variant={checkinVariant}>{row.checkInStatus}</BaseTag>
            <BaseTag variant={reportConfig.variant}>{deliveryLabel}</BaseTag>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => {
        const isNotSent = row.reportStatus === 'NOT_SENT';

        return (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                // Future action: send/resend report
              }}
              className={cn(
                'body-14-bold transition-colors hover:underline',
                isNotSent ? 'text-brand-green-2' : 'text-secondary-orange-1',
              )}
            >
              {isNotSent ? 'Send' : 'Resend'}
            </button>

            <Link
              href={
                row.reportId
                  ? `/report/view?token=${encodeURIComponent(row.reportId)}`
                  : ROUTES.admin.clientDetail(clientId)
              }
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
    <BaseTable
      columns={columns}
      data={data}
      rowKey="checkInId"
      loading={loading}
      meta={meta}
      page={page}
      totalPages={totalPages ?? meta?.totalPages ?? 1}
      onPageChange={onPageChange}
      className={className}
      emptyTitle="No check-in records"
      emptyDescription="There is no check-in history found for this department."
    />
  );
}

export default ClientCheckInHistoryTable;
