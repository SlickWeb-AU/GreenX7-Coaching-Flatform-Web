'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { BaseButton, BaseErrorState, BaseHeader, BaseLoading } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { clientsApi } from '@/features/admin-clients/clients.api';
import { formatBatteryScore, industryName } from '@/features/admin-clients/clients-display';

export default function ClientDetailPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const clientId = params.clientId;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-client', clientId],
    queryFn: () => clientsApi.getById(clientId),
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <BaseHeader title="Client details" />
        <BaseLoading message="Loading client..." fullScreen={false} />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <BaseHeader title="Client details" />
        <BaseErrorState
          title="Unable to load client"
          message={error instanceof Error ? error.message : 'Not found'}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  return (
    <>
      <BaseHeader
        title={data.businessName}
        actions={
          <BaseButton
            variant="secondary"
            pill
            onClick={() => router.push(ROUTES.admin.clientEdit(clientId))}
          >
            Edit client
          </BaseButton>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6">
          <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Overview</h2>
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between">
              <dt className="body-14-medium text-neutral-grey-3">Industry</dt>
              <dd className="body-14-bold text-neutral-grey-1">{industryName(data.industry)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="body-14-medium text-neutral-grey-3">Status</dt>
              <dd className="body-14-bold text-neutral-grey-1">{data.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="body-14-medium text-neutral-grey-3">Schedule</dt>
              <dd className="body-14-bold text-neutral-grey-1">
                Day {data.checkInStartDay}–{data.checkInEndDay} · {data.timezone}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Contacts</h2>
          {data.contacts.length === 0 && (
            <p className="body-14-medium text-neutral-grey-3">No contacts yet.</p>
          )}
          {data.contacts.map((c, i) => (
            <p key={i} className="body-14-medium text-neutral-grey-1">
              {c.firstName} {c.lastName} — {c.email}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-6">
        <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Departments</h2>
        {data.departments.length === 0 && (
          <p className="body-14-medium text-neutral-grey-3">No departments yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {data.departments.map((d) => (
            <Link
              key={d.id}
              href={ROUTES.admin.departmentDetail(clientId, d.id)}
              className="flex items-center justify-between rounded-lg bg-neutral-grey-8 px-3 py-2 hover:bg-neutral-grey-7"
            >
              <span className="body-14-bold text-neutral-grey-1">{d.name}</span>
              <span className="body-14-medium text-brand-green-2">
                {d.batteryScore !== undefined && d.batteryScore !== null
                  ? formatBatteryScore(d.batteryScore)
                  : d.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
