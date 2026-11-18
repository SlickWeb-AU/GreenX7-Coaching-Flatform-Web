import { redirect } from 'next/navigation';

/**
 * Email báo cáo gửi trước bản sửa BE mang link `/battery/report/<token>` (BE từng
 * ghép từ CHECKIN_BASE_URL). Giữ route này để những email đó vẫn mở được.
 */
export default async function LegacyReportTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/report/password?token=${encodeURIComponent(token)}`);
}
