'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { BaseButton, BaseDialog, BaseHeader, BaseIconButton, BaseInput } from '@/components/base';
import { useAuth, useConfirm } from '@/components/providers';
import { AdminsTable } from '@/components/settings';
import { PERMISSIONS } from '@/config/permissions';
import { settingsApi } from '@/features/admin-settings';
import { USER_STATUSES, type UserStatus } from '@/types/auth';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';
import type { AdminUser } from '@/types';
import {
  INDUSTRY_NAME_MAX_LENGTH,
  industryFormSchema,
  inviteSchema,
  type IndustryFormValues,
  type InviteValues,
} from '@/validations';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, isSuperAdmin, can } = useAuth();
  const { showConfirm } = useConfirm();

  const canManage = isSuperAdmin || can(PERMISSIONS.ADMIN_MANAGE);

  const industriesQuery = useQuery({
    queryKey: queryKeys.industries.all,
    queryFn: settingsApi.getIndustries,
    retry: false,
  });
  const adminsQuery = useQuery({
    queryKey: queryKeys.admins.all,
    queryFn: settingsApi.getAdmins,
    retry: false,
  });

  const [showIndustry, setShowIndustry] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [busyAdminId, setBusyAdminId] = useState<string | null>(null);

  const invalidateIndustries = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.industries.all });
  const invalidateAdmins = () => queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
  const trackBusy = (id: string) => setBusyAdminId(id);
  const clearBusy = () => setBusyAdminId(null);

  const industryForm = useForm<IndustryFormValues>({
    resolver: zodResolver(industryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const inviteForm = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const createIndustry = useMutation({
    mutationFn: settingsApi.createIndustry,
    onSuccess: () => {
      toast.success('Industry added successfully');
      setShowIndustry(false);
      setEditingId(null);
      industryForm.reset();
      invalidateIndustries();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const updateIndustry = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      settingsApi.updateIndustry(id, name),
    onSuccess: () => {
      toast.success('Industry updated successfully');
      setShowIndustry(false);
      setEditingId(null);
      industryForm.reset();
      invalidateIndustries();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const deleteIndustry = useMutation({
    mutationFn: settingsApi.deleteIndustry,
    onSuccess: () => {
      toast.success('Industry deleted successfully');
      invalidateIndustries();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const inviteAdmin = useMutation({
    mutationFn: settingsApi.inviteAdmin,
    onSuccess: () => {
      toast.success('Invitation sent.');
      setShowInvite(false);
      inviteForm.reset();
      invalidateAdmins();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const updateAdminStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      settingsApi.updateAdminUser(id, { status }),
    onMutate: ({ id }) => trackBusy(id),
    onSettled: clearBusy,
    onSuccess: (_, variables) => {
      const actionText = variables.status === USER_STATUSES.ACTIVE ? 'activated' : 'deactivated';
      toast.success(`Administrator ${actionText} successfully`);
      invalidateAdmins();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: (id: string) => settingsApi.deleteAdminUser(id),
    onMutate: trackBusy,
    onSettled: clearBusy,
    onSuccess: () => {
      toast.success('Administrator deleted successfully');
      invalidateAdmins();
    },
    onError: (e: unknown) => {
      toast.error(toApiError(e).message);
    },
  });

  const industries = industriesQuery.data ?? [];
  const admins = adminsQuery.data ?? [];

  const onSubmitIndustry = (values: IndustryFormValues) => {
    const trimmed = values.name.trim();
    const isDuplicate = industries.some(
      (ind) => ind.id !== editingId && ind.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error('An industry with this name already exists.');
      return;
    }
    if (editingId) updateIndustry.mutate({ id: editingId, name: trimmed });
    else createIndustry.mutate(trimmed);
  };

  const onSubmitInvite = (values: InviteValues) => {
    const trimmedEmail = values.email.trim();
    const isDuplicate = admins.some(
      (a) => a.email.trim().toLowerCase() === trimmedEmail.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error('An administrator with this email address already exists.');
      return;
    }
    inviteAdmin.mutate({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: trimmedEmail,
    });
  };

  const handleToggleAdminStatus = async (admin: AdminUser) => {
    const isCurrentlyActive = admin.status === USER_STATUSES.ACTIVE;
    const targetStatus: UserStatus = isCurrentlyActive
      ? USER_STATUSES.INACTIVE
      : USER_STATUSES.ACTIVE;
    const actionTitle = isCurrentlyActive ? 'Deactivate administrator' : 'Activate administrator';
    const actionVerb = isCurrentlyActive ? 'deactivate' : 'activate';
    const confirmText = isCurrentlyActive ? 'Deactivate' : 'Activate';

    const confirmed = await showConfirm({
      title: actionTitle,
      message: `Are you sure you want to ${actionVerb} "${admin.name || admin.email}"?`,
      confirmText,
      cancelText: 'Cancel',
      variant: isCurrentlyActive ? 'danger' : 'primary',
    });

    if (confirmed) {
      updateAdminStatus.mutate({ id: admin.id, status: targetStatus });
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const confirmed = await showConfirm({
      title: 'Delete administrator',
      message: `Are you sure you want to delete "${admin.name || admin.email}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      deleteAdmin.mutate(admin.id);
    }
  };

  return (
    <>
      <BaseHeader title="Settings" />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="heading-20-bold text-neutral-grey-1">Industry management</h2>
            {canManage && (
              <BaseButton
                size="small"
                variant="secondary"
                pill
                startIcon={<Plus size={16} aria-hidden />}
                onClick={() => {
                  setEditingId(null);
                  industryForm.reset({ name: '' });
                  setShowIndustry(true);
                }}
              >
                Add Industry
              </BaseButton>
            )}
          </div>
          {industriesQuery.isLoading && industries.length === 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-neutral-grey-7" />
              ))}
            </div>
          ) : industries.length === 0 ? (
            <p className="body-14-medium text-neutral-grey-3">No industries yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
              {industries.map((ind) => (
                <div key={ind.id} className="flex items-center gap-2">
                  <BaseInput
                    value={ind.name}
                    readOnly
                    aria-label={`Industry ${ind.name}`}
                    className="min-w-0 flex-1"
                  />
                  {canManage && (
                    <>
                      <BaseIconButton
                        aria-label={`Rename ${ind.name}`}
                        size={40}
                        icon={<Pencil size={18} aria-hidden />}
                        className="text-neutral-grey-3 hover:text-brand-green-2"
                        onClick={() => {
                          setEditingId(ind.id);
                          industryForm.reset({ name: ind.name });
                          setShowIndustry(true);
                        }}
                      />
                      <BaseIconButton
                        aria-label={`Delete ${ind.name}`}
                        size={40}
                        icon={<Trash2 size={18} aria-hidden />}
                        className="text-neutral-grey-3 hover:text-secondary-red-4"
                        onClick={async () => {
                          const confirmed = await showConfirm({
                            title: 'Delete industry',
                            message: `Are you sure you want to delete "${ind.name}"? This action cannot be undone.`,
                            confirmText: 'Delete',
                            cancelText: 'Cancel',
                            variant: 'danger',
                          });
                          if (confirmed) {
                            deleteIndustry.mutate(ind.id);
                          }
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-2xl bg-white p-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h2 className="body-20-bold text-neutral-grey-1">Access &amp; roles</h2>
              <p className="body-14-medium mt-0.5 text-neutral-grey-2">
                Manage administrators and account permissions.
              </p>
            </div>
            {canManage && (
              <BaseButton
                variant="secondary"
                pill
                size="small"
                startIcon={<UserPlus size={16} aria-hidden />}
                onClick={() => {
                  inviteForm.reset();
                  setShowInvite(true);
                }}
              >
                Invite Administrator
              </BaseButton>
            )}
          </div>
          <AdminsTable
            admins={admins}
            loading={adminsQuery.isLoading || adminsQuery.isFetching}
            currentUserId={user?.id}
            canManage={canManage}
            onToggleStatus={handleToggleAdminStatus}
            onDelete={handleDeleteAdmin}
            busyId={busyAdminId}
          />
        </div>
      </div>

      {showIndustry && canManage && (
        <BaseDialog
          title={editingId ? 'Rename industry' : 'Add industry'}
          onClose={() => {
            setShowIndustry(false);
            setEditingId(null);
            industryForm.reset();
          }}
        >
          <form onSubmit={industryForm.handleSubmit(onSubmitIndustry)} noValidate>
            <BaseInput
              label="Industry name"
              placeholder="Enter industry name"
              maxLength={INDUSTRY_NAME_MAX_LENGTH}
              error={Boolean(industryForm.formState.errors.name)}
              helperText={industryForm.formState.errors.name?.message}
              {...industryForm.register('name')}
            />
            <BaseButton
              type="submit"
              fullWidth
              className="mt-4"
              loading={createIndustry.isPending || updateIndustry.isPending}
            >
              Save
            </BaseButton>
          </form>
        </BaseDialog>
      )}

      {showInvite && canManage && (
        <BaseDialog
          title="Invite administrator"
          onClose={() => {
            setShowInvite(false);
            inviteForm.reset();
          }}
        >
          <form onSubmit={inviteForm.handleSubmit(onSubmitInvite)} noValidate>
            <div className="flex flex-col gap-3">
              <BaseInput
                label="First name"
                placeholder="Enter first name"
                error={Boolean(inviteForm.formState.errors.firstName)}
                helperText={inviteForm.formState.errors.firstName?.message}
                {...inviteForm.register('firstName')}
              />
              <BaseInput
                label="Last name"
                placeholder="Enter last name"
                error={Boolean(inviteForm.formState.errors.lastName)}
                helperText={inviteForm.formState.errors.lastName?.message}
                {...inviteForm.register('lastName')}
              />
              <BaseInput
                label="Email"
                placeholder="Enter email"
                type="email"
                error={Boolean(inviteForm.formState.errors.email)}
                helperText={inviteForm.formState.errors.email?.message}
                {...inviteForm.register('email')}
              />
            </div>
            <BaseButton type="submit" fullWidth className="mt-4" loading={inviteAdmin.isPending}>
              Send invite
            </BaseButton>
          </form>
        </BaseDialog>
      )}
    </>
  );
}
