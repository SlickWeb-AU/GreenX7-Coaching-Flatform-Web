'use client';

import { useSearchParams } from 'next/navigation';

import {
  ClientDashboardTab,
  ClientDepartmentsTab,
  ClientHistoryTab,
  useClient,
} from '@/components/clients';

export default function ClientDetailPage() {
  const { clientId, client } = useClient();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <>
      {activeTab === 'dashboard' && (
        <ClientDashboardTab clientId={clientId} participantCount={182} batteryScore={68} />
      )}

      {activeTab === 'departments' && (
        <ClientDepartmentsTab clientId={clientId} departments={client?.departments} />
      )}

      {activeTab === 'check-in-history' && <ClientHistoryTab clientId={clientId} />}
    </>
  );
}
