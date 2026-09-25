'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

import { BaseButton, BaseHeader, BaseInput, BaseLoading, BaseSelect } from '@/components/base';
import { FilterMonthIcon, FilterSlidersIcon, SearchIcon } from '@/components/icons';
import { ROUTES } from '@/config/routes';

import { ClientsTable } from '@/components/clients';
import { clientsApi } from '@/features/admin-clients';
import { settingsApi } from '@/features/admin-settings';
import { buildClientsQuery } from '@/lib/clients';
import { mergeSearchParams } from '@/lib/search-params';
import type { ClientsSortField } from '@/types';
import { ALL_FILTER_VALUE, CLIENT_STATUS_OPTIONS, SORT_FIELD_TO_API } from '@/constants/clients';

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

  const urlSearch = searchParams.get('search') ?? '';

  useEffect(() => {
    if (search === urlSearch) return;
    const next = mergeSearchParams(paramsRef.current, { search: search || null, page: null });
    if (next === null) return;
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [search, urlSearch, pathname, router]);

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-clients', query],
    queryFn: () => clientsApi.listPaginated(query),
    retry: false,
  });

  const industriesQuery = useQuery({
    queryKey: ['admin-industries'],
    queryFn: settingsApi.getIndustries,
    retry: false,
  });

  const industryOptions = useMemo(
    () => [
      { value: ALL_FILTER_VALUE, label: 'All industries' },
      ...(industriesQuery.data ?? [])
        .filter((item) => item.isActive || item.id === industry)
        .map((item) => ({ value: item.id, label: item.name })),
    ],
    [industriesQuery.data, industry],
  );

  const rows = data?.items ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const addBtn = (
    <BaseButton
      pill
      startIcon={<Plus aria-hidden />}
      onClick={() => router.push(ROUTES.admin.clientNew)}
    >
      Add client
    </BaseButton>
  );

  if ((isLoading || isFetching) && rows.length === 0) {
    return <BaseLoading message="Loading clients..." fullScreen />;
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
              placeholder="Select industry"
              value={industry}
              options={industryOptions}
              onChange={(v) =>
                setParams({ industry: v === ALL_FILTER_VALUE ? null : v, page: null })
              }
            />
          </div>
          <div className="w-full sm:w-[160px]">
            <BaseSelect
              startIcon={<FilterSlidersIcon aria-hidden />}
              placeholder="Select status"
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
    <Suspense fallback={<BaseLoading message="Loading clients..." fullScreen />}>
      <ClientsContent />
    </Suspense>
  );
}
