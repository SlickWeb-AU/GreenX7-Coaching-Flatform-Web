'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toApiError } from '@/lib/api-error';
import { downloadFile } from '@/lib/download';

type DownloadArgs = Parameters<typeof downloadFile>;

/** Nút "Export PDF": trạng thái đang tải + báo lỗi bằng toast */
export function useExportPdf() {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async (url: DownloadArgs[0], opts: DownloadArgs[1]) => {
    setExporting(true);
    try {
      await downloadFile(url, opts);
    } catch (e) {
      toast.error(toApiError(e).message);
    } finally {
      setExporting(false);
    }
  }, []);

  return { exporting, exportPdf };
}
