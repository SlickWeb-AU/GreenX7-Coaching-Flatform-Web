'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { BaseButton, BaseDialog, BaseHeader, BaseIconButton, BaseInput } from '@/components/base';

import { useConfirm } from '@/components/providers';
import { AdminsTable } from '@/components/settings';
import { settingsApi } from '@/features/admin-settings';
import { toApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';
import { inviteSchema, industryNameSchema } from '@/validations';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { showConfirm } = useConfirm();
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
  const [industryName, setIndustryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const invalidateIndustries = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.industries.all });
  };
  const invalidateAdmins = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
  };

  const createIndustry = useMutation({
    mutationFn: settingsApi.createIndustry,
    onSuccess: () => {
      toast.success('Industry added successfully');
      setShowIndustry(false);
      setIndustryName('');
      setEditingId(null);
      invalidateIndustries();
    },
    onError: (e: unknown) => setFormError(toApiError(e).message),
  });
  const updateIndustry = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      settingsApi.updateIndustry(id, name),
    onSuccess: () => {
      toast.success('Industry updated successfully');
      setShowIndustry(false);
      setIndustryName('');
      setEditingId(null);
      invalidateIndustries();
    },
    onError: (e: unknown) => setFormError(toApiError(e).message),
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
      setInviteSuccess(true);
      setTimeout(() => {
        setShowInvite(false);
        setInviteSuccess(false);
        setInviteName('');
        setInviteEmail('');
      }, 1500);
      invalidateAdmins();
    },
    onError: (e: unknown) => setFormError(toApiError(e).message),
  });

  const industries = industriesQuery.data ?? [];
  const admins = adminsQuery.data ?? [];

  const submitIndustry = (e: FormEvent) => {
    e.preventDefault();
    const parsed = industryNameSchema.safeParse(industryName);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please enter an industry name.');
      return;
    }
    const trimmed = industryName.trim();
    const isDuplicate = industries.some(
      (ind) => ind.id !== editingId && ind.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      setFormError('An industry with this name already exists.');
      return;
    }
    setFormError('');
    if (editingId) updateIndustry.mutate({ id: editingId, name: trimmed });
    else createIndustry.mutate(trimmed);
  };

  const submitInvite = (e: FormEvent) => {
    e.preventDefault();
    const parsed = inviteSchema.safeParse({ name: inviteName, email: inviteEmail });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please enter name and a valid email.');
      return;
    }
    const trimmedEmail = inviteEmail.trim();
    const isDuplicate = admins.some(
      (a) => a.email.trim().toLowerCase() === trimmedEmail.toLowerCase(),
    );
    if (isDuplicate) {
      setFormError('An administrator with this email address already exists.');
      return;
    }
    setFormError('');
    inviteAdmin.mutate({ name: inviteName.trim(), email: trimmedEmail });
  };

  return (
    <>
      <BaseHeader title="Settings" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-grey-7 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="heading-20-bold text-neutral-grey-1">Industry management</h2>
            <BaseButton
              size="small"
              variant="secondary"
              pill
              startIcon={<Plus size={16} aria-hidden />}
              onClick={() => {
                setEditingId(null);
                setIndustryName('');
                setFormError('');
                setShowIndustry(true);
              }}
            >
              Add Industry
            </BaseButton>
          </div>
          {industriesQuery.isLoading && industries.length === 0 ? (
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-neutral-grey-7" />
              ))}
            </div>
          ) : industries.length === 0 ? (
            <p className="body-14-medium text-neutral-grey-3">No industries yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              {industries.map((ind) => (
                <div key={ind.id} className="flex items-center gap-2">
                  <BaseInput
                    value={ind.name}
                    readOnly
                    aria-label={`Industry ${ind.name}`}
                    className="min-w-0 flex-1"
                  />
                  <BaseIconButton
                    aria-label={`Rename ${ind.name}`}
                    size={40}
                    icon={<Pencil size={18} aria-hidden />}
                    className="text-neutral-grey-3 hover:text-brand-green-2"
                    onClick={() => {
                      setEditingId(ind.id);
                      setIndustryName(ind.name);
                      setFormError('');
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-2xl border border-neutral-grey-7 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-neutral-grey-1">Access &amp; roles</h2>
              <p className="body-14-medium mt-0.5 text-neutral-grey-2">
                All accounts currently hold the Administrator role.
              </p>
            </div>
            <BaseButton
              variant="secondary"
              pill
              size="small"
              startIcon={<UserPlus size={16} aria-hidden />}
              onClick={() => {
                setFormError('');
                setShowInvite(true);
              }}
            >
              Invite Administrator
            </BaseButton>
          </div>
          <AdminsTable admins={admins} loading={adminsQuery.isLoading || adminsQuery.isFetching} />
        </div>
      </div>

      {showIndustry && (
        <BaseDialog
          title={editingId ? 'Rename industry' : 'Add industry'}
          onClose={() => setShowIndustry(false)}
        >
          <form onSubmit={submitIndustry} noValidate>
            <BaseInput
              label="Industry name"
              placeholder="Enter industry name"
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              error={Boolean(formError)}
              helperText={formError}
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

      {showInvite && (
        <BaseDialog title="Invite administrator" onClose={() => setShowInvite(false)}>
          {inviteSuccess ? (
            <p className="body-14-bold text-secondary-green-4">Invitation sent.</p>
          ) : (
            <form onSubmit={submitInvite} noValidate>
              <div className="flex flex-col gap-3">
                <BaseInput
                  label="Name"
                  placeholder="Enter name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
                <BaseInput
                  label="Email"
                  placeholder="Enter email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  error={Boolean(formError)}
                  helperText={formError}
                />
              </div>
              <BaseButton type="submit" fullWidth className="mt-4" loading={inviteAdmin.isPending}>
                Send invite
              </BaseButton>
            </form>
          )}
        </BaseDialog>
      )}
    </>
  );
}
