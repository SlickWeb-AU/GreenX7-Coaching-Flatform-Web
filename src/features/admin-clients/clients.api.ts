'use client';

import { get, getPaginated, patch, post } from '@/lib/axios';

import type { ClientDetail, ClientListItem, CreateClientPayload } from './types';

export const clientsApi = {
  listPaginated: (query: string) => getPaginated<ClientListItem>(`/clients?${query}`),
  getById: (id: string) => get<ClientDetail>(`/clients/${id}`),
  create: (payload: CreateClientPayload) => post<ClientDetail>('/clients', payload),
  update: (id: string, payload: Partial<CreateClientPayload>) =>
    patch<ClientDetail>(`/clients/${id}`, payload),
};
