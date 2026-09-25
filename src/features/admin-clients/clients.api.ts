'use client';

import { get, getPaginated, patch, post } from '@/lib/axios';

import type {
  CheckInHistoryItemDto,
  ClientDashboardDto,
  ClientDetail,
  ClientListItem,
  CreateClientPayload,
  CreateDepartmentPayload,
  DepartmentDashboardDto,
  DepartmentListItemDto,
  DepartmentListQuery,
  DepartmentShareLinksDto,
  UpdateClientPayload,
} from '@/types';

export const clientsApi = {
  listPaginated: (query: string) => getPaginated<ClientListItem>(`/clients?${query}`),
  getById: (id: string) => get<ClientDetail>(`/clients/${id}`),
  create: (payload: CreateClientPayload) => post<ClientDetail>('/clients', payload),
  update: (id: string, payload: UpdateClientPayload) =>
    patch<ClientDetail>(`/clients/${id}`, payload),
  getDashboard: (
    id: string,
    params: { year: number; month: number; trendMonths?: number; industryId?: string },
  ) => get<ClientDashboardDto>(`/clients/${id}/dashboard`, { params }),
  getDepartments: (id: string, params: DepartmentListQuery | string) =>
    typeof params === 'string'
      ? getPaginated<DepartmentListItemDto>(`/clients/${id}/departments?${params}`)
      : getPaginated<DepartmentListItemDto>(`/clients/${id}/departments`, { params }),
  getCheckIns: (id: string, params: DepartmentListQuery | string) =>
    typeof params === 'string'
      ? getPaginated<CheckInHistoryItemDto>(`/clients/${id}/check-ins?${params}`)
      : getPaginated<CheckInHistoryItemDto>(`/clients/${id}/check-ins`, { params }),
  getDepartmentDashboard: (
    id: string,
    deptId: string,
    params: { year: number; month: number; trendMonths?: number; industryId?: string },
  ) =>
    get<DepartmentDashboardDto>(`/clients/${id}/departments/${deptId}/dashboard`, {
      params,
    }),
  getDepartmentShareLinks: (id: string, deptId: string) =>
    get<DepartmentShareLinksDto>(`/clients/${id}/departments/${deptId}/share-links`),
  createDepartment: (id: string, payload: CreateDepartmentPayload) =>
    post<DepartmentListItemDto>(`/clients/${id}/departments`, payload),
};
