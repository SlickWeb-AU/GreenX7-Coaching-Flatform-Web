'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { BaseErrorState, BaseHeader, BaseLoading } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { ClientForm } from '@/features/admin-clients/ClientForm';
import { clientsApi } from '@/features/admin-clients/clients.api';

export default function EditClientPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const clientId = params.clientId;
  const [submitError, setSubmitError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-client', clientId],
    queryFn: () => clientsApi.getById(clientId),
    retry: false,
  });

  const update = useMutation({
    mutationFn: (payload: Parameters<typeof clientsApi.update>[1]) =>
      clientsApi.update(clientId, payload),
    onSuccess: () => router.push(ROUTES.admin.clientDetail(clientId)),
    onError: (e: unknown) => setSubmitError(e instanceof Error ? e.message : 'Update failed'),
  });

  if (isLoading) {
    return (
      <>
        <BaseHeader title="Edit client" />
        <BaseLoading message="Loading client..." fullScreen={false} />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <BaseHeader title="Edit client" />
        <BaseErrorState
          title="Unable to load client"
          message={error instanceof Error ? error.message : 'Not found'}
        />
      </>
    );
  }

  return (
    <>
      <BaseHeader title={`Edit ${data.businessName}`} />
      <ClientForm
        initial={{
          businessName: data.businessName,
          industry: typeof data.industry === 'string' ? data.industry : data.industry.name,
          status: data.status,
          contacts: data.contacts,
          departments: data.departments.map((d) => ({ name: d.name, status: d.status })),
          checkInStartDay: data.checkInStartDay,
          checkInEndDay: data.checkInEndDay,
          timezone: data.timezone,
          autoSendReport: data.autoSendReport,
        }}
        submitLabel="Save changes"
        isSubmitting={update.isPending}
        submitError={submitError}
        onSubmit={(v) => update.mutate(v)}
      />
    </>
  );
}
