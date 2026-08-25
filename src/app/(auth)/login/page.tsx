import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = { title: 'Đăng nhập' };

/**
 * Đọc query param ở SERVER rồi truyền xuống form.
 * Cách này tránh phải bọc useSearchParams trong <Suspense> và giữ form đơn giản.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;

  return (
    <div className="space-y-4">
      {reason === 'session-expired' && (
        <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
          Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
        </div>
      )}
      {/* Chỉ chấp nhận đường dẫn nội bộ để tránh open redirect qua ?next=https://evil.com */}
      <LoginForm next={next?.startsWith('/') && !next.startsWith('//') ? next : undefined} />
    </div>
  );
}
