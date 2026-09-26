'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';

import { BaseButton, BaseDialog, BaseInput, BaseSelect } from '@/components/base';
import { MONTH_NAMES } from '@/constants';
import { CLIENT_FORM_STATUS_OPTIONS, CLIENT_STATUSES } from '@/constants/clients';
import { clientsApi } from '@/features/admin-clients';
import { queryKeys } from '@/lib/query-client';
import type { ClientDepartment, ClientStatus, CreateDepartmentPayload } from '@/types';

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
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const prevMonthIdx = (now.getMonth() - 1 + 12) % 12;
  const previousMonthName = MONTH_NAMES[prevMonthIdx];

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptStatus, setNewDeptStatus] = useState<ClientStatus>(CLIENT_STATUSES.ACTIVE);
  const [errorMsg, setErrorMsg] = useState('');

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

  const createMutation = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      clientsApi.createDepartment(clientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminClients.departments(clientId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminClients.detail(clientId),
      });
      setIsAddModalOpen(false);
      setNewDeptName('');
      setNewDeptStatus(CLIENT_STATUSES.ACTIVE);
      setErrorMsg('');
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Failed to create department.');
    },
  });

  const handleCreateDepartment = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newDeptName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a department name.');
      return;
    }
    const isDuplicate = (data?.items ?? []).some(
      (d) => d.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setErrorMsg('A department with this name already exists.');
      return;
    }
    setErrorMsg('');
    createMutation.mutate({
      name: trimmed,
      status: newDeptStatus,
    });
  };

  const tableData = data?.items ?? [];

  return (
    <div className={`flex flex-col gap-10 ${className ?? ''}`}>
      {/* Filter & Action Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-none">
        <div className="w-full max-w-xs">
          <BaseInput
            size="medium"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            prefix={<Search size={18} className="text-neutral-grey-3" aria-hidden />}
          />
        </div>

        <BaseButton
          variant="primary"
          size="medium"
          pill
          startIcon={<Plus size={16} aria-hidden />}
          onClick={() => {
            setIsAddModalOpen(true);
            setErrorMsg('');
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

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <BaseDialog
          title="Add Department"
          onClose={() => {
            setIsAddModalOpen(false);
            setErrorMsg('');
            setNewDeptName('');
            setNewDeptStatus(CLIENT_STATUSES.ACTIVE);
          }}
        >
          <form onSubmit={handleCreateDepartment} className="flex flex-col gap-4">
            <BaseInput
              label="Department"
              size="mediumPlus"
              required
              value={newDeptName}
              onChange={(e) => {
                setNewDeptName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter Department"
              error={Boolean(errorMsg)}
              helperText={errorMsg}
            />

            <BaseSelect
              label="Status"
              size="mediumPlus"
              value={newDeptStatus}
              options={CLIENT_FORM_STATUS_OPTIONS}
              onChange={(val) => setNewDeptStatus(val as ClientStatus)}
            />

            <div className="mt-4 flex justify-end gap-3">
              <BaseButton
                variant="secondary"
                size="mediumPlus"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setErrorMsg('');
                }}
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                variant="primary"
                size="mediumPlus"
                loading={createMutation.isPending}
              >
                Save
              </BaseButton>
            </div>
          </form>
        </BaseDialog>
      )}
    </div>
  );
}

export default ClientDepartmentsTab;
