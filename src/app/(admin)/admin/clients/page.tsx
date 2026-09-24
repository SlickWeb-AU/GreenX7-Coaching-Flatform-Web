'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import {
  BaseButton,
  BaseErrorState,
  BaseHeader,
  BaseInput,
  BaseLoading,
  BaseSelect,
} from '@/components/base';
import { FilterMonthIcon, FilterSlidersIcon, SearchIcon } from '@/components/icons';
import { ROUTES } from '@/config/routes';

import { ClientsTable } from '@/features/admin-clients/ClientsTable';
import { ALL_FILTER_VALUE, buildClientsQuery } from '@/features/admin-clients/clients-display';
import { clientsApi } from '@/features/admin-clients/clients.api';
import { mergeSearchParams } from '@/features/admin-clients/search-params';
import type { ClientsSortField } from '@/features/admin-clients/types';
import {
  CLIENT_INDUSTRY_OPTIONS,
  CLIENT_STATUS_OPTIONS,
  SORT_FIELD_TO_API,
} from '@/constants/clients';

function useDebounced(value: string, delay = 400): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ClientsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(() => searchParams.get('search') ?? '');
  const search = useDebounced(searchInput.trim());
  const industry = searchParams.get('industry') ?? ALL_FILTER_VALUE;
  const status = searchParams.get('status') ?? ALL_FILTER_VALUE;
  const sortField = (searchParams.get('sort') as ClientsSortField) || 'name';
  const sortAsc = searchParams.get('order') !== 'desc';
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : 1;

  // Latest URL snapshot for debounced writes (avoids stale closures wiping
  // concurrently changed filters) and back/forward sync of the textbox.
  const paramsRef = useRef(searchParams.toString());
  paramsRef.current = searchParams.toString();

  const setParams = (patch: Record<string, string | null>) => {
    const next = mergeSearchParams(paramsRef.current, patch);
    if (next === null) return;
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = mergeSearchParams(paramsRef.current, { search: search || null, page: null });
      if (next === null) return;
      router.replace(next ? `${pathname}?${next}` : pathname);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, pathname, router]);

  const urlSearch = searchParams.get('search') ?? '';
  const inputRef = useRef(searchInput);
  inputRef.current = searchInput;
  useEffect(() => {
    if (urlSearch !== inputRef.current) setSearchInput(urlSearch);
  }, [urlSearch]);

  const query = buildClientsQuery({
    page,
    search: search || undefined,
    industry,
    status,
    sortBy: SORT_FIELD_TO_API[sortField],
    sortOrder: sortAsc ? 'asc' : 'desc',
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['admin-clients', query],
    queryFn: () => clientsApi.listPaginated(query),
    retry: false,
  });

  const rows = data?.items ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const addBtn = (
    <BaseButton
      startIcon={<Plus aria-hidden />}
      onClick={() => router.push(ROUTES.admin.clientNew)}
    >
      Add client
    </BaseButton>
  );

  if ((isLoading || isFetching) && rows.length === 0) {
    return (
      <>
        <BaseHeader title="Clients" actions={addBtn} />
        <BaseLoading message="Loading clients..." fullScreen={false} />
      </>
    );
  }

  if (error && rows.length === 0) {
    return (
      <>
        <BaseHeader title="Clients" actions={addBtn} />
        <BaseErrorState
          title="Unable to load clients"
          message={error instanceof Error ? error.message : 'Request failed'}
          onRetry={() => refetch()}
        />
      </>
    );
  }

  const toggleSort = (field: ClientsSortField) => {
    const nextAsc = sortField === field ? !sortAsc : true;
    setParams({
      sort: field === 'name' ? null : field,
      order: nextAsc ? null : 'desc',
      page: null,
    });
  };

  return (
    <>
      <BaseHeader title="Clients" actions={addBtn} />
      <div className="mb-6 flex flex-col items-stretch gap-4 rounded-2xl bg-white p-3 md:flex-row md:items-center">
        <div className="min-w-[240px] max-w-[380px] flex-1">
          <BaseInput
            placeholder="Search clients"
            variant="secondary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<SearchIcon aria-hidden />}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          <div className="w-full sm:w-[180px]">
            <BaseSelect
              startIcon={<FilterMonthIcon aria-hidden />}
              value={industry}
              options={CLIENT_INDUSTRY_OPTIONS}
              onChange={(v) =>
                setParams({ industry: v === ALL_FILTER_VALUE ? null : v, page: null })
              }
            />
          </div>
          <div className="w-full sm:w-[160px]">
            <BaseSelect
              startIcon={<FilterSlidersIcon aria-hidden />}
              value={status}
              options={CLIENT_STATUS_OPTIONS}
              onChange={(v) => setParams({ status: v === ALL_FILTER_VALUE ? null : v, page: null })}
            />
          </div>
        </div>
      </div>
      <div className="pt-4">
        <ClientsTable
          rows={rows}
          meta={data?.meta}
          sortField={sortField}
          sortAsc={sortAsc}
          onToggleSort={toggleSort}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setParams({ page: p > 1 ? String(p) : null })}
        />
      </div>
    </>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<BaseLoading message="Loading clients..." fullScreen={false} />}>
      <ClientsContent />
    </Suspense>
  );
}
