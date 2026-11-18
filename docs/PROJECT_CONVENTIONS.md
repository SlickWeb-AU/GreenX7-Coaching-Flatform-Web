# GreenX7 Project Conventions

Architecture, API, state management, and routing guidelines for developers building the GreenX7 platform. Styling and UI design-system rules live in `UI_CONVENTIONS.md`.

---

## Core Engineering Principles

Before contributing code, ensure your changes adhere to these invariants:

1. **Self-Documenting Code**: Write clear TypeScript types and meaningful names. Comment the "why", never the "what".
2. **Layer Separation**: Respect layer boundaries and use path aliases (`@/components/...`, `@/features/...`, `@/types`, `@/constants/...`, `@/config/routes`). Avoid relative imports (`../../`).
3. **Data Fetching Consistency**: Always use pre-unwrapped helpers from `@/lib/axios` and centralized `queryKeys` from `@/lib/query-client`.
4. **Type Safety**: Strictly avoid `any` and `@ts-ignore`. Let types flow from Zod schemas and API contracts.
5. **Route Centralization**: Never construct navigation URLs with string concatenation; always use `ROUTES.*` from `@/config/routes`.
6. **Continuous Verification**: Verify every change with `npm run typecheck` and `npm run lint:check`.

---

## 1. Code Style & TypeScript Standards

- **Self-documenting**: TypeScript types and readable naming are the source of truth. If code is clear, write NO comments.
- **Strict Comment Policy**:
  - ❌ Forbidden: `// Set state`, `// Submit button`, `// Call API`, `// Loop through items`.
  - ❌ Forbidden: Label/section markers (`{/* Header Row */}`, `{/* Content Section */}`). Let semantic JSX speak.
  - ❌ Forbidden: Non-English comments, ASCII banners, commented-out dead code.
  - ✅ Allowed: Explaining non-obvious business logic, browser workarounds, or security tradeoffs.
- **Strict Typing (No `any` / `@ts-ignore`)**:
  - Never use `as any` or `// @ts-ignore` to silence type errors. Narrow types using Zod, type guards, or `unknown`.
  - Generic calls require explicit type arguments: `get<ClientDetail>(...)`, `ApiSuccessResponse<T>`.
  - In `catch (err: unknown)`, use `toApiError(err)` or `err instanceof ApiError`.
- **Flow & Step Constants**:
  - Never hardcode string literals for multi-step flows or statuses inline (e.g. ❌ `'email' | 'otp'`).
  - Always define in `src/constants/{domain}.ts` using `as const` and derive the union type:
    ```ts
    export const LOGIN_STEPS = { EMAIL: 'email', OTP: 'otp' } as const;
    export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];
    ```

---

## 2. Directory Architecture & Layer Responsibilities

```
src/
├── app/          # Next.js App Router (pages, layouts, route handlers)
├── components/   # UI presentation (base/ for design-system, {domain}/ for domain views)
├── config/       # navigation.ts, permissions.ts, routes.ts
├── constants/    # Business options, design tokens, UI class mappings
├── features/     # Pure API services (clientsApi, dashboardApi) and query hooks ONLY
├── lib/          # axios.ts, query-client.ts, utils.ts (cn), formatters
├── types/        # DTOs, API contracts, domain models (re-exported via index.ts)
└── validations/  # Zod schemas (re-exported via index.ts)
```

### Layer Rules & Path Aliases

Always use path aliases. Never write deep relative paths (`../../../`).

| Layer                   | Responsibility & Constraints                                                                                                  |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `@/features/{domain}`   | API service objects (`clientsApi`, `authApi`) and domain query/mutation hooks ONLY. **NO UI JSX, NO Zod schemas, NO types.**  |
| `@/components/{domain}` | Domain-specific UI presentation. Composes `@/components/base` and Tailwind.                                                   |
| `@/types`               | All DTOs, API responses, and domain entities live here. Component props interfaces remain colocated in their own `.tsx` file. |
| `@/validations`         | All Zod validation schemas live here and export inferred types (`z.infer<typeof schema>`).                                    |
| `@/config/routes`       | Centralized typed route definitions (`ROUTES`).                                                                               |
| `@/lib/axios`           | HTTP client with mutex 401 refresh queue and pre-unwrapped helpers (`get`, `post`, etc.).                                     |
| `@/lib/query-client`    | Centralized `queryKeys` and QueryClient factory.                                                                              |

- **Thin `page.tsx`**: Route pages only wire hooks, route params, and top-level domain components. No raw HTTP calls or form schemas inside `page.tsx`.
- **`<Suspense>` on pages reading search params**:
  - In Next.js App Router, any client component reading `useSearchParams()` MUST be wrapped in `<Suspense fallback={<BaseLoading fullScreen />}>` in `page.tsx` to prevent SSR de-optimization.

---

## 3. State Management Tiers

Classify every piece of state into the correct tier:

| Tier                         | Use Case                                          | Mechanism                                           | Rules                                                                                                        |
| :--------------------------- | :------------------------------------------------ | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **1. Page-level URL State**  | Search, filter, sorting, pagination on list pages | `useSearchParams`, `useRouter`, `mergeSearchParams` | Use `router.replace` with debounced input. Must survive page reload & be shareable.                          |
| **2. Server / Async State**  | Backend data (fetched, cached, mutated)           | `@tanstack/react-query` (`useQuery`, `useMutation`) | ALWAYS use `queryKeys` from `@/lib/query-client`. Default `staleTime: 60s`. Refetch via `invalidateQueries`. |
| **3. Global UI State**       | Cross-page UI state (sidebar collapsed)           | React Context / Layout `useState`                   | Client UI state only. Do NOT store server data here.                                                         |
| **4. Auth & RBAC**           | User session, permissions, role checking          | `AuthProvider` / `useAuth()`                        | Provides `can()`, `canAny()`, `hasRole()`. Hydrated from root layout session.                                |
| **5. Local Component State** | Modal open/close, draft inputs, in-modal tabs     | `useState`, `useReducer`, `useRef`                  | Keep as local and tightly scoped as possible. Do NOT push modal tab states to URL.                           |

---

## 4. API & Data Fetching Conventions

### Backend-for-Frontend (BFF) Architecture

- Client requests hit Next.js BFF at `/api/bff/[...path]` or `/api/auth/*` (same-origin, no CORS, credentials included).
- Access & Refresh tokens are stored in secure `httpOnly` cookies managed by Next.js route handlers. Browser JS never reads tokens directly.
- `src/lib/axios.ts` automatically manages 401 token refresh queue with mutex locking.

### Typed HTTP Helpers (`@/lib/axios`)

> [!IMPORTANT]
> The helpers `get`, `post`, `patch`, and `del` **ALREADY return `res.data.data`**.
> `getPaginated` **ALREADY returns `{ items: T[], meta: PaginationMeta }`**.
> **NEVER write `.data.data` on the returned result.**

```ts
import { get, getPaginated, post, patch, del } from '@/lib/axios';
import type { ClientListItem, ClientDetail, CreateClientPayload, PaginatedResult } from '@/types';

export const clientsApi = {
  listPaginated: (query: string): Promise<PaginatedResult<ClientListItem>> =>
    getPaginated<ClientListItem>(`/clients?${query}`),
  getById: (id: string): Promise<ClientDetail> => get<ClientDetail>(`/clients/${id}`),
  create: (payload: CreateClientPayload): Promise<ClientDetail> =>
    post<ClientDetail>('/clients', payload),
  update: (id: string, payload: Partial<CreateClientPayload>): Promise<ClientDetail> =>
    patch<ClientDetail>(`/clients/${id}`, payload),
  delete: (id: string): Promise<void> => del<void>(`/clients/${id}`),
};
```

### TanStack Query Conventions

- **Always use centralized `queryKeys`**:
  ```tsx
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { queryKeys } from '@/lib/query-client';
  import { clientsApi } from '@/features/admin-clients';
  import { toast } from 'sonner';

  // Query
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.adminClients.list(query),
    queryFn: () => clientsApi.listPaginated(query),
  });

  // Mutation
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.all });
      toast.success('Client created successfully');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to create client');
    },
  });
  ```
- If a new feature requires new query keys, add them to `queryKeys` in `src/lib/query-client.ts`. Never write inline string arrays like `queryKey: ['random-key']`.

---

## 5. Forms & Validations

- **Simple Forms** (1–2 fields, e.g. rename modal): Local React `useState`.
- **Complex / Domain Forms** (Client creation, department forms, multi-section): `react-hook-form` + `@hookform/resolvers/zod`.
- **Rules**:
  1. Always add `noValidate` to `<form onSubmit={handleSubmit(onSubmit)} noValidate>`.
  2. Map field errors to `error={Boolean(errors.fieldName)}` and `helperText={errors.fieldName?.message}` on `BaseInput`.
  3. Form submit buttons must bind `loading={isSubmitting || isPending}` and `disabled={isSubmitting || isPending}`.

---

## 6. Routing & Navigation Conventions

- **Use Centralized `ROUTES`**:
  - Always import `ROUTES` from `@/config/routes`.
  - ❌ Never write: `router.push('/admin/clients/' + id)`.
  - ✅ Always write: `router.push(ROUTES.admin.clientDetail(id))`.
- **SPA Transitions vs New Tab**:
  - Admin and in-app navigation MUST use Next.js primitives (`router.push` or `<Link href="...">`).
  - Standalone fullscreen views (Live Battery, Presentation Decks) opened from admin should open in a new tab:
    ```tsx
    window.open(ROUTES.live(clientSlug, departmentSlug), '_blank', 'noopener,noreferrer');
    ```
- **Semantic Slugs vs UUIDs**:
  - Public & Presentation routes strictly use semantic slugs (`/battery/:clientSlug/:departmentSlug/live`).
  - Admin management views use entity UUIDs (`/admin/clients/:clientId/departments/:deptId`).

---

## 7. Verification & Quality Commands

Always verify changes with fast checks:

- **Type Check**: `npm run typecheck` (`tsc --noEmit`).
- **Lint Check**: `npm run lint:check` (or `npm run lint` for auto-fixing).
- **Unit Tests**: `npm test` (`vitest run`).
- ❌ **Forbidden in verification**: Do NOT run `npm run build` just to verify types or linting. Use `npm run typecheck`.
