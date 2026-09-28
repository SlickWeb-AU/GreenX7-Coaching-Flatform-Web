'use client';

import { useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BasePillTabs, type BasePillTabItem } from '@/components/base';
import { useClient } from '@/components/clients/ClientContext';
import { OVERALL_FILTER_VALUE } from '@/constants/clients';
import { clientsApi } from '@/features/admin-clients';
import { queryKeys } from '@/lib/query-client';
import { cn } from '@/lib/utils';
import type { DepartmentListItemDto } from '@/types';

import { ClientCheckInHistoryTable } from './ClientCheckInHistoryTable';

export interface ClientHistoryTabProps {
  clientId: string;
  departments?: DepartmentListItemDto[] | { id: string; name: string }[];
  className?: string;
}

export function ClientHistoryTab({
  clientId,
  departments: initialDepartments,
  className,
}: ClientHistoryTabProps) {
  const { client } = useClient();
  const [selectedDepartment, setSelectedDepartment] = useState<string>(OVERALL_FILTER_VALUE);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const departmentTabs: BasePillTabItem[] = useMemo(() => {
    const list = client?.departments ?? initialDepartments ?? [];
    return [
      { key: OVERALL_FILTER_VALUE, label: 'Overall' },
      ...list.map((dept) => ({
        key: dept.id,
        label: dept.name,
      })),
    ];
  }, [client?.departments, initialDepartments]);

  const departmentId = selectedDepartment === OVERALL_FILTER_VALUE ? undefined : selectedDepartment;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminClients.checkIns(clientId, departmentId, page, pageSize),
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (departmentId) {
        params.set('departmentId', departmentId);
      }
      return clientsApi.getCheckIns(clientId, params.toString());
    },
    placeholderData: keepPreviousData,
    retry: false,
    enabled: Boolean(clientId),
  });

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Sub-tab Department Selector */}
      <div>
        <BasePillTabs
          items={departmentTabs}
          activeKey={selectedDepartment}
          onChange={(key) => {
            setSelectedDepartment(key);
            setPage(1);
          }}
        />
      </div>

      {/* Table with integrated loading, pagination and empty state */}
      <ClientCheckInHistoryTable
        clientId={clientId}
        data={data?.items ?? []}
        loading={isLoading || isFetching}
        meta={data?.meta}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ClientHistoryTab;
