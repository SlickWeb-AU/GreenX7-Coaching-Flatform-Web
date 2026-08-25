'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Thay bằng Sentry.captureException(error) khi tích hợp APM
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold">Đã có lỗi xảy ra</h1>
      <p className="max-w-md text-muted-foreground">
        Hệ thống gặp sự cố ngoài dự kiến. Vui lòng thử lại, nếu vẫn lỗi hãy liên hệ bộ phận kỹ thuật.
      </p>
      {error.digest && <code className="text-xs text-muted-foreground">Mã lỗi: {error.digest}</code>}
      <Button onClick={reset}>Thử lại</Button>
    </main>
  );
}
