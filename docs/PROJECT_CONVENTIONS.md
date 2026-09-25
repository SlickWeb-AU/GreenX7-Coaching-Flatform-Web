# GreenX7 Project Conventions

Architecture, state management, and development guidelines for all developers and AI agents. Styling and UI design-system rules live in `UI_CONVENTIONS.md`.

---

## 1. Code Style & TypeScript Standards

- **Self-documenting**: Use precise domain names; TypeScript types are the source of truth. If the code is clear, write no comment.
- **Comment the "why" only**: Non-obvious business rules, tradeoffs, or browser/library workarounds. If code is hard to read, rename variables or extract helper functions instead.
- **English only**: Every comment (JSDoc, inline, `TODO`/`FIXME`) must be written in English.
- **Forbidden**: ASCII dividers/banners, label comments (e.g. `{/* Header Row */}`), commented-out dead code (Git keeps history).
- **No `React.FC` / `FC`**: Never type components with `React.FC` or `FC`. Use standard typed props directly on function parameters:
  ```tsx
  export function Component({ title, children }: ComponentProps) { ... }
  export const Component = ({ title, children }: ComponentProps) => { ... };
  ```
  If children are needed, explicitly define `children?: ReactNode` in the props interface.
- **Named React imports only**: Never use `React.*` namespace prefixes (e.g. ❌ `React.useState`, `React.useEffect`, `React.useCallback`, `React.useMemo`, `React.FormEvent`). Always import hooks and types directly from `'react'`:
  ```tsx
  import { useState, useEffect, useCallback, type ReactNode, type FormEvent } from 'react';
  ```
- **Next.js `<Suspense>` on pages with `useSearchParams()`**:
  - In Next.js App Router, any client component reading `useSearchParams()` MUST be wrapped in a `<Suspense>` boundary to prevent build-time/runtime SSR de-optimization.
  - Pattern: Keep `page.tsx` as a clean wrapper with `<Suspense fallback={<BaseLoading fullScreen />}>` around the inner content component (e.g. `<ClientsContent />`).
  - Do NOT wrap arbitrary non-search-param components in `<Suspense>` without an architectural need.
- **Flow & Step Constants**:
  - Never hardcode string literals for multi-step flows, statuses, or page states inline (e.g. ❌ `'email' | 'otp'`).
  - Always define them as constants with `as const` in `src/constants/{domain}.ts` and derive the type:
  ```tsx
  export const LOGIN_STEPS = {
    EMAIL: 'email',
    OTP: 'otp',
  } as const;

  export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];
  ```
- **Strict Typing (No `any` / `@ts-ignore`)**:
  - Use `unknown` with narrowing or type guards.
  - Generics must have explicit type parameters (`get<T>()`, `ApiSuccessResponse<T>`).
  - In `catch (err: unknown)`, use `toApiError(err)` or `err instanceof ApiError` (or `axios.isAxiosError(err)` if handling raw Axios).

---

## 2. Directory & Layer Architecture

```
src/
├── app/                 # Next.js App Router (pages, layouts, route handlers)
│   ├── (admin)/         # Admin route group (dashboard, clients, settings)
│   ├── (auth)/          # Authentication route group (login, verify)
│   ├── api/             # BFF & Auth API route handlers
│   │   ├── auth/        # /api/auth/login, /api/auth/refresh, /api/auth/logout
│   │   └── bff/         # /api/bff/[...path] proxy to NestJS backend
│   ├── report/          # Public/client report pages
│   ├── forbidden/       # 403 Forbidden page
│   ├── globals.css      # Tailwind base layers, typography utilities, scrollbar
│   └── layout.tsx       # Root layout with server session fetching
├── components/          # UI Presentation Components
│   ├── base/            # Design-system atomic base components (BaseButton, BaseInput, BaseTable, BaseDialog, etc.)
│   ├── icons/           # SVG icons & Lucide icon wrappers
│   ├── layout/          # Layout components (AdminLayout, Sidebar, Navbar, Breadcrumbs)
│   ├── providers/       # AppProviders, AuthProvider, QueryProvider, ConfirmProvider
│   ├── clients/         # Clients domain components (table, forms, cards, tabs)
│   ├── dashboard/       # Dashboard domain components (charts, score banners, grids)
│   └── settings/        # Settings domain components (admins table, forms)
├── config/              # Central configuration
│   ├── navigation.ts    # Sidebar menu items & role-based route matching
│   ├── permissions.ts   # RBAC permissions & permission helper functions
│   └── routes.ts        # Typed route path constants (ROUTES.admin.clients, etc.)
├── constants/           # Business & UI constants, design tokens
│   ├── auth.ts          # Auth flow steps, token keys
│   ├── clients.ts       # Status options, timezones, check-in limits, sort mappings
│   ├── dashboard.ts     # Month options, fixed zones, trend options
│   ├── tokens.ts        # Dashboard color palettes, zone colors, pill tone styles
│   └── ui.ts            # Base component size & variant class dictionaries
├── features/            # Pure Business & API Service Layer
│   ├── admin-auth/      # useAdminOtp hook
│   ├── admin-clients/   # clientsApi service
│   ├── admin-dashboard/ # dashboardApi service
│   ├── admin-settings/  # settingsApi service
│   ├── auth/            # authApi service
│   └── report-login/    # reportApi service
├── lib/                 # Core utilities, helpers & HTTP client
│   ├── api-error.ts     # ApiError class & error parser
│   ├── axios.ts         # Axios BFF client with refresh-token mutex queue & typed helpers (get, post, patch, del)
│   ├── backend.ts       # Server-side direct backend client
│   ├── clients.ts       # Query builders & client data formatters
│   ├── cookies.ts       # Secure cookie parser & setter for tokens
│   ├── dashboard.ts     # Dashboard query builders
│   ├── jwt.ts           # JWT decode & verification helpers
│   ├── otp.ts           # OTP timer & email masking formatters
│   ├── query-client.ts  # TanStack QueryClient factory & query keys
│   ├── search-params.ts # URL search param patch & merge utilities
│   └── utils.ts         # cn (clsx + tailwind-merge) & common string helpers
├── stores/              # Pure Client Global UI State (Zustand)
│   └── ui.store.ts      # Sidebar collapse, mobile menu open state
├── types/               # ALL TypeScript Definitions, DTOs & API Contracts
│   ├── api.ts           # ApiSuccessResponse, ApiErrorResponse, PaginationMeta, PaginatedResult
│   ├── auth.ts          # AuthUser, UserRole, UserStatus, AuthTokens, AccessTokenPayload
│   ├── clients.ts       # ClientListItem, ClientDetail, CreateClientPayload, DepartmentDto
│   ├── dashboard.ts     # ClientDashboardDto, DepartmentDashboardDto, BatteryScoreDto
│   ├── settings.ts      # AdminUserDto, IndustryDto
│   ├── ui.ts            # BaseSize, BaseVariant, BaseButtonStyleOptions
│   └── index.ts
└── validations/         # Zod validation schemas
    ├── clients.ts       # Client form & department schemas
    ├── settings.ts      # Industry name & invite admin schemas
    └── index.ts
```

### Imports & Path Aliases

Always use path aliases. Never use deep relative paths (`../../../`).

| Alias                   | Example                                                                 |
| :---------------------- | :---------------------------------------------------------------------- |
| `@/components/base`     | `import { BaseButton, BaseInput, BaseTable } from '@/components/base';` |
| `@/components/{domain}` | `import { ClientsTable } from '@/components/clients';`                  |
| `@/features/{domain}`   | `import { clientsApi } from '@/features/admin-clients';`                |
| `@/validations`         | `import { clientFormSchema } from '@/validations';`                     |
| `@/types`               | `import type { ClientListItem, PaginationMeta } from '@/types';`        |
| `@/constants`           | `import { CLIENT_STATUS_OPTIONS } from '@/constants/clients';`          |
| `@/config/routes`       | `import { ROUTES } from '@/config/routes';`                             |
| `@/lib/{util}`          | `import { buildClientsQuery } from '@/lib/clients';`                    |
| `@/stores/{store}`      | `import { useUiStore } from '@/stores/ui.store';`                       |

### Layer Responsibilities & Export Rules

- **`src/features/`**:
  - Contains ONLY API service objects (`clientsApi`, `settingsApi`, `authApi`, `dashboardApi`, `reportApi`) and domain query/mutation orchestration hooks.
  - MUST NOT contain UI presentation components, Zod schemas, or domain types.
- **`src/components/`**:
  - Contains presentation UI components grouped by feature/domain.
  - Component files contain only the props interface and the component function.
- **`src/validations/`**:
  - All Zod schemas and validation helper functions live here and are re-exported via `src/validations/index.ts`.
- **`src/types/`**:
  - All interfaces, DTOs, enums, payloads, and domain types live here and are re-exported via `src/types/index.ts`.
- **`src/constants/`**:
  - All business constants, option lists, status definitions, and design tokens live here.
- **`src/lib/`**:
  - HTTP clients (`axios.ts`), search params mergers, formatters, and reusable helper functions live here.
- **Barrel `index.ts` files**:
  - Use `export * from './...'` (wildcard re-exports).
- **Thin `page.tsx`**:
  - Only wires hooks, state, routing, and domain components. No raw Axios calls or hardcoded schemas.

---

## 3. State Management

Classify each piece of state into the appropriate tier:

| Tier                         | Use When                                                                        | Mechanism                                                             | Rules                                                                                                                    |
| :--------------------------- | :------------------------------------------------------------------------------ | :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **1. URL State**             | Search, filters, tabs, sorting, pagination (must survive reload & be shareable) | `useSearchParams`, `useRouter`, `usePathname`, `mergeSearchParams`    | Use `router.replace` with debounced input to keep browser history clean. Wrap component in `<Suspense>`.                 |
| **2. Server / Async State**  | Data fetched from or mutated to the backend                                     | `@tanstack/react-query` (`useQuery`, `useMutation`, `useQueryClient`) | Centralized query keys (`queryKeys` in `@/lib/query-client`), default `staleTime: 60s`, automatic background refetching. |
| **3. Global UI State**       | Pure client UI state across pages (sidebar collapsed, mobile drawer)            | `zustand` (`src/stores/ui.store.ts`)                                  | Do NOT put server data in Zustand. Only client UI state.                                                                 |
| **4. App Auth & RBAC**       | User session, permissions, role checking                                        | `AuthProvider` / `useAuth()` (`React Context`)                        | Populated from server-rendered layout session. Provides `can()`, `canAny()`, `hasRole()`.                                |
| **5. Local Component State** | Modal/dialog visibility, draft form inputs, dropdown open state                 | `useState`, `useReducer`, `useRef`                                    | Keep as local and tightly scoped as possible.                                                                            |

---

## 4. API, BFF & Data Fetching

### Backend-for-Frontend (BFF) Architecture

1. **Client requests** hit Next.js BFF at `/api/bff/[...path]` or `/api/auth/*` (same origin, no CORS, no preflight).
2. **Access & Refresh tokens** are stored in secure, `httpOnly` cookies managed by Next.js route handlers. JavaScript in the browser cannot and should not access tokens directly.
3. **Automatic 401 Refresh Queue**:
   - `src/lib/axios.ts` implements a mutex queue for token refresh.
   - If multiple parallel requests receive a `401 Unauthorized`, only the first request triggers `/api/auth/refresh`. Subsequent requests queue and retry once refresh succeeds.
   - If refresh fails, `setSessionExpiredHandler` clears the React Query cache, resets `AuthContext`, and redirects to `/login`.

### API Envelope Contracts (`src/types/api.ts`)

```typescript
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
```

### Typed HTTP Helpers (`src/lib/axios.ts`)

Use the unwrapped helper functions directly in API feature services:

```typescript
import { get, getPaginated, post, patch, del } from '@/lib/axios';

export const clientsApi = {
  listPaginated: (query: string) => getPaginated<ClientListItem>(`/clients?${query}`),
  getById: (id: string) => get<ClientDetail>(`/clients/${id}`),
  create: (payload: CreateClientPayload) => post<ClientDetail>('/clients', payload),
  update: (id: string, payload: UpdateClientPayload) =>
    patch<ClientDetail>(`/clients/${id}`, payload),
  delete: (id: string) => del<void>(`/clients/${id}`),
};
```

### TanStack Query Usage Pattern

```tsx
// Query: fetching list or detail data
const { data, isLoading, isFetching, error } = useQuery({
  queryKey: queryKeys.adminClients.list(query),
  queryFn: () => clientsApi.listPaginated(query),
  retry: false,
});

// Mutation: creating, updating, or deleting data
const queryClient = useQueryClient();
const createMutation = useMutation({
  mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminClients.all });
    toast.success('Client created successfully');
    router.push(ROUTES.admin.clients);
  },
  onError: (err) => {
    toast.error(err instanceof Error ? err.message : 'Failed to create client');
  },
});
```

- `isLoading`: initial load when no cache exists → render skeleton or `<BaseLoading fullScreen />`.
- `isFetching`: background refetch → keep existing layout without jarring full-screen loaders.

---

## 5. Forms & Validations

- **Simple forms** (1–2 flat fields, e.g. rename industry modal): Local React state (`useState` for values and errors).
- **Complex forms** (multi-section, nested arrays, check-in settings, client creation): `react-hook-form` + `zod` schema (`@hookform/resolvers/zod`).
- **Validation Schemas**: All schemas reside in `src/validations/` and export inferred types (e.g. `type ClientFormValues = z.infer<typeof clientFormSchema>;`).

### Form Rules:

1. **Form element**: Always use `<form noValidate onSubmit={handleSubmit(onSubmit)}>`.
2. **Field error clearing**: Clear field errors upon user input change.
3. **Submit button**: Always bind `loading={isSubmitting || isPending}` and `disabled={isSubmitting || isPending}` on `BaseButton`.
4. **Server validation errors**: Map 400/422 validation errors to corresponding form field `error` and `helperText`.

---

## 6. Feedback & Notifications

| Scenario                                       | Handled By                 | UI Component / Action                                   |
| :--------------------------------------------- | :------------------------- | :------------------------------------------------------ |
| **Mutation success / write alert**             | `useMutation` `onSuccess`  | `toast.success(...)` (`sonner`)                         |
| **Mutation failure / write error**             | `useMutation` `onError`    | `toast.error(...)` (`sonner`)                           |
| **Destructive / critical action confirmation** | `useConfirm()`             | `<ConfirmProvider>` dialog modal                        |
| **Initial page load**                          | `isLoading && !data`       | `<BaseLoading message="..." fullScreen />`              |
| **Table / list fetch failure**                 | Query `error`              | Inline error card with **Retry** button                 |
| **Empty list (200 OK, `[]`)**                  | `data.length === 0`        | Dashed border empty container with CTA button           |
| **Field validation error**                     | Client Zod / API 422       | Field `error` + `helperText` below input                |
| **Session expired (401)**                      | Axios response interceptor | Auto refresh; if failed, reset auth & redirect `/login` |

---

## 7. Authentication, RBAC & Security

- **Tokens in `httpOnly` Cookies**: Access and refresh tokens are stored securely in cookies.
- **Server Session Hydration**: The root layout fetches the current authenticated user at request time and hydrates `AuthProvider` via `initialUser`, preventing UI flash.
- **RBAC & Permissions**:
  - Permissions are defined in `src/config/permissions.ts`.
  - Use `useAuth()` in components to check access:
    ```tsx
    const { user, isAdmin, can, canAny, hasRole } = useAuth();
    if (can(PERMISSIONS.CLIENT_CREATE)) { ... }
    ```
- **Route Guards**: Next.js middleware and layout-level guards protect admin and authenticated routes.

---

## 8. Verification & Development Commands

- **Type Check**: Run `npm run typecheck` (`tsc --noEmit`) for fast, low-memory type validation.
- **Lint Check**: Run `npm run lint:check` (or `npm run lint` for auto-fixing).
- **Unit Tests**: Run `npm test` (`vitest run`).
- **Forbidden in Dev Verification**: Do NOT run `npm run build` just to verify code or type changes. Next.js build prerenders all static routes, consuming excessive time and memory. Always use `npm run typecheck` and `npm run lint:check`.
