import { PageHeader } from '@/components/shared/page-header';
import { ProfileForm } from '@/features/auth/components/profile-form';

export const metadata = { title: 'Tài khoản của tôi' };

/** Route này được middleware bảo vệ (xem PROTECTED_ROUTE_RULES) */
export default function ProfilePage() {
  return (
    <div className="container space-y-6 py-10">
      <PageHeader title="Tài khoản của tôi" description="Quản lý thông tin cá nhân và bảo mật" />
      <ProfileForm />
    </div>
  );
}
