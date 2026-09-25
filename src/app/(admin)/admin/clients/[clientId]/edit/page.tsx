'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { toast } from 'sonner';

import { BaseBreadcrumb, BaseButton, BaseHeader, BaseLoading } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { EditClientForm } from '@/components/clients';
import { clientsApi } from '@/features/admin-clients';
import { settingsApi } from '@/features/admin-settings';
import { queryKeys } from '@/lib/query-client';
import type { UpdateClientPayload } from '@/types';

export default function EditClientPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const clientId = params.clientId;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminClients.detail(clientId),
    queryFn: () => clientsApi.getById(clientId),
    retry: false,
  });
  const industriesQuery = useQuery({
    queryKey: queryKeys.industries.all,
    queryFn: settingsApi.getIndustries,
    retry: false,
  });
  const currentIndustryId = typeof data?.industry === 'object' ? data.industry.id : undefined;
  const industryOptions = (industriesQuery.data ?? [])
    .filter((industry) => industry.isActive || industry.id === currentIndustryId)
    .map((industry) => ({ value: industry.id, label: industry.name }));

  const initialValues = useMemo(() => {
    if (!data) return undefined;
    return {
      businessName: data.businessName,
      industryId: typeof data.industry === 'string' ? data.industry : (data.industry?.id ?? ''),
      companySize: data.companySize,
      state: data.state,
      status: data.status,
      contacts: data.contacts ?? [],
      departments: (data.departments ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        status: d.status,
      })),
      checkInStartDay: data.checkInStartDay,
      checkInEndDay: data.checkInEndDay,
      timezone: data.timezone ?? 'Australia/Sydney',
      autoSendReport: data.autoSendReport,
    };
  }, [data]);

  const update = useMutation({
    mutationFn: (payload: UpdateClientPayload) => clientsApi.update(clientId, payload),
    onSuccess: () => {
      toast.success('Client updated successfully');
      router.push(ROUTES.admin.clientDetail(clientId));
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : 'Update client failed'),
  });

  if (isLoading) {
    return <BaseLoading message="Loading client..." fullScreen />;
  }

  if (!data || !initialValues) return null;

  return (
    <>
      <BaseBreadcrumb
        items={[
          { label: 'Clients', href: ROUTES.admin.clients },
          { label: data.businessName, href: ROUTES.admin.clientDetail(clientId) },
          { label: 'Manage client' },
        ]}
      />
      <BaseHeader
        title="Manage client"
        actions={
          <div className="flex items-center gap-2">
            <BaseButton
              type="button"
              variant="secondary"
              size="medium"
              pill
              disabled={update.isPending}
              onClick={() => router.push(ROUTES.admin.clientDetail(clientId))}
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              form="edit-client-form"
              size="medium"
              pill
              loading={update.isPending}
              disabled={update.isPending}
            >
              Save changes
            </BaseButton>
          </div>
        }
      />
      <EditClientForm
        key={clientId}
        formId="edit-client-form"
        initial={initialValues}
        industryOptions={industryOptions}
        showSubmitAction={false}
        onCancel={() => router.push(ROUTES.admin.clientDetail(clientId))}
        isSubmitting={update.isPending}
        onSubmit={(values) => {
          update.mutate({
            businessName: values.businessName,
            industryId: values.industryId,
            companySize: values.companySize,
            state: values.state,
            status: values.status,
            checkInStartDay: values.checkInStartDay,
            checkInEndDay: values.checkInEndDay,
            autoSendReport: values.autoSendReport,
          });
        }}
      />
    </>
  );
}
