import { redirect } from 'next/navigation';

/**
 * Link trong email báo cáo có dạng `/report/<token>` (BE dựng ở reports.service).
 * Chuyển sang màn nhập mật khẩu, token đi theo query như các màn report khác.
 */
export default async function ReportTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/report/password?token=${encodeURIComponent(token)}`);
}
