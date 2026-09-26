'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import {
  BaseButton,
  BaseCard,
  BaseDatePicker,
  BaseHelperText,
  BaseIconButton,
  BaseInput,
  BaseSelect,
  BaseSwitch,
  BaseTag,
  formatDayOfMonth,
  type BaseSelectOption,
} from '@/components/base';
import {
  CLIENT_CHECK_IN_DAY_MAX,
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
import { useEditableRows } from '@/features/admin-clients';
import {
  clientFormSchema,
  type ClientContactFormValue,
  type ClientDepartmentFormValue,
  type ClientFormValues,
} from '@/validations';
import { cn } from '@/lib/utils';

export const DEFAULT_CONTACT_ROW: ClientContactFormValue = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
};

export const DEFAULT_DEPARTMENT_ROW: ClientDepartmentFormValue = {
  name: '',
  status: CLIENT_STATUSES.ACTIVE,
};

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
  const contactsEdit = useEditableRows<ClientContactFormValue>();
  const departmentsEdit = useEditableRows<ClientDepartmentFormValue>();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      businessName: '',
      industryId: '',
      companySize: '',
      state: '',
      status: CLIENT_STATUSES.ACTIVE,
      contacts: [{ ...DEFAULT_CONTACT_ROW }],
      departments: [{ ...DEFAULT_DEPARTMENT_ROW }],
      checkInStartDay: undefined,
      checkInEndDay: undefined,
      autoSendReport: true,
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
    update: updateContact,
  } = useFieldArray({
    control,
    name: 'contacts',
  });

  const {
    fields: departmentFields,
    append: appendDepartment,
    remove: removeDepartment,
    update: updateDepartment,
  } = useFieldArray({
    control,
    name: 'departments',
  });

  // Contacts handlers
  const handleSaveContact = async (index: number, id: string) => {
    const isValid = await trigger(`contacts.${index}`);
    if (!isValid) return;

    const contacts = getValues('contacts');
    const currentEmail = contacts[index]?.email?.trim().toLowerCase();
    const isDuplicate = contacts.some(
      (c, i) => i !== index && c.email?.trim().toLowerCase() === currentEmail,
    );

    if (isDuplicate) {
      setError(`contacts.${index}.email`, {
        type: 'manual',
        message: 'A contact with this email address already exists.',
      });
      return;
    }

    clearErrors(`contacts.${index}`);

    const savedVal = getValues(`contacts.${index}`);
    updateContact(index, savedVal);
    contactsEdit.markSaved(id);
  };

  const handleCancelContact = (index: number, id: string) => {
    const draft = contactsEdit.snapshots[id];

    clearErrors(`contacts.${index}`);

    if (draft) {
      setValue(`contacts.${index}`, draft);
      updateContact(index, draft);
      contactsEdit.markSaved(id);
    } else if (contactFields.length > 1) {
      removeContact(index);
      contactsEdit.drop(id);
    } else {
      setValue(`contacts.${index}`, { ...DEFAULT_CONTACT_ROW });
      updateContact(index, { ...DEFAULT_CONTACT_ROW });
      contactsEdit.markSaved(id);
    }
  };

  const handleStartEditContact = (index: number, id: string) => {
    contactsEdit.startEdit(id, { ...getValues(`contacts.${index}`) });
    clearErrors(`contacts.${index}`);
  };

  const handleRemoveContact = (index: number, id: string) => {
    removeContact(index);
    contactsEdit.drop(id);
    clearErrors(`contacts.${index}`);
  };

  const handleAddContactClick = () => {
    appendContact({ ...DEFAULT_CONTACT_ROW });
  };

  // Departments handlers
  const handleSaveDept = async (index: number, id: string) => {
    const isValid = await trigger(`departments.${index}`);
    if (!isValid) return;

    const departments = getValues('departments');
    const currentName = departments[index]?.name?.trim().toLowerCase();
    const isDuplicate = departments.some(
      (d, i) => i !== index && d.name?.trim().toLowerCase() === currentName,
    );

    if (isDuplicate) {
      setError(`departments.${index}.name`, {
        type: 'manual',
        message: 'A department with this name already exists.',
      });
      return;
    }

    clearErrors(`departments.${index}`);

    const savedVal = getValues(`departments.${index}`);
    updateDepartment(index, savedVal);
    departmentsEdit.markSaved(id);
  };

  const handleCancelDept = (index: number, id: string) => {
    const draft = departmentsEdit.snapshots[id];

    clearErrors(`departments.${index}`);

    if (draft) {
      setValue(`departments.${index}`, draft);
      updateDepartment(index, draft);
      departmentsEdit.markSaved(id);
    } else if (departmentFields.length > 1) {
      removeDepartment(index);
      departmentsEdit.drop(id);
    } else {
      setValue(`departments.${index}`, { ...DEFAULT_DEPARTMENT_ROW });
      updateDepartment(index, { ...DEFAULT_DEPARTMENT_ROW });
      departmentsEdit.markSaved(id);
    }
  };

  const handleStartEditDept = (index: number, id: string) => {
    departmentsEdit.startEdit(id, { ...getValues(`departments.${index}`) });
    clearErrors(`departments.${index}`);
  };

  const handleRemoveDept = (index: number, id: string) => {
    removeDepartment(index);
    departmentsEdit.drop(id);
    clearErrors(`departments.${index}`);
  };

  const handleAddDeptClick = () => {
    appendDepartment({ ...DEFAULT_DEPARTMENT_ROW });
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
            startIcon={<Plus size={16} aria-hidden />}
            onClick={handleAddContactClick}
          >
            Add Contact
          </BaseButton>
        }
      >
        <div className="flex flex-col gap-3">
          {contactFields.map((field, index) => {
            const isDraft = !contactsEdit.isSaved(field.id);

            return (
              <div key={field.id} className="flex flex-col gap-3 xl:flex-row xl:items-start">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <BaseInput
                    label={index === 0 ? 'First name' : undefined}
                    size="mediumPlus"
                    variant="secondary"
                    required
                    readOnly={!isDraft}
                    placeholder="Enter first name"
                    error={Boolean(errors.contacts?.[index]?.firstName)}
                    helperText={errors.contacts?.[index]?.firstName?.message}
                    {...register(`contacts.${index}.firstName`)}
                  />
                  <BaseInput
                    label={index === 0 ? 'Last name' : undefined}
                    size="mediumPlus"
                    variant="secondary"
                    required
                    readOnly={!isDraft}
                    placeholder="Enter last name"
                    error={Boolean(errors.contacts?.[index]?.lastName)}
                    helperText={errors.contacts?.[index]?.lastName?.message}
                    {...register(`contacts.${index}.lastName`)}
                  />
                  <BaseInput
                    label={index === 0 ? 'Email' : undefined}
                    type="email"
                    size="mediumPlus"
                    variant="secondary"
                    required
                    readOnly={!isDraft}
                    placeholder="Enter email address"
                    error={Boolean(errors.contacts?.[index]?.email)}
                    helperText={errors.contacts?.[index]?.email?.message}
                    {...register(`contacts.${index}.email`)}
                  />
                  <BaseInput
                    label={index === 0 ? 'Role' : undefined}
                    size="mediumPlus"
                    variant="secondary"
                    required
                    readOnly={!isDraft}
                    placeholder="Enter role"
                    error={Boolean(errors.contacts?.[index]?.role)}
                    helperText={errors.contacts?.[index]?.role?.message}
                    {...register(`contacts.${index}.role`)}
                  />
                </div>
                <div
                  className={cn(
                    'flex h-12 w-[160px] shrink-0 items-center justify-evenly',
                    index === 0 && 'xl:mt-[28px]',
                  )}
                >
                  {!isDraft ? (
                    <>
                      <BaseIconButton
                        aria-label="Edit contact"
                        size={40}
                        icon={<Pencil size={20} aria-hidden />}
                        className="text-neutral-grey-3 hover:text-neutral-grey-1"
                        onClick={() => handleStartEditContact(index, field.id)}
                      />
                      <BaseIconButton
                        aria-label="Delete contact"
                        size={40}
                        icon={<Trash2 size={20} aria-hidden />}
                        disabled={contactFields.length <= 1}
                        className="text-neutral-grey-3 hover:text-secondary-red-4"
                        onClick={() => handleRemoveContact(index, field.id)}
                      />
                    </>
                  ) : (
                    <>
                      <BaseButton
                        type="button"
                        pill
                        onClick={() => handleSaveContact(index, field.id)}
                      >
                        Save
                      </BaseButton>
                      <BaseButton
                        type="button"
                        variant="secondary"
                        pill
                        onClick={() => handleCancelContact(index, field.id)}
                      >
                        Cancel
                      </BaseButton>
                    </>
                  )}
                </div>
              </div>
            );
          })}
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
            startIcon={<Plus size={16} aria-hidden />}
            onClick={handleAddDeptClick}
          >
            Add Department
          </BaseButton>
        }
      >
        <div className="flex flex-col gap-3">
          {departmentFields.map((field, index) => {
            const isDraft = !departmentsEdit.isSaved(field.id);
            const currentName = getValues(`departments.${index}.name`) || field.name;
            const currentStatus =
              (getValues(`departments.${index}.status`) || field.status)?.toUpperCase() ||
              CLIENT_STATUSES.ACTIVE;
            const deptErrorMessage = errors.departments?.[index]?.name?.message;

            return (
              <div key={field.id} className="flex flex-col gap-3 xl:flex-row xl:items-start">
                {!isDraft ? (
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        'flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-neutral-grey-6 bg-white px-3',
                        deptErrorMessage && 'border-secondary-red-4',
                      )}
                    >
                      <span className="body-16-medium text-neutral-grey-1">{currentName}</span>
                      <BaseTag
                        variant={
                          currentStatus === CLIENT_STATUSES.ACTIVE ? 'green' : 'green-neutral'
                        }
                      >
                        {currentStatus === CLIENT_STATUSES.ACTIVE ? 'Active' : 'Inactive'}
                      </BaseTag>
                    </div>
                    <BaseHelperText
                      error={Boolean(deptErrorMessage)}
                      helperText={deptErrorMessage}
                    />
                  </div>
                ) : (
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                    <BaseInput
                      size="mediumPlus"
                      variant="secondary"
                      required
                      placeholder="Enter Department"
                      error={Boolean(errors.departments?.[index]?.name)}
                      helperText={errors.departments?.[index]?.name?.message}
                      {...register(`departments.${index}.name`)}
                    />
                    <Controller
                      name={`departments.${index}.status`}
                      control={control}
                      render={({ field: selectField }) => (
                        <BaseSelect
                          size="mediumPlus"
                          variant="secondary"
                          value={selectField.value}
                          options={CLIENT_FORM_STATUS_OPTIONS}
                          onChange={selectField.onChange}
                          placeholder="Select status"
                        />
                      )}
                    />
                  </div>
                )}
                <div className="flex h-12 w-[160px] shrink-0 items-center justify-evenly">
                  {!isDraft ? (
                    <>
                      <BaseIconButton
                        aria-label="Edit department"
                        size={40}
                        icon={<Pencil size={20} aria-hidden />}
                        className="text-neutral-grey-3 hover:text-neutral-grey-1"
                        onClick={() => handleStartEditDept(index, field.id)}
                      />
                      <BaseIconButton
                        aria-label="Delete department"
                        size={40}
                        icon={<Trash2 size={20} aria-hidden />}
                        disabled={departmentFields.length <= 1}
                        className="text-neutral-grey-3 hover:text-secondary-red-4"
                        onClick={() => handleRemoveDept(index, field.id)}
                      />
                    </>
                  ) : (
                    <>
                      <BaseButton
                        type="button"
                        pill
                        onClick={() => handleSaveDept(index, field.id)}
                      >
                        Save
                      </BaseButton>
                      <BaseButton
                        type="button"
                        variant="secondary"
                        pill
                        onClick={() => handleCancelDept(index, field.id)}
                      >
                        Cancel
                      </BaseButton>
                    </>
                  )}
                </div>
              </div>
            );
          })}
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
                  maxDay={CLIENT_CHECK_IN_DAY_MAX}
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
                  maxDay={CLIENT_CHECK_IN_DAY_MAX}
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
