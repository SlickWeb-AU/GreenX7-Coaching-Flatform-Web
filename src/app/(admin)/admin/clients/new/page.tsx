'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BaseHeader } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { ClientForm } from '@/features/admin-clients/ClientForm';
import { clientsApi } from '@/features/admin-clients/clients.api';

export default function NewClientPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const create = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => router.push(ROUTES.admin.clients),
    onError: (e: unknown) => setSubmitError(e instanceof Error ? e.message : 'Create failed'),
  });

  return (
    <>
      <BaseHeader title="Add client" />
      <ClientForm
        initial={{
          businessName: '',
          industry: '',
          status: 'ACTIVE',
          contacts: [],
          departments: [],
          checkInStartDay: 1,
          checkInEndDay: 20,
          timezone: 'Australia/Sydney',
          autoSendReport: true,
        }}
        submitLabel="Create client"
        isSubmitting={create.isPending}
        submitError={submitError}
        onSubmit={(v) => create.mutate(v)}
      />
    </>
  );
}
