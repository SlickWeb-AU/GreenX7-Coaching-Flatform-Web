import { PageHeader } from '@/components/shared/page-header';
import { DashboardOverview } from '@/features/dashboard/dashboard-overview';

export const metadata = { title: 'Tổng quan' };

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Tổng quan" description="Chỉ số nhanh của hệ thống GreenX7" />
      <DashboardOverview />
    </>
  );
}
