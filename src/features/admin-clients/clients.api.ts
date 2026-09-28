'use client';

import { del, get, getPaginated, patch, post } from '@/lib/axios';

import type {
  CheckInHistoryItemDto,
  ClientContact,
  ClientDashboardDto,
  ClientDetail,
  ClientListItem,
  CreateClientPayload,
  CreateContactPayload,
  CreateDepartmentPayload,
  DepartmentDashboardDto,
  DepartmentListItemDto,
  DepartmentListQuery,
  DepartmentShareLinksDto,
  SendReportResultDto,
  UpdateClientPayload,
  UpdateContactPayload,
  UpdateDepartmentPayload,
} from '@/types';

const listDepartments = (
  id: string,
  suffix: '' | '/overview',
  params?: DepartmentListQuery | string,
) =>
  typeof params === 'string'
    ? getPaginated<DepartmentListItemDto>(`/clients/${id}/departments${suffix}?${params}`)
    : getPaginated<DepartmentListItemDto>(`/clients/${id}/departments${suffix}`, { params });

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
  getDepartments: (id: string, params?: DepartmentListQuery | string) =>
    listDepartments(id, '', params),
  getDepartmentsOverview: (id: string, params: DepartmentListQuery | string) =>
    listDepartments(id, '/overview', params),
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
  addContact: (clientId: string, payload: CreateContactPayload) =>
    post<ClientContact>(`/clients/${clientId}/contacts`, payload),
  updateContact: (clientId: string, contactId: string, payload: UpdateContactPayload) =>
    patch<ClientContact>(`/clients/${clientId}/contacts/${contactId}`, payload),
  deleteContact: (clientId: string, contactId: string) =>
    del<void>(`/clients/${clientId}/contacts/${contactId}`),
  createDepartment: (clientId: string, payload: CreateDepartmentPayload) =>
    post<DepartmentListItemDto>(`/clients/${clientId}/departments`, payload),
  updateDepartment: (clientId: string, deptId: string, payload: UpdateDepartmentPayload) =>
    patch<DepartmentListItemDto>(`/clients/${clientId}/departments/${deptId}`, payload),
  deleteDepartment: (clientId: string, deptId: string) =>
    del<void>(`/clients/${clientId}/departments/${deptId}`),
  sendReport: (checkInId: string) =>
    post<SendReportResultDto>(`/check-ins/${checkInId}/reports/send`, {}),
};
