'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { BaseButton, BaseInput } from '@/components/base';
import { ROUTES } from '@/config/routes';
import { MONTH_NAMES } from '@/constants';
import { clientsApi } from '@/features/admin-clients';
import { useDebounced } from '@/hooks/useDebounced';
import { queryKeys } from '@/lib/query-client';
import type { ClientDepartment } from '@/types';

import { ClientDepartmentsTable } from './ClientDepartmentsTable';

export interface ClientDepartmentsTabProps {
  clientId: string;
  departments?: ClientDepartment[];
  className?: string;
}

export function ClientDepartmentsTab({
  clientId,
  departments: _departments = [],
  className,
}: ClientDepartmentsTabProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounced(searchInput.trim());
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const prevMonthIdx = (now.getMonth() - 1 + 12) % 12;
  const previousMonthName = MONTH_NAMES[prevMonthIdx];

  // Modal State — removed: creation now happens inline on the Edit client page.

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.adminClients.departments(
      clientId,
      page,
      pageSize,
      searchTerm,
      sortBy,
      sortOrder,
      currentYear,
      currentMonth,
    ),
    queryFn: () =>
      clientsApi.getDepartmentsOverview(clientId, {
        page,
        pageSize,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
        year: currentYear,
        month: currentMonth,
      }),
    retry: false,
  });

  const tableData = data?.items ?? [];

  return (
    <div className={`flex flex-col gap-10 ${className ?? ''}`}>
      {/* Filter & Action Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-none">
        <div className="w-full max-w-xs">
          <BaseInput
            size="medium"
            placeholder="Search departments..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            prefix={<Search size={18} className="text-neutral-grey-3" aria-hidden />}
            clearable
            onClear={() => {
              setSearchInput('');
              setPage(1);
            }}
            variant="secondary"
          />
        </div>

        <BaseButton
          variant="primary"
          size="medium"
          pill
          startIcon={<Plus size={24} aria-hidden />}
          onClick={() => {
            router.push(
              `${ROUTES.admin.clientEdit(clientId)}?scrollTo=departments&addDepartment=1`,
              {
                scroll: false,
              },
            );
          }}
        >
          Add Department
        </BaseButton>
      </div>

      {/* Table */}
      <ClientDepartmentsTable
        clientId={clientId}
        data={tableData}
        meta={data?.meta}
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={(p) => setPage(p)}
        sortField={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => {
          if (sortBy === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
          } else {
            setSortBy(field);
            setSortOrder('asc');
          }
        }}
        loading={isLoading || isFetching}
        previousMonthName={previousMonthName}
      />
    </div>
  );
}

export default ClientDepartmentsTab;
