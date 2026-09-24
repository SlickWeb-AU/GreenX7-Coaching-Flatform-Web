'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { BaseErrorState, BaseHeader, BaseLoading } from '@/components/base';
import { get } from '@/lib/axios';

import { formatBatteryScore } from '@/features/admin-clients/clients-display';

interface DepartmentDetail {
  id: string;
  name: string;
  status: string;
  participantCount: number;
  batteryScore: number | null;
}

export default function DepartmentDetailPage() {
  const params = useParams<{ clientId: string; deptId: string }>();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-department', params.clientId, params.deptId],
    queryFn: () =>
      get<DepartmentDetail>(`/clients/${params.clientId}/departments/${params.deptId}`),
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <BaseHeader title="Department" />
        <BaseLoading message="Loading department..." fullScreen={false} />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <BaseHeader title="Department" />
        <BaseErrorState
          title="Unable to load department"
          message={error instanceof Error ? error.message : 'Not found'}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <>
      <BaseHeader title={data.name} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6">
          <p className="body-14-medium text-neutral-grey-3">Battery score</p>
          <p className="heading-28-bold text-brand-green-2">
            {formatBatteryScore(data.batteryScore)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="body-14-medium text-neutral-grey-3">Participants</p>
          <p className="heading-28-bold text-neutral-grey-1">{data.participantCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <p className="body-14-medium text-neutral-grey-3">Status</p>
          <p className="heading-28-bold text-neutral-grey-1">{data.status}</p>
        </div>
      </div>
    </>
  );
}
