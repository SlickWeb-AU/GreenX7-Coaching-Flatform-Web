'use client';

import { ChevronLeft, Download, Pencil, Tv } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { useDepartmentShareLinks } from '@/features/admin-clients';
import { useExportPdf } from '@/hooks/useExportPdf';
import { normalizeUrl } from '@/lib/utils';
import { ShareBatteryCheckPopover } from './ShareBatteryCheckPopover';
import { useClient } from './ClientContext';
import { useClientHeaderSlot } from './ClientHeaderProvider';

const TABS = [
  { key: CLIENT_TABS.DASHBOARD, label: 'Dashboard' },
  { key: CLIENT_TABS.DEPARTMENTS, label: 'Departments' },
  { key: CLIENT_TABS.CHECK_IN_HISTORY, label: 'Check-in History' },
];

export function ClientLayoutContent({ children }: { children: ReactNode }) {
  const { clientId, client, isLoading } = useClient();
  const { headerSlot } = useClientHeaderSlot();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEdit = pathname?.endsWith('/edit');
  const isDeptDetail = pathname?.includes('/departments/');
  const { exporting, exportPdf } = useExportPdf();
  const now = new Date();
  // Cùng kỳ với tab Dashboard đang hiện (ClientDashboardTab ghi lên URL)
  const exportMonth = searchParams.get('month') || String(now.getMonth() + 1);
  const exportYear = searchParams.get('year') || String(now.getFullYear());
  const companyWideDeptId = client?.departments?.find((d) => d.isCompanyWide)?.id ?? '';

  // Hook first — before any early return (Rules of Hooks).
  // `enabled` inside guards the fetch until ids exist.
  const { data: companyWideShareLinks, isLoading: isShareLinksLoading } = useDepartmentShareLinks(
    clientId,
    companyWideDeptId,
  );

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

  const companyWideDept = client.departments?.find((d) => d.isCompanyWide);
  const presentationUrl = companyWideShareLinks?.presentationUrl || '';

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
        loading={exporting}
        onClick={() =>
          exportPdf(`/exports/clients/${clientId}/dashboard.pdf`, {
            params: { month: exportMonth, year: exportYear, trendMonths: 6 },
            fallbackName: `${client?.businessName ?? 'Client'} ${exportMonth}-${exportYear}.pdf`,
          })
        }
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

      <BaseButton
        variant="secondary"
        size="medium"
        pill
        disabled={!presentationUrl}
        startIcon={<Tv size={16} />}
        onClick={() => {
          window.open(normalizeUrl(presentationUrl), '_blank', 'noopener,noreferrer');
        }}
      >
        Launch presentation
      </BaseButton>

      {companyWideDept && (
        <ShareBatteryCheckPopover
          departmentName={client.businessName ?? 'Company'}
          shareLinks={companyWideShareLinks}
          isLoading={isShareLinksLoading}
        />
      )}
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
