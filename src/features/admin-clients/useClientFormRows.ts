'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { clientsApi } from './clients.api';
import { queryKeys } from '@/lib/query-client';
import type { ClientContactFormValue, ClientDepartmentFormValue } from '@/validations';

export function useEditableRows<T>(initialSavedIds: string[] = []) {
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(() => new Set(initialSavedIds));
  const [snapshots, setSnapshots] = useState<Record<string, T>>({});

  const addSaved = (id: string) =>
    setSavedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  const removeSaved = (id: string) =>
    setSavedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const clearSnapshot = (id: string) =>
    setSnapshots((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });

  return {
    snapshots,
    isSaved: (id: string) => savedIds.has(id),
    startEdit: (id: string, snapshot: T) => {
      setSnapshots((prev) => ({ ...prev, [id]: snapshot }));
      removeSaved(id);
    },
    markSaved: (id: string) => {
      addSaved(id);
      clearSnapshot(id);
    },
    drop: (id: string) => {
      removeSaved(id);
      clearSnapshot(id);
    },
  };
}

export const contactSaveKey = (id: string) => `contact:${id}`;
export const contactDeleteKey = (id: string) => `contact:del:${id}`;
export const deptSaveKey = (id: string) => `dept:${id}`;
export const deptDeleteKey = (id: string) => `dept:del:${id}`;

// ponytail: single busyKey, per-row busy maps if parallel row saves matter
export function useClientRowPersistence(clientId?: string) {
  const queryClient = useQueryClient();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const run = async <R>(
    key: string,
    fn: () => Promise<R>,
    ok: string,
    fail: string,
  ): Promise<R | null> => {
    setBusyKey(key);
    try {
      const res = await fn();
      toast.success(ok);
      return res;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : fail);
      return null;
    } finally {
      setBusyKey(null);
    }
  };

  const refreshClient = (withDepartments = false) => {
    if (!clientId) return;
    queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.detail(clientId) });
    if (withDepartments) {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.departments(clientId) });
    }
  };

  return {
    busyKey,
    saveContact: (key: string, v: ClientContactFormValue) => {
      if (!clientId) return Promise.resolve<ClientContactFormValue | null>(v);
      const id = v.id;
      return run(
        key,
        async () => {
          const payload = {
            firstName: v.firstName,
            lastName: v.lastName,
            email: v.email,
            role: v.role,
          };
          const saved = id
            ? await clientsApi.updateContact(clientId, id, payload)
            : await clientsApi.addContact(clientId, payload);
          refreshClient();
          return { ...v, ...saved };
        },
        id ? 'Contact updated successfully' : 'Contact added successfully',
        'Failed to save contact',
      );
    },
    deleteContact: (key: string, v: ClientContactFormValue) => {
      const id = v.id;
      if (!clientId || !id) return Promise.resolve(true);
      return run(
        key,
        async () => {
          await clientsApi.deleteContact(clientId, id);
          refreshClient();
          return true;
        },
        'Contact deleted successfully',
        'Failed to delete contact',
      ).then((r) => r === true);
    },
    saveDepartment: (key: string, v: ClientDepartmentFormValue) => {
      if (!clientId) return Promise.resolve<ClientDepartmentFormValue | null>(v);
      const id = v.id;
      return run(
        key,
        async () => {
          const payload = { name: v.name, status: v.status };
          const saved = id
            ? await clientsApi.updateDepartment(clientId, id, payload)
            : await clientsApi.createDepartment(clientId, payload);
          refreshClient(true);
          return { ...v, ...saved, id: saved.id, isCompanyWide: saved.isCompanyWide };
        },
        id ? 'Department updated successfully' : 'Department added successfully',
        'Failed to save department',
      );
    },
    deleteDepartment: (key: string, v: ClientDepartmentFormValue) => {
      const id = v.id;
      if (!clientId || !id) return Promise.resolve(true);
      return run(
        key,
        async () => {
          await clientsApi.deleteDepartment(clientId, id);
          refreshClient(true);
          return true;
        },
        'Department deleted successfully',
        'Failed to delete department',
      ).then((r) => r === true);
    },
  };
}
