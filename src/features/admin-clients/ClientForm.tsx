'use client';

import { useState, type FormEvent } from 'react';

import { BaseButton, BaseInput, BaseSelect } from '@/components/base';

import type { ClientContact, ClientFormValues } from './types';

const EMPTY_CONTACT: ClientContact = { firstName: '', lastName: '', email: '', role: '' };

export function ClientForm({
  initial,
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit,
}: {
  initial: ClientFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  submitError: string;
  onSubmit: (values: ClientFormValues) => void;
}) {
  const [businessName, setBusinessName] = useState(initial.businessName);
  const [industry, setIndustry] = useState(initial.industry ?? '');
  const [status, setStatus] = useState(initial.status ?? 'ACTIVE');
  const [contacts, setContacts] = useState<ClientContact[]>(initial.contacts ?? []);
  const [newContact, setNewContact] = useState<ClientContact>(EMPTY_CONTACT);
  const [departments, setDepartments] = useState<{ name: string; status: string }[]>(
    initial.departments ?? [],
  );
  const [newDeptName, setNewDeptName] = useState('');
  const [startDay, setStartDay] = useState(initial.checkInStartDay);
  const [endDay, setEndDay] = useState(initial.checkInEndDay);
  const [timezone, setTimezone] = useState(initial.timezone);
  const [formError, setFormError] = useState('');
  const error = formError || submitError;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setFormError('Please enter the business name.');
      return;
    }
    setFormError('');
    onSubmit({
      businessName: businessName.trim(),
      industry: industry || undefined,
      status,
      contacts,
      departments,
      checkInStartDay: startDay,
      checkInEndDay: endDay,
      timezone,
      autoSendReport: initial.autoSendReport ?? true,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-secondary-red-4 bg-secondary-red-2 px-4 py-3">
          <p className="body-14-bold text-secondary-red-4">{error}</p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6">
        <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Business details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BaseInput
            label="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            placeholder="Acme Pty Ltd"
          />
          <BaseInput
            label="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Property"
          />
          <BaseSelect
            label="Status"
            value={status}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
            onChange={setStatus}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Contacts</h2>
        {contacts.map((c, i) => (
          <div
            key={i}
            className="mb-2 flex items-center justify-between rounded-lg bg-neutral-grey-8 px-3 py-2"
          >
            <span className="body-14-medium text-neutral-grey-1">
              {c.firstName} {c.lastName} — {c.email}
            </span>
            <button
              type="button"
              onClick={() => setContacts((p) => p.filter((_, j) => j !== i))}
              className="text-sm font-bold text-secondary-red-4"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <BaseInput
            label="First name"
            value={newContact.firstName}
            onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
          />
          <BaseInput
            label="Last name"
            value={newContact.lastName}
            onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
          />
          <BaseInput
            label="Email"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
        </div>
        <BaseButton
          type="button"
          variant="secondary"
          pill
          className="mt-3"
          onClick={() => {
            if (!newContact.firstName || !newContact.email) {
              setFormError('Please fill in contact first name and email.');
              return;
            }
            setContacts((p) => [...p, newContact]);
            setNewContact(EMPTY_CONTACT);
            setFormError('');
          }}
        >
          Add contact
        </BaseButton>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Departments</h2>
        {departments.map((d, i) => (
          <div
            key={i}
            className="mb-2 flex items-center justify-between rounded-lg bg-neutral-grey-8 px-3 py-2"
          >
            <span className="body-14-medium text-neutral-grey-1">
              {d.name} — {d.status}
            </span>
            <button
              type="button"
              onClick={() => setDepartments((p) => p.filter((_, j) => j !== i))}
              className="text-sm font-bold text-secondary-red-4"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-3 flex gap-2">
          <BaseInput
            label="Department name"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            className="flex-1"
          />
        </div>
        <BaseButton
          type="button"
          variant="secondary"
          pill
          className="mt-3"
          onClick={() => {
            if (!newDeptName.trim()) {
              setFormError('Please enter a department name.');
              return;
            }
            setDepartments((p) => [...p, { name: newDeptName.trim(), status: 'ACTIVE' }]);
            setNewDeptName('');
            setFormError('');
          }}
        >
          Add department
        </BaseButton>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <h2 className="heading-20-bold mb-4 text-neutral-grey-1">Check-in schedule</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <BaseInput
            label="Start day"
            type="number"
            value={String(startDay)}
            onChange={(e) => setStartDay(Number(e.target.value))}
          />
          <BaseInput
            label="End day"
            type="number"
            value={String(endDay)}
            onChange={(e) => setEndDay(Number(e.target.value))}
          />
          <BaseInput
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>
      </div>

      <BaseButton type="submit" size="mediumPlus" loading={isSubmitting} disabled={isSubmitting}>
        {submitLabel}
      </BaseButton>
    </form>
  );
}
