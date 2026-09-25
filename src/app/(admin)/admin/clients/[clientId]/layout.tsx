'use client';

import { ChevronLeft, Pencil } from 'lucide-react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  BaseBreadcrumb,
  BaseButton,
  BaseHeader,
  BaseLink,
  BaseLoading,
  BaseTabs,
  BaseTag,
} from '@/components/base';
import { ExportIcon } from '@/components/icons';
import { ROUTES } from '@/config/routes';
import {
  ClientHeaderProvider,
  ClientProvider,
  useClient,
  useClientHeaderSlot,
} from '@/components/clients';

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'departments', label: 'Departments' },
  { key: 'check-in-history', label: 'Check-in History' },
];

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
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

  const activeTab = isDeptDetail ? 'departments' : searchParams.get('tab') || 'dashboard';

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
        variant={client.status?.toLowerCase() === 'active' ? 'green' : 'yellow'}
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
        startIcon={<ExportIcon size={16} />}
        onClick={() => {
          // Future PDF export
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
      {/* 1. Breadcrumb */}
      <BaseBreadcrumb items={breadcrumbItems} />

      {/* 2. Back Link */}
      <BaseLink
        className="mb-6"
        href={
          isDeptDetail
            ? `${ROUTES.admin.clientDetail(clientId)}?tab=departments`
            : ROUTES.admin.clients
        }
        startIcon={<ChevronLeft size={20} aria-hidden="true" />}
      >
        {isDeptDetail ? 'Back to Departments' : 'Back to Clients'}
      </BaseLink>

      {/* 3. Base Header */}
      <BaseHeader
        title={headerSlot?.title ?? defaultTitle}
        actions={headerSlot?.actions ?? defaultActions}
      />

      {/* 4. Tab Navigation Bar */}
      <BaseTabs className="mb-8" items={TABS} activeKey={activeTab} onChange={handleTabChange} />

      {/* 5. Content */}
      {children}
    </div>
  );
}

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ clientId: string }>();

  return (
    <ClientProvider clientId={params.clientId}>
      <ClientHeaderProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </ClientHeaderProvider>
    </ClientProvider>
  );
}
