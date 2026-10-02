import { isServer, QueryClient } from '@tanstack/react-query';

import { ApiError } from './api-error';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 60s: Prevents duplicate requests during navigation while keeping admin dashboard data fresh
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Do not retry client errors (401/403/404/422)
          if (error instanceof ApiError && error.statusCode < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Server: create a new client per request to avoid sharing cache between users.
 * Browser: reuse a single instance so cache persists across React suspense re-renders.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

/** Centralized query keys — avoids typo errors and ensures accurate cache invalidation */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
  industries: {
    all: ['admin-industries'] as const,
  },
  admins: {
    all: ['admin-admins'] as const,
  },
  adminClients: {
    all: ['admin-clients'] as const,
    list: (query?: string) =>
      query !== undefined ? (['admin-clients', query] as const) : (['admin-clients'] as const),
    detail: (id: string) => ['admin-client', id] as const,
    dashboard: (id: string, year?: number | string, month?: number | string) =>
      ['admin-client-dashboard', id, year, month] as const,
    departments: (id: string, ...params: unknown[]) =>
      ['admin-client-departments', id, ...params] as const,
    departmentDashboard: (
      clientId: string,
      deptId: string,
      year?: number | string,
      month?: number | string,
    ) => ['admin-dept-dashboard', clientId, deptId, year, month] as const,
    departmentShareLinks: (clientId: string, deptId: string) =>
      ['admin-dept-share-links', clientId, deptId] as const,
    checkIns: (
      clientId: string,
      departmentId?: string,
      page?: number | string,
      pageSize?: number | string,
    ) => ['admin-client-check-ins', clientId, departmentId, page, pageSize] as const,
  },
  adminDashboard: {
    all: ['admin-dashboard'] as const,
    metrics: (month?: number | string, year?: number | string, industry?: string) =>
      ['admin-dashboard', month, year, industry] as const,
  },
  batteryCheck: {
    live: (client: string, dept: string) => ['battery-check-live', client, dept] as const,
    submit: (client: string, dept: string) => ['battery-check-submit', client, dept] as const,
  },
  reports: {
    all: ['reports'] as const,
    view: (token: string) => ['reports', 'view', token] as const,
    recipients: (checkInId: string) => ['reports', 'recipients', checkInId] as const,
  },
} as const;
