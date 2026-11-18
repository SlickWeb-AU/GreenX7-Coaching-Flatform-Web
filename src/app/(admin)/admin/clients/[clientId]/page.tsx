'use client';

import { useSearchParams } from 'next/navigation';

import {
  ClientDashboardTab,
  ClientDepartmentsTab,
  ClientHistoryTab,
  useClient,
} from '@/components/clients';
import { CLIENT_TABS } from '@/constants/clients';

export default function ClientDetailPage() {
  const { clientId, client } = useClient();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || CLIENT_TABS.DASHBOARD;

  return (
    <>
      {activeTab === CLIENT_TABS.DASHBOARD && <ClientDashboardTab clientId={clientId} />}

      {activeTab === CLIENT_TABS.DEPARTMENTS && (
        <ClientDepartmentsTab clientId={clientId} departments={client?.departments} />
      )}

      {activeTab === CLIENT_TABS.CHECK_IN_HISTORY && <ClientHistoryTab clientId={clientId} />}
    </>
  );
}
