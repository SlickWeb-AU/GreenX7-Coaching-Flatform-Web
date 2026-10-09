'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { toast } from 'sonner';

import { BaseBreadcrumb, BaseButton, BaseHeader, BaseLoading } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { EditClientForm } from '@/components/clients';
import { clientsApi } from '@/features/admin-clients';
import { settingsApi } from '@/features/admin-settings';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';
import type { ClientFormValues } from '@/validations';

export default function EditClientPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const clientId = params.clientId;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminClients.detail(clientId),
    queryFn: () => clientsApi.getById(clientId),
    retry: false,
  });

  const scrollTo = searchParams.get('scrollTo') ?? undefined;
  const autoAddDepartment = searchParams.get('addDepartment') === '1';
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
        isCompanyWide: d.isCompanyWide,
      })),
      checkInStartDay: data.checkInStartDay,
      checkInEndDay: data.checkInEndDay,
      autoSendReport: data.autoSendReport,
    };
  }, [data]);

  const update = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      const { darkLogo, whiteLogo, ...payload } = values;
      if (darkLogo || whiteLogo) {
        await clientsApi.uploadClientLogos(clientId, { darkLogo, whiteLogo });
      }

      const updated = await clientsApi.update(clientId, {
        businessName: payload.businessName,
        industryId: payload.industryId,
        companySize: payload.companySize,
        state: payload.state,
        status: payload.status,
        checkInStartDay: payload.checkInStartDay,
        checkInEndDay: payload.checkInEndDay,
        autoSendReport: payload.autoSendReport,
      });

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.detail(clientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.all });
      toast.success('Client updated successfully');
      router.push(ROUTES.admin.clientDetail(clientId));
    },
    onError: (error: unknown) => toast.error(toApiError(error).message),
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
              medium16Bold
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
        clientId={clientId}
        formId="edit-client-form"
        initial={initialValues}
        darkLogoUrl={data.darkLogoUrl}
        whiteLogoUrl={data.whiteLogoUrl}
        industryOptions={industryOptions}
        showSubmitAction={false}
        scrollTo={scrollTo}
        autoAddDepartment={autoAddDepartment}
        onCancel={() => router.push(ROUTES.admin.clientDetail(clientId))}
        isSubmitting={update.isPending}
        onSubmit={(values) => {
          update.mutate(values);
        }}
      />
    </>
  );
}
