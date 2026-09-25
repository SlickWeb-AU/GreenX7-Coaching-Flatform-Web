'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import {
  BaseButton,
  BaseDialog,
  BaseInput,
  BaseSelect,
  BaseTable,
  type BaseColumn,
} from '@/components/base';
import { SearchIcon, TrendDownIcon, TrendUpIcon } from '@/components/icons';
import { ROUTES } from '@/config/routes';
import { CLIENT_FORM_STATUS_OPTIONS, CLIENT_STATUSES } from '@/constants/clients';
import { clientsApi } from '@/features/admin-clients';
import { formatBatteryScore } from '@/lib/clients';
import type { ClientDepartment, ClientStatus, DepartmentListItemDto } from '@/types';
import { cn } from '@/lib/utils';

export interface ClientDepartmentsTabProps {
  clientId: string;
  departments?: ClientDepartment[];
  className?: string;
}

function DeltaBadge({ change }: { change?: number | null }) {
  if (change === undefined || change === null) {
    return <span className="text-neutral-grey-3">—</span>;
  }
  const isPositive = change >= 0;
  return (
    <span
      className={cn(
        'body-14-bold inline-flex items-center gap-1',
        isPositive ? 'text-secondary-green-4' : 'text-secondary-red-4',
      )}
    >
      {isPositive ? (
        <TrendUpIcon size={16} aria-hidden="true" />
      ) : (
        <TrendDownIcon size={16} aria-hidden="true" />
      )}
      <span>{Math.round(Math.abs(change) * 10) / 10}%</span>
    </span>
  );
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

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptStatus, setNewDeptStatus] = useState<ClientStatus>(CLIENT_STATUSES.ACTIVE);
  const [errorMsg, setErrorMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-client-departments', clientId, page, pageSize, searchTerm, sortBy, sortOrder],
    queryFn: () =>
      clientsApi.getDepartments(clientId, {
        page,
        pageSize,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
        year: 2026,
        month: 7,
      }),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; status: string }) =>
      clientsApi.createDepartment(clientId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-client-departments', clientId] });
      queryClient.invalidateQueries({ queryKey: ['admin-client', clientId] });
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
    if (!newDeptName.trim()) {
      setErrorMsg('Please enter a department name.');
      return;
    }
    setErrorMsg('');
    createMutation.mutate({
      name: newDeptName.trim(),
      status: newDeptStatus,
    });
  };

  const columns: BaseColumn<DepartmentListItemDto | ClientDepartment>[] = [
    {
      key: 'name',
      title: 'Department',
      sorter: 'name',
      render: (_, row) => <span className="body-14-bold text-neutral-grey-1">{row.name}</span>,
    },
    {
      key: 'participantCount',
      title: 'Participants',
      sorter: 'participantCount',
      render: (_, row) => (
        <span className="body-14-medium text-neutral-grey-2">{row.participantCount ?? 0}</span>
      ),
    },
    {
      key: 'score',
      title: 'Score',
      sorter: 'score',
      render: (_, row) => {
        const scoreVal = 'score' in row ? row.score : row.batteryScore;
        return (
          <span className="body-14-bold text-brand-green-2">
            {scoreVal !== undefined && scoreVal !== null ? formatBatteryScore(scoreVal) : '—'}
          </span>
        );
      },
    },
    {
      key: 'vsPrevious',
      title: 'vs. June',
      sorter: 'vsPreviousChange',
      render: (_, row) => {
        const vsPrev = 'vsPreviousChange' in row ? row.vsPreviousChange : null;
        return <DeltaBadge change={vsPrev} />;
      },
    },
    {
      key: 'vsFirstCheck',
      title: 'vs. First Check',
      sorter: 'vsFirstCheckChange',
      render: (_, row) => {
        const vsFirst = 'vsFirstCheckChange' in row ? row.vsFirstCheckChange : null;
        return <DeltaBadge change={vsFirst} />;
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => (
        <Link
          href={ROUTES.admin.departmentDetail(clientId, row.id)}
          className="body-14-bold text-brand-green-2 transition-colors hover:underline"
        >
          View
        </Link>
      ),
    },
  ];

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
            prefix={<SearchIcon size={18} className="text-neutral-grey-3" />}
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
      <BaseTable
        columns={columns}
        data={tableData}
        rowKey="id"
        meta={data?.meta}
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
        loading={isLoading}
        emptyTitle="No departments found"
        emptyDescription="This client does not have any departments yet."
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
              placeholder="Select status"
              size="mediumPlus"
              value={newDeptStatus}
              onChange={setNewDeptStatus}
              options={CLIENT_FORM_STATUS_OPTIONS}
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <BaseButton
                type="button"
                variant="secondary"
                pill
                onClick={() => {
                  setIsAddModalOpen(false);
                  setErrorMsg('');
                }}
              >
                Cancel
              </BaseButton>
              <BaseButton type="submit" variant="primary" pill loading={createMutation.isPending}>
                Create Department
              </BaseButton>
            </div>
          </form>
        </BaseDialog>
      )}
    </div>
  );
}

export default ClientDepartmentsTab;
