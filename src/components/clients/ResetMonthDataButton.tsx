'use client';

import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { BaseButton } from '@/components/base';
import { useAuth, useConfirm } from '@/components/providers';
import { PERMISSIONS } from '@/config/permissions';
import { clientsApi } from '@/features/admin-clients';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';

interface ResetMonthDataButtonProps {
  clientId: string;
  /** Omit on the Overall dashboard = reset the whole client */
  departmentId?: string;
}

/**
 * "Reset this month's data" — clears test/demo Battery Check submissions for the
 * current month (whole client on Overall, one department on its dashboard).
 * Always asks the BE first so the popup shows the exact number of submissions and
 * whether the reset is still allowed (blocked once the month's report was sent).
 */
export function ResetMonthDataButton({ clientId, departmentId }: ResetMonthDataButtonProps) {
  const { showConfirm } = useConfirm();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { isSuperAdmin, can } = useAuth();
  // Chỉ Super Admin xoá được dữ liệu (BE cũng trả 403 cho Administrator)
  const canReset = isSuperAdmin || can(PERMISSIONS.CHECKIN_RESET);

  const handleClick = async () => {
    setBusy(true);
    try {
      const data = await clientsApi.getCurrentMonthData(clientId, departmentId);
      const scope = `${data.clientName} – ${data.departmentName ?? 'Company-wide (Overall)'}`;

      if (!data.canReset) {
        await showConfirm({
          title: 'Cannot reset data',
          message: data.blockedReason ?? 'This month’s data can no longer be reset.',
          confirmText: 'OK',
          hideCancel: true,
        });
        return;
      }

      if (data.submissionCount === 0) {
        await showConfirm({
          title: 'Nothing to reset',
          message: `There are no Battery Check submissions for ${scope} in ${data.periodLabel}.`,
          confirmText: 'OK',
          hideCancel: true,
        });
        return;
      }

      const confirmed = await showConfirm({
        title: 'Reset this month’s data',
        message: (
          <>
            Delete <strong>{data.submissionCount}</strong> Battery Check submission
            {data.submissionCount === 1 ? '' : 's'} for <strong>{scope}</strong> in{' '}
            <strong>{data.periodLabel}</strong>?
            <br />
            <br />
            This cannot be undone. Devices used for the submissions will be able to take the Battery
            Check again.
          </>
        ),
        confirmText: 'Delete data',
        cancelText: 'Cancel',
        variant: 'danger',
      });
      if (!confirmed) return;

      const result = await clientsApi.resetCurrentMonthData(clientId, departmentId);
      toast.success(
        `Deleted ${result.deleted} submission${result.deleted === 1 ? '' : 's'} for ${result.periodLabel}.`,
      );

      // Every view that shows this month's figures must refetch
      await Promise.all(
        [
          ['admin-client-dashboard', clientId],
          ['admin-dept-dashboard', clientId],
          ['admin-client-departments', clientId],
          ['admin-client-check-ins', clientId],
          queryKeys.adminDashboard.all,
        ].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      );
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!canReset) return null;

  return (
    <BaseButton
      variant="secondary"
      size="medium"
      pill
      loading={busy}
      startIcon={<RotateCcw size={16} aria-hidden />}
      className="text-secondary-red-4"
      onClick={() => void handleClick()}
    >
      Reset this month’s data
    </BaseButton>
  );
}
