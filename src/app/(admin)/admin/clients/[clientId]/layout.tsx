'use client';

import { ChevronLeft, Download, Pencil } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  BaseBreadcrumb,
  BaseButton,
  BaseHeader,
  BaseLink,
  BaseLoading,
  BaseTabs,
  BaseTag,
} from '@/components/base';
import { ROUTES } from '@/config/routes';
import { CLIENT_STATUSES, CLIENT_TABS } from '@/constants/clients';
import {
  ClientHeaderProvider,
  ClientProvider,
  useClient,
  useClientHeaderSlot,
} from '@/components/clients';

const TABS = [
  { key: CLIENT_TABS.DASHBOARD, label: 'Dashboard' },
  { key: CLIENT_TABS.DEPARTMENTS, label: 'Departments' },
  { key: CLIENT_TABS.CHECK_IN_HISTORY, label: 'Check-in History' },
];

function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { clientId, client, isLoading } = useClient();
  const { headerSlot } = useClientHeaderSlot();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEdit = pathname?.endsWith('/edit');
  const isDeptDetail = pathname?.includes('/departments/');

  if (isEdit) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <BaseLoading message="Loading client..." fullScreen />;
  }

  if (!client) return null;

  const activeTab = isDeptDetail
    ? CLIENT_TABS.DEPARTMENTS
    : searchParams.get('tab') || CLIENT_TABS.DASHBOARD;

  const handleTabChange = (tabKey: string) => {
    if (isDeptDetail) {
      router.push(`${ROUTES.admin.clientDetail(clientId)}?tab=${tabKey}`);
    } else {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('tab', tabKey);
      router.replace(`?${nextParams.toString()}`, { scroll: false });
    }
  };

  const defaultTitle = (
    <div className="flex items-center gap-2">
      <span>{client.businessName}</span>
      <BaseTag
        variant={client.status === CLIENT_STATUSES.ACTIVE ? 'green' : 'yellow'}
        className="capitalize"
      >
        {client.status?.toLowerCase()}
      </BaseTag>
    </div>
  );

  const defaultActions = (
    <>
      <BaseButton
        variant="secondary"
        size="medium"
        pill
        startIcon={<Download size={16} aria-hidden />}
        onClick={() => {
          window.print();
        }}
      >
        Export PDF
      </BaseButton>

      <BaseButton
        variant="secondary"
        size="medium"
        pill
        startIcon={<Pencil size={16} />}
        onClick={() => router.push(ROUTES.admin.clientEdit(clientId))}
      >
        Edit client
      </BaseButton>
    </>
  );

  const breadcrumbItems = isDeptDetail
    ? [
        { label: 'Clients', href: ROUTES.admin.clients },
        { label: client.businessName, href: ROUTES.admin.clientDetail(clientId) },
        { label: headerSlot?.breadcrumbLabel || 'Department' },
      ]
    : [{ label: 'Clients', href: ROUTES.admin.clients }, { label: client.businessName }];

  return (
    <div className="flex flex-col">
      <BaseBreadcrumb items={breadcrumbItems} />

      <BaseLink
        className="mb-6"
        href={
          isDeptDetail
            ? `${ROUTES.admin.clientDetail(clientId)}?tab=${CLIENT_TABS.DEPARTMENTS}`
            : ROUTES.admin.clients
        }
        startIcon={<ChevronLeft size={20} aria-hidden="true" />}
      >
        {isDeptDetail ? 'Back to Departments' : 'Back to Clients'}
      </BaseLink>

      <BaseHeader
        title={headerSlot?.title ?? defaultTitle}
        actions={headerSlot?.actions ?? defaultActions}
      />

      <BaseTabs className="mb-8" items={TABS} activeKey={activeTab} onChange={handleTabChange} />

      {children}
    </div>
  );
}

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ clientId: string }>();

  return (
    <ClientProvider clientId={params.clientId}>
      <ClientHeaderProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </ClientHeaderProvider>
    </ClientProvider>
  );
}
