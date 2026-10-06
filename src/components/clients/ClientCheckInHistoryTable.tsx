'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { BaseTable, BaseTag, type BaseColumn, type BaseTagVariant } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { CLIENT_TABS } from '@/constants/clients';
import { clientsApi } from '@/features/admin-clients';
import { toApiError } from '@/lib/api-error';
import { formatBatteryScore } from '@/lib/clients';
import { queryKeys } from '@/lib/query-client';
import { cn, formatDateTime } from '@/lib/utils';
import type {
  CheckInHistoryItemDto,
  CheckinStatus,
  PaginationMeta,
  ReportStatus,
  SendReportResultDto,
} from '@/types';

import { ResendReportDialog } from './ResendReportDialog';

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
  const queryClient = useQueryClient();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [resendRow, setResendRow] = useState<CheckInHistoryItemDto | null>(null);

  const refresh = (checkInId: string) => {
    queryClient.invalidateQueries({ queryKey: ['admin-client-check-ins', clientId] });
    queryClient.invalidateQueries({ queryKey: queryKeys.reports.recipients(checkInId) });
  };

  const notify = (result: SendReportResultDto, verb: 'sent' | 'resent') => {
    const total = result.recipients.length;
    const failed = result.failedRecipients.length;
    if (failed === 0) {
      toast.success(`Report ${verb} to ${total} recipient${total === 1 ? '' : 's'}`);
    } else if (failed === total) {
      toast.error(`Could not send to ${result.failedRecipients.join(', ')}`);
    } else {
      toast.warning(
        `Report ${verb} to ${total - failed} of ${total}. Failed: ${result.failedRecipients.join(', ')}`,
      );
    }
  };

  // Send lần đầu: gửi cho tất cả contact, không cần chọn
  const sendMutation = useMutation({
    mutationFn: (checkInId: string) => clientsApi.sendReport(checkInId),
    onSuccess: (result, checkInId) => {
      notify(result, 'sent');
      refresh(checkInId);
    },
    onError: (err) => {
      toast.error(toApiError(err).message);
    },
    onSettled: () => {
      setSendingId(null);
    },
  });

  const handleSendReport = (row: CheckInHistoryItemDto) => {
    if (row.reportStatus !== 'NOT_SENT') {
      setResendRow(row);
      return;
    }
    setSendingId(row.checkInId);
    sendMutation.mutate(row.checkInId);
  };

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
        <span className="body-14-medium text-neutral-grey-2">
          {row.participants && row.participants > 0 ? row.participants : '—'}
        </span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      render: (_, row) => (
        <span className="body-16-bold text-brand-green-2">
          {row.participants && row.participants > 0 && row.score !== null && row.score !== undefined
            ? formatBatteryScore(row.score)
            : '—'}
        </span>
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
        const isSending = sendingId === row.checkInId;

        return (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleSendReport(row)}
              className={cn(
                'body-14-bold transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50',
                isNotSent ? 'text-brand-green-2' : 'text-secondary-orange-1',
              )}
            >
              {isSending ? 'Sending...' : isNotSent ? 'Send' : 'Resend'}
            </button>

            <Link
              // Admin không có mã của người nhận (chỉ lưu bản băm) nên không mở trang
              // báo cáo công khai được — mở tab Dashboard đúng kỳ đó, cùng số liệu với
              // tab Overall của báo cáo.
              href={`${ROUTES.admin.clientDetail(clientId)}?tab=${CLIENT_TABS.DASHBOARD}&month=${row.periodMonth}&year=${row.periodYear}`}
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
    <>
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
      {resendRow && (
        <ResendReportDialog
          checkInId={resendRow.checkInId}
          periodLabel={resendRow.periodLabel || `${resendRow.periodMonth}/${resendRow.periodYear}`}
          onClose={() => setResendRow(null)}
          onSent={(result) => {
            notify(result, 'resent');
            refresh(resendRow.checkInId);
            setResendRow(null);
          }}
        />
      )}
    </>
  );
}

export default ClientCheckInHistoryTable;
