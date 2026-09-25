'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import {
  BaseButton,
  BaseCard,
  BaseDatePicker,
  BaseInput,
  BaseSelect,
  BaseSwitch,
  formatDayOfMonth,
  type BaseSelectOption,
} from '@/components/base';
import { PlusIcon } from '@/components/icons';
import {
  CLIENT_COMPANY_SIZE_OPTIONS,
  CLIENT_FORM_STATUS_OPTIONS,
  CLIENT_STATE_OPTIONS,
  CLIENT_STATUSES,
} from '@/constants/clients';

import {
  BrandingIcon,
  ClientDetailsIcon,
  ContactsIcon,
  DepartmentsIcon,
  MonthlyScheduleIcon,
} from '@/components/icons';
import { ClientLogoUpload } from './ClientLogoUpload';
import {
  clientContactSchema,
  clientDepartmentSchema,
  clientFormSchema,
  type ClientFormValues,
} from '@/validations';
import type { ClientContact, ClientStatus } from '@/types';

const EMPTY_CONTACT: ClientContact = { firstName: '', lastName: '', email: '', role: '' };

export interface CreateClientFormProps {
  onSubmit: (values: ClientFormValues) => void;
  onCancel?: () => void;
  industryOptions?: BaseSelectOption<string>[];
  formId?: string;
}

export function CreateClientForm({
  onSubmit,
  onCancel: _onCancel,
  industryOptions = [],
  formId = 'client-form',
}: CreateClientFormProps) {
  const [newContact, setNewContact] = useState<ClientContact>(EMPTY_CONTACT);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptStatus, setNewDeptStatus] = useState<ClientStatus>(CLIENT_STATUSES.ACTIVE);
  const [sectionError, setSectionError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      businessName: '',
      industryId: '',
      companySize: '',
      state: '',
      status: CLIENT_STATUSES.ACTIVE,
      contacts: [],
      departments: [],
      checkInStartDay: undefined,
      checkInEndDay: undefined,
      timezone: 'Australia/Sydney',
      autoSendReport: true,
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: 'contacts',
  });

  const {
    fields: departmentFields,
    append: appendDepartment,
    remove: removeDepartment,
  } = useFieldArray({
    control,
    name: 'departments',
  });

  const handleSaveContact = () => {
    const result = clientContactSchema.safeParse(newContact);
    if (!result.success) {
      setSectionError(result.error.issues[0]?.message || 'Please enter a valid email address.');
      return;
    }
    appendContact({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      role: result.data.role,
    });
    setNewContact(EMPTY_CONTACT);
    setSectionError('');
  };

  const handleSaveDepartment = () => {
    if (!newDeptName.trim()) {
      setSectionError('Please enter a department name.');
      return;
    }
    const result = clientDepartmentSchema.safeParse({
      name: newDeptName.trim(),
      status: newDeptStatus,
    });
    if (!result.success) {
      setSectionError(result.error.issues[0]?.message || 'Please enter a department name.');
      return;
    }
    appendDepartment(result.data);
    setNewDeptName('');
    setNewDeptStatus(CLIENT_STATUSES.ACTIVE);
    setSectionError('');
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* 1. Client Details */}
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
              setNewContact(EMPTY_CONTACT);
              setSectionError('');
            }}
          >
            <PlusIcon aria-hidden /> Add Contact
          </BaseButton>
        }
      >
        {errors.contacts?.root?.message && (
          <p className="body-14-medium mb-3 text-secondary-red-4" role="alert">
            {errors.contacts.root.message}
          </p>
        )}
        {contactFields.map((field, index) => (
          <div
            key={field.id}
            className="mb-2 flex items-center justify-between rounded-lg bg-neutral-grey-8 px-3 py-2"
          >
            <span className="body-14-medium text-neutral-grey-1">
              {field.firstName} {field.lastName} — {field.email}
            </span>
            <button
              type="button"
              onClick={() => removeContact(index)}
              className="text-sm font-bold text-secondary-red-4"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-end">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <BaseInput
              label="First name"
              size="mediumPlus"
              variant="secondary"
              required
              value={newContact.firstName}
              onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
              placeholder="Enter first name"
            />
            <BaseInput
              label="Last name"
              size="mediumPlus"
              variant="secondary"
              required
              value={newContact.lastName}
              onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
              placeholder="Enter last name"
            />
            <BaseInput
              label="Email"
              type="email"
              size="mediumPlus"
              variant="secondary"
              required
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="Enter email address"
            />
            <BaseInput
              label="Role"
              size="mediumPlus"
              variant="secondary"
              required
              value={newContact.role}
              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
              placeholder="Enter role"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {sectionError && (
              <p className="body-14-medium text-secondary-red-4" role="alert">
                {sectionError}
              </p>
            )}
            <BaseButton type="button" pill onClick={handleSaveContact}>
              Save
            </BaseButton>
            <BaseButton
              type="button"
              variant="secondary"
              pill
              onClick={() => {
                setNewContact(EMPTY_CONTACT);
                setSectionError('');
              }}
            >
              Cancel
            </BaseButton>
          </div>
        </div>
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
              setNewDeptName('');
              setNewDeptStatus(CLIENT_STATUSES.ACTIVE);
              setSectionError('');
            }}
          >
            <PlusIcon aria-hidden /> Add Department
          </BaseButton>
        }
      >
        {departmentFields.map((field, index) => (
          <div
            key={field.id}
            className="mb-2 flex items-center justify-between rounded-lg bg-neutral-grey-8 px-3 py-2"
          >
            <span className="body-14-medium text-neutral-grey-1">
              {field.name} — {field.status}
            </span>
            <button
              type="button"
              onClick={() => removeDepartment(index)}
              className="text-sm font-bold text-secondary-red-4"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-end">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 md:grid-cols-2">
            <BaseInput
              label="Department"
              size="mediumPlus"
              variant="secondary"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Enter Department"
            />
            <BaseSelect
              label="Status"
              size="mediumPlus"
              variant="secondary"
              value={newDeptStatus}
              options={CLIENT_FORM_STATUS_OPTIONS}
              onChange={setNewDeptStatus}
              placeholder="Select status"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <BaseButton type="button" pill onClick={handleSaveDepartment}>
              Save
            </BaseButton>
            <BaseButton
              type="button"
              variant="secondary"
              pill
              onClick={() => {
                setNewDeptName('');
                setNewDeptStatus(CLIENT_STATUSES.ACTIVE);
                setSectionError('');
              }}
            >
              Cancel
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      {/* 5. Monthly Schedule */}
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
                <BaseDatePicker
                  label="Start day"
                  size="mediumPlus"
                  format={formatDayOfMonth}
                  value={field.value}
                  onChange={field.onChange}
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
                <BaseDatePicker
                  label="End day"
                  size="mediumPlus"
                  format={formatDayOfMonth}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                  error={Boolean(errors.checkInEndDay)}
                  helperText={errors.checkInEndDay?.message}
                />
              )}
            />
          </div>
        </div>
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
      </BaseCard>
    </form>
  );
}
