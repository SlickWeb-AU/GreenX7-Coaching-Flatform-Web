'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { BaseBreadcrumb, BaseButton, BaseHeader } from '@/components/base';
import { ROUTES } from '@/config/routes';

import { CreateClientForm } from '@/components/clients';
import { clientsApi } from '@/features/admin-clients';
import { settingsApi } from '@/features/admin-settings';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const industriesQuery = useQuery({
    queryKey: queryKeys.industries.all,
    queryFn: settingsApi.getIndustries,
    retry: false,
  });
  const industryOptions = (industriesQuery.data ?? [])
    .filter((industry) => industry.isActive)
    .map((industry) => ({ value: industry.id, label: industry.name }));

  const create = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.all });
      toast.success('Client created successfully');
      router.push(ROUTES.admin.clients);
    },
    onError: (error: unknown) => toast.error(toApiError(error).message),
  });

  return (
    <>
      <BaseBreadcrumb
        items={[{ label: 'Clients', href: ROUTES.admin.clients }, { label: 'Add client' }]}
      />
      <BaseHeader
        title="Add client"
        actions={
          <div className="flex items-center gap-2">
            <BaseButton
              type="button"
              variant="secondary"
              size="medium"
              pill
              disabled={create.isPending}
              onClick={() => router.push(ROUTES.admin.clients)}
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              form="client-form"
              size="medium"
              pill
              loading={create.isPending}
              disabled={create.isPending}
            >
              Create client
            </BaseButton>
          </div>
        }
      />
      <CreateClientForm
        formId="client-form"
        industryOptions={industryOptions}
        onCancel={() => router.push(ROUTES.admin.clients)}
        onSubmit={(values) => create.mutate(values)}
      />
    </>
  );
}
