'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import {
  BaseButton,
  BaseCard,
  BaseInput,
  BaseSelect,
  BaseSwitch,
  type BaseSelectOption,
} from '@/components/base';
import {
  BrandingIcon,
  ClientDetailsIcon,
  ContactsIcon,
  DepartmentsIcon,
  MonthlyScheduleIcon,
  PlusIcon,
} from '@/components/icons';
import {
  CHECK_IN_DAY_SELECT_OPTIONS,
  CLIENT_COMPANY_SIZE_OPTIONS,
  CLIENT_FORM_STATUS_OPTIONS,
  CLIENT_STATE_OPTIONS,
  CLIENT_STATUSES,
  CLIENT_TIMEZONE_OPTIONS,
} from '@/constants/clients';
import { cn } from '@/lib/utils';

import { ClientLogoUpload } from './ClientLogoUpload';
import {
  clientContactSchema,
  clientDepartmentSchema,
  clientFormSchema,
  type ClientFormValues,
} from '@/validations';
import type { ClientContact, ClientStatus } from '@/types';

const EMPTY_CONTACT: ClientContact = { firstName: '', lastName: '', email: '', role: '' };
const EMPTY_DEPT: { name: string; status: ClientStatus } = {
  name: '',
  status: CLIENT_STATUSES.ACTIVE,
};

export interface EditClientFormProps {
  initial: ClientFormValues;
  onSubmit: (values: ClientFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  industryOptions?: BaseSelectOption<string>[];
  formId?: string;
  showSubmitAction?: boolean;
  submitLabel?: string;
}

export function EditClientForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting = false,
  industryOptions = [],
  formId = 'edit-client-form',
  showSubmitAction = false,
  submitLabel = 'Save changes',
}: EditClientFormProps) {
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactForm, setContactForm] = useState<ClientContact>(EMPTY_CONTACT);
  const [contactError, setContactError] = useState('');

  const [editingDeptIndex, setEditingDeptIndex] = useState<number | null>(null);
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [deptForm, setDeptForm] = useState(EMPTY_DEPT);
  const [deptError, setDeptError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initial,
  });

  const {
    fields: contactFields,
    append: appendContact,
    update: updateContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: 'contacts',
  });

  const {
    fields: departmentFields,
    append: appendDepartment,
    update: updateDepartment,
    remove: removeDepartment,
  } = useFieldArray({
    control,
    name: 'departments',
  });

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const handleAddContact = () => {
    const result = clientContactSchema.safeParse(contactForm);
    if (!result.success) {
      setContactError(result.error.issues[0]?.message || 'Please fill in contact details.');
      return;
    }
    appendContact(result.data);
    setContactForm(EMPTY_CONTACT);
    setIsAddingContact(false);
    setContactError('');
  };

  const handleSaveEditContact = (index: number) => {
    const result = clientContactSchema.safeParse(contactForm);
    if (!result.success) {
      setContactError(result.error.issues[0]?.message || 'Please fill in contact details.');
      return;
    }
    updateContact(index, result.data);
    setEditingContactIndex(null);
    setContactForm(EMPTY_CONTACT);
    setContactError('');
  };

  const handleAddDept = () => {
    const result = clientDepartmentSchema.safeParse(deptForm);
    if (!result.success) {
      setDeptError(result.error.issues[0]?.message || 'Please enter department name.');
      return;
    }
    appendDepartment(result.data);
    setDeptForm(EMPTY_DEPT);
    setIsAddingDept(false);
    setDeptError('');
  };

  const handleSaveEditDept = (index: number) => {
    const result = clientDepartmentSchema.safeParse(deptForm);
    if (!result.success) {
      setDeptError(result.error.issues[0]?.message || 'Please enter department name.');
      return;
    }
    updateDepartment(index, result.data);
    setEditingDeptIndex(null);
    setDeptForm(EMPTY_DEPT);
    setDeptError('');
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* 1. Client details */}
      <BaseCard
        title="Client details"
        prefixIcon={<ClientDetailsIcon label="Client details icon" />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BaseInput
            label="Business name"
            size="mediumPlus"
            required
            placeholder="e.g. Northline Health"
            error={Boolean(errors.businessName)}
            helperText={errors.businessName?.message}
            {...register('businessName')}
          />
          <Controller
            name="industryId"
            control={control}
            render={({ field }) => (
              <BaseSelect
                label="Industry"
                size="mediumPlus"
                value={field.value}
                options={industryOptions}
                onChange={field.onChange}
                placeholder="Select an industry"
                error={Boolean(errors.industryId)}
                helperText={errors.industryId?.message}
              />
            )}
          />
          <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <BaseSelect
                label="Company size"
                size="mediumPlus"
                value={field.value}
                options={CLIENT_COMPANY_SIZE_OPTIONS}
                onChange={field.onChange}
                placeholder="Select a range"
                error={Boolean(errors.companySize)}
                helperText={errors.companySize?.message}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <BaseSelect
                label="State"
                size="mediumPlus"
                value={field.value}
                options={CLIENT_STATE_OPTIONS}
                onChange={field.onChange}
                placeholder="Select a state"
                error={Boolean(errors.state)}
                helperText={errors.state?.message}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <BaseSelect
                label="Status"
                size="mediumPlus"
                value={field.value}
                options={CLIENT_FORM_STATUS_OPTIONS}
                onChange={field.onChange}
                placeholder="Select status"
              />
            )}
          />
        </div>
      </BaseCard>

      {/* 2. Contacts */}
      <BaseCard
        title="Contacts"
        subtitle="Recipients for email notifications"
        prefixIcon={<ContactsIcon label="Contacts icon" />}
        actions={
          <BaseButton
            type="button"
            variant="secondary"
            pill
            onClick={() => {
              setIsAddingContact(true);
              setEditingContactIndex(null);
              setContactForm(EMPTY_CONTACT);
              setContactError('');
            }}
          >
            <PlusIcon aria-hidden /> Add Contact
          </BaseButton>
        }
      >
        {(errors.contacts?.root?.message || contactError) && (
          <p className="body-14-medium mb-3 text-secondary-red-4" role="alert">
            {errors.contacts?.root?.message || contactError}
          </p>
        )}

        <div className="mb-2 hidden flex-1 grid-cols-4 gap-3 pr-[88px] lg:grid">
          <span className="body-14-medium text-neutral-grey-2">First name</span>
          <span className="body-14-medium text-neutral-grey-2">Last name</span>
          <span className="body-14-medium text-neutral-grey-2">Email</span>
          <span className="body-14-medium text-neutral-grey-2">Role</span>
        </div>

        {contactFields.map((field, index) => {
          const isEditing = editingContactIndex === index;

          if (isEditing) {
            return (
              <div key={field.id} className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <BaseInput
                    size="mediumPlus"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                    placeholder="First name"
                  />
                  <BaseInput
                    size="mediumPlus"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                    placeholder="Last name"
                  />
                  <BaseInput
                    size="mediumPlus"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="Email"
                  />
                  <BaseInput
                    size="mediumPlus"
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    placeholder="Role"
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <BaseButton type="button" pill onClick={() => handleSaveEditContact(index)}>
                    Save
                  </BaseButton>
                  <BaseButton
                    type="button"
                    variant="secondary"
                    pill
                    onClick={() => {
                      setEditingContactIndex(null);
                      setContactError('');
                    }}
                  >
                    Cancel
                  </BaseButton>
                </div>
              </div>
            );
          }

          return (
            <div key={field.id} className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="body-16-medium flex h-12 items-center truncate rounded-xl border border-neutral-grey-6/30 bg-neutral-grey-8 px-4 text-neutral-grey-1">
                  {field.firstName}
                </div>
                <div className="body-16-medium flex h-12 items-center truncate rounded-xl border border-neutral-grey-6/30 bg-neutral-grey-8 px-4 text-neutral-grey-1">
                  {field.lastName}
                </div>
                <div className="body-16-medium flex h-12 items-center truncate rounded-xl border border-neutral-grey-6/30 bg-neutral-grey-8 px-4 text-neutral-grey-1">
                  {field.email}
                </div>
                <div className="body-16-medium flex h-12 items-center truncate rounded-xl border border-neutral-grey-6/30 bg-neutral-grey-8 px-4 text-neutral-grey-1">
                  {field.role}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 pl-1">
                <button
                  type="button"
                  title="Edit contact"
                  onClick={() => {
                    setIsAddingContact(false);
                    setEditingContactIndex(index);
                    setContactForm({
                      firstName: field.firstName,
                      lastName: field.lastName,
                      email: field.email,
                      role: field.role,
                    });
                    setContactError('');
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-grey-3 transition-colors hover:bg-neutral-grey-8 hover:text-neutral-grey-1"
                >
                  <Pencil size={18} aria-hidden />
                </button>
                <button
                  type="button"
                  title="Delete contact"
                  onClick={() => removeContact(index)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-grey-3 transition-colors hover:bg-secondary-red-1 hover:text-secondary-red-4"
                >
                  <Trash2 size={18} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}

        {isAddingContact && (
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <BaseInput
                size="mediumPlus"
                value={contactForm.firstName}
                onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                placeholder="First name"
              />
              <BaseInput
                size="mediumPlus"
                value={contactForm.lastName}
                onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                placeholder="Last name"
              />
              <BaseInput
                size="mediumPlus"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Email"
              />
              <BaseInput
                size="mediumPlus"
                value={contactForm.role}
                onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                placeholder="Role"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <BaseButton type="button" pill onClick={handleAddContact}>
                Save
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                pill
                onClick={() => {
                  setIsAddingContact(false);
                  setContactError('');
                }}
              >
                Cancel
              </BaseButton>
            </div>
          </div>
        )}
      </BaseCard>

      {/* 3. Branding */}
      <BaseCard
        title="Branding"
        subtitle="Used on the Battery Check, live dashboard and presentation."
        prefixIcon={<BrandingIcon label="Branding icon" />}
      >
        <ClientLogoUpload />
      </BaseCard>

      {/* 4. Departments */}
      <BaseCard
        title="Departments"
        prefixIcon={<DepartmentsIcon label="Departments icon" />}
        actions={
          <BaseButton
            type="button"
            variant="secondary"
            pill
            onClick={() => {
              setIsAddingDept(true);
              setEditingDeptIndex(null);
              setDeptForm(EMPTY_DEPT);
              setDeptError('');
            }}
          >
            <PlusIcon aria-hidden /> Add Department
          </BaseButton>
        }
      >
        {deptError && (
          <p className="body-14-medium mb-3 text-secondary-red-4" role="alert">
            {deptError}
          </p>
        )}

        {departmentFields.map((field, index) => {
          const isEditing = editingDeptIndex === index;

          if (isEditing) {
            return (
              <div key={field.id} className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <BaseInput
                    size="mediumPlus"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder="Department name"
                  />
                  <BaseSelect
                    size="mediumPlus"
                    placeholder="Select status"
                    value={deptForm.status}
                    options={CLIENT_FORM_STATUS_OPTIONS}
                    onChange={(val) => setDeptForm({ ...deptForm, status: val })}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <BaseButton type="button" pill onClick={() => handleSaveEditDept(index)}>
                    Save
                  </BaseButton>
                  <BaseButton
                    type="button"
                    variant="secondary"
                    pill
                    onClick={() => {
                      setEditingDeptIndex(null);
                      setDeptError('');
                    }}
                  >
                    Cancel
                  </BaseButton>
                  <button
                    type="button"
                    title="Remove department"
                    onClick={() => {
                      removeDepartment(index);
                      setEditingDeptIndex(null);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-grey-3 hover:text-secondary-red-4"
                  >
                    <Trash2 size={18} aria-hidden />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={field.id}
              className="mb-2.5 flex items-center justify-between rounded-xl border border-neutral-grey-6 bg-white px-4 py-3.5 transition-colors hover:border-neutral-grey-5"
            >
              <div className="flex items-center gap-3">
                <span className="body-14-bold text-neutral-grey-1">{field.name}</span>
                <span
                  className={cn(
                    'body-12-bold inline-flex items-center rounded-full px-2.5 py-0.5',
                    field.status?.toUpperCase() === CLIENT_STATUSES.ACTIVE
                      ? 'bg-secondary-green-2 text-secondary-green-4'
                      : 'border border-neutral-grey-6 bg-neutral-grey-8 text-neutral-grey-3',
                  )}
                >
                  {field.status?.toUpperCase() === CLIENT_STATUSES.ACTIVE ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                type="button"
                title="Edit department"
                onClick={() => {
                  setIsAddingDept(false);
                  setEditingDeptIndex(index);
                  setDeptForm({ name: field.name, status: field.status || CLIENT_STATUSES.ACTIVE });
                  setDeptError('');
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-grey-3 transition-colors hover:bg-neutral-grey-8 hover:text-neutral-grey-1"
              >
                <Pencil size={18} aria-hidden />
              </button>
            </div>
          );
        })}

        {isAddingDept && (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <BaseInput
                size="mediumPlus"
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                placeholder="Department name"
              />
              <BaseSelect
                size="mediumPlus"
                placeholder="Select status"
                value={deptForm.status}
                options={CLIENT_FORM_STATUS_OPTIONS}
                onChange={(val) => setDeptForm({ ...deptForm, status: val })}
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <BaseButton type="button" pill onClick={handleAddDept}>
                Save
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                pill
                onClick={() => {
                  setIsAddingDept(false);
                  setDeptError('');
                }}
              >
                Cancel
              </BaseButton>
            </div>
          </div>
        )}
      </BaseCard>

      {/* 5. Monthly schedule */}
      <BaseCard
        title="Monthly schedule"
        subtitle="Choose when contacts receive their monthly check-in"
        prefixIcon={<MonthlyScheduleIcon label="Monthly schedule icon" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="checkInStartDay"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  label="Start day"
                  size="mediumPlus"
                  value={field.value !== undefined ? String(field.value) : ''}
                  options={CHECK_IN_DAY_SELECT_OPTIONS}
                  onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder="Select date"
                  error={Boolean(errors.checkInStartDay)}
                  helperText={errors.checkInStartDay?.message}
                />
              )}
            />
            <Controller
              name="checkInEndDay"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  label="End day"
                  size="mediumPlus"
                  value={field.value !== undefined ? String(field.value) : ''}
                  options={CHECK_IN_DAY_SELECT_OPTIONS}
                  onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  placeholder="Select date"
                  error={Boolean(errors.checkInEndDay)}
                  helperText={errors.checkInEndDay?.message}
                />
              )}
            />
          </div>
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <BaseSelect
                label="Timezone"
                size="mediumPlus"
                value={field.value}
                options={CLIENT_TIMEZONE_OPTIONS}
                onChange={field.onChange}
                placeholder="Select timezone"
                error={Boolean(errors.timezone)}
                helperText={errors.timezone?.message}
              />
            )}
          />
          <Controller
            name="autoSendReport"
            control={control}
            render={({ field }) => (
              <BaseSwitch
                className="mt-5"
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Auto-send report"
                description="Automatically email the report to contacts when this period closes."
              />
            )}
          />
        </div>
      </BaseCard>

      {showSubmitAction && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <BaseButton
              type="button"
              variant="secondary"
              size="medium"
              pill
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancel
            </BaseButton>
          )}
          <BaseButton
            type="submit"
            size="medium"
            pill
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitLabel}
          </BaseButton>
        </div>
      )}
    </form>
  );
}
