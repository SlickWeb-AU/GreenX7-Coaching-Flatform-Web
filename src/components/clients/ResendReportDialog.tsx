'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  BaseButton,
  BaseDialog,
  BaseLoading,
  BaseTag,
  type BaseTagVariant,
} from '@/components/base';
import { clientsApi } from '@/features/admin-clients';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';
import { cn, formatDateTime } from '@/lib/utils';
import type { ReportRecipientDto, ReportStatus, SendReportResultDto } from '@/types';

const STATUS_TAG: Record<ReportStatus, { variant: BaseTagVariant; label: string }> = {
  NOT_SENT: { variant: 'yellow', label: 'Not sent' },
  SENT: { variant: 'cyan', label: 'Sent' },
  FAILED: { variant: 'red', label: 'Failed' },
};

export interface ResendReportDialogProps {
  checkInId: string;
  periodLabel: string;
  onClose: () => void;
  onSent: (result: SendReportResultDto) => void;
}

/**
 * Dialog Resend: liệt kê mọi người nhận kèm trạng thái lần gửi gần nhất, chọn
 * bằng checkbox (+ "Select all" / "Select failed only"). Chỉ người được chọn
 * nhận mã mới; mã của những người còn lại vẫn dùng được.
 */
export function ResendReportDialog({
  checkInId,
  periodLabel,
  onClose,
  onSent,
}: ResendReportDialogProps) {
  const {
    data: recipients,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.reports.recipients(checkInId),
    queryFn: () => clientsApi.getReportRecipients(checkInId),
    staleTime: 0,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [touched, setTouched] = useState(false);

  const failedIds = useMemo(
    () => (recipients ?? []).filter((r) => r.status === 'FAILED').map((r) => r.contactId),
    [recipients],
  );

  // Mặc định chọn sẵn những người gửi lỗi — trường hợp hay gặp nhất. Không chọn
  // sẵn tất cả: gửi lại là đổi mã, chọn nhầm cả danh sách sẽ thu hồi mã của mọi người.
  useEffect(() => {
    if (recipients && !touched) setSelected(new Set(failedIds));
  }, [recipients, failedIds, touched]);

  const sendMutation = useMutation({
    mutationFn: () => clientsApi.sendReport(checkInId, [...selected]),
    onSuccess: (result) => onSent(result),
    onError: (err) => toast.error(toApiError(err).message),
  });

  const toggle = (id: string) => {
    setTouched(true);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    setTouched(true);
    setSelected(new Set((recipients ?? []).map((r) => r.contactId)));
  };
  const selectFailed = () => {
    setTouched(true);
    setSelected(new Set(failedIds));
  };

  const total = recipients?.length ?? 0;
  const allSelected = total > 0 && selected.size === total;

  return (
    // Dialog không cao quá 90% màn hình: mô tả, thanh chọn và nút luôn hiện, chỉ
    // danh sách người nhận cuộn (khách có thể có hàng chục contact).
    <BaseDialog
      title="Resend report"
      onClose={onClose}
      className="flex max-h-[90vh] max-w-xl flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="body-14-medium mb-4 shrink-0 text-neutral-grey-2">
          {periodLabel} report. Only the recipients you select get a new access code — everyone else
          keeps theirs.
        </p>

        {isLoading ? (
          <div className="py-8">
            <BaseLoading message="Loading recipients..." />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="body-14-medium text-neutral-grey-2">Could not load recipients.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="body-14-bold text-brand-green-2 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={selectAll}
                  disabled={allSelected}
                  className="body-14-bold text-brand-green-2 hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-50"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={selectFailed}
                  disabled={failedIds.length === 0}
                  className="body-14-bold text-secondary-red-4 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
                >
                  Select failed only{failedIds.length ? ` (${failedIds.length})` : ''}
                </button>
              </div>
              <span className="body-14-medium text-neutral-grey-3" aria-live="polite">
                {selected.size} of {total} selected
              </span>
            </div>

            {/* ~6 dòng rồi cuộn; thanh cuộn dùng style chung trong globals.css */}
            <ul
              className="max-h-[408px] min-h-0 flex-1 divide-y divide-neutral-grey-6 overflow-y-auto overscroll-contain rounded-xl border border-neutral-grey-6"
              aria-label="Recipients"
            >
              {(recipients ?? []).map((r) => (
                <RecipientRow
                  key={r.contactId}
                  recipient={r}
                  checked={selected.has(r.contactId)}
                  onToggle={() => toggle(r.contactId)}
                />
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 flex shrink-0 justify-end gap-3">
          <BaseButton variant="outline" pill onClick={onClose} disabled={sendMutation.isPending}>
            Cancel
          </BaseButton>
          <BaseButton
            pill
            onClick={() => sendMutation.mutate()}
            disabled={selected.size === 0 || isLoading || isError}
            loading={sendMutation.isPending}
          >
            {selected.size > 0 ? `Resend to ${selected.size}` : 'Resend'}
          </BaseButton>
        </div>
      </div>
    </BaseDialog>
  );
}

function RecipientRow({
  recipient: r,
  checked,
  onToggle,
}: {
  recipient: ReportRecipientDto;
  checked: boolean;
  onToggle: () => void;
}) {
  const tag = STATUS_TAG[r.status] ?? STATUS_TAG.NOT_SENT;
  const id = `recipient-${r.contactId}`;
  const name = `${r.firstName} ${r.lastName}`.trim();

  return (
    <li>
      <label
        htmlFor={id}
        className={cn(
          'flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-neutral-grey-8',
          checked && 'bg-brand-green-2/5',
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand-green-2"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="body-14-bold truncate text-neutral-grey-1">{name || r.email}</span>
            <BaseTag variant={tag.variant}>
              {r.status !== 'NOT_SENT' && r.lastSentAt
                ? `${tag.label} - ${formatDateTime(r.lastSentAt)}`
                : tag.label}
            </BaseTag>
          </div>
          <div className="body-14-medium truncate text-neutral-grey-3">{r.email}</div>
          {r.status === 'FAILED' && r.failureReason && (
            <div className="caption-12-regular mt-1 text-secondary-red-4">{r.failureReason}</div>
          )}
        </div>
      </label>
    </li>
  );
}

export default ResendReportDialog;
