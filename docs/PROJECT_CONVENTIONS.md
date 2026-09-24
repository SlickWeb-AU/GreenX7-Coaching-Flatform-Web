# GreenX7 Project Conventions

Architecture and development rules for all developers and AI agents. Styling and design-system rules live in `UI_CONVENTIONS.md`.

---

## 1. Code Style

- **Self-documenting**: precise domain names; TypeScript types are the source of truth. If the code is clear, write no comment.
- **Comment the "why" only**: non-obvious business rules, tradeoffs, browser/library workarounds. If code is hard to read, rename or extract a function instead.
- **English only**: every comment (JSDoc, inline, `TODO`/`FIXME`) must be in English.
- **Forbidden**: ASCII dividers/banners, label comments (`{/* Header Row */}`), commented-out code (Git keeps history).
- **No `React.FC` / `FC`**: Never type components with `React.FC` or `FC`. Use standard typed props directly on function parameters (`export function Component({ prop }: ComponentProps)` or `export const Component = ({ prop }: ComponentProps) => ...`). If children are needed, explicitly define `children?: ReactNode` in the props interface.
- **Named React imports only**: Never use `React.*` namespace prefixes in component, hook, or utility code (e.g. ❌ `React.useState`, `React.useEffect`, `React.useCallback`, `React.useMemo`, `React.FormEvent`). Always import hooks and types directly from `'react'` (e.g. ✅ `import { useState, useEffect, useCallback, type FormEvent } from 'react';`).
- **No unnecessary `<Suspense>` on pages**: Do not wrap page contents in `<Suspense>` unless explicitly required for streaming architecture. Keep `page.tsx` direct and clean.
- **Flow & Step Constants**: Never hardcode string literals for multi-step flows or page states inline (e.g. ❌ `'email' | 'otp'`). Always define them as constants in `src/constants/{domain}.ts` (e.g. ✅ `export const LOGIN_STEPS = { EMAIL: 'email', OTP: 'otp' } as const;`) and derive the type (`export type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];`).
- **No `any` / `@ts-ignore`**: use `unknown` with narrowing. Give generics explicit type parameters (`useFetch<T>()`, `ApiResponse<T = unknown>`). In `catch (err: unknown)`, use `axios.isAxiosError<ApiErrorResponse>(err)`.

```tsx
// ❌ Forbidden: React.FC / FC / React.* namespace calls
export const Card: React.FC<CardProps> = ({ title }) => {
  React.useEffect(() => { ... }, []);
  return <div>{title}</div>;
};

// ✅ Allowed: Standard typed props & direct hook imports
import { useEffect, useState } from 'react';

export const Card = ({ title }: CardProps) => { ... };
export function Card({ title }: CardProps) { ... }

// ✅ Workaround for Safari flexbox clipping with dynamic height
// ✅ Ignore stale responses when filter params change rapidly
```

---

## 2. Feature Structure

```
src/
├── type/{feature}.ts                  # entities, DTOs, filters, enums, flow-step types
├── constants/{domain}.ts              # business constants, timers, routes, mock/presentation data
├── services/api/{feature}.service.ts  # `{feature}Api`: Axios + ApiResponse envelope
├── hooks/use{Feature}.ts              # feature orchestration on top of useFetch / useMutation
├── component/{feature}/               # {Feature}Card / Table / FilterBar / Modal + index.ts barrel
└── app/{route}/page.tsx               # thin orchestration only (layout.tsx optional)
```

Create only the layers a feature actually needs.

### Imports

Always use path aliases. Never use deep relative paths (`../../../`).

| Alias              | Example                                                |
| :----------------- | :----------------------------------------------------- |
| `@/components/...` | `import { BaseButton } from '@/components/base';`      |
| `@/context/...`    | `import { useAuth } from '@/context/AuthContext';`     |
| `@/services/api`   | `import { clientApi, authApi } from '@/services/api';` |
| `@/services/axios` | `import api from '@/services/axios';`                  |
| `@/hooks`          | `import { useFetch, useMutation } from '@/hooks';`     |
| `@/type/...`       | `import { IClient, ApiResponse } from '@/type';`       |
| `@/utils/...`      | `import { tokenStorage } from '@/utils/tokenStorage';` |
| `@/constants`      | `import { COLORS, TYPOGRAPHY } from '@/constants';`    |

### Layer & Export Rules

- **Export from the correct directory**:
  - **Types (`@/type`)**: All interfaces, types, DTOs, enums, and domain types (e.g. `ClientsSortField`, `ApiResponse`, `IClient`) MUST be defined in and exported from `src/type/`. Do NOT define or export domain/business types from component files or component barrel files.
  - **Constants (`@/constants`)**: All constants, options, configurations, routes, and static maps MUST be defined in and exported from `src/constants/`.
  - **Exception (Types from Constants)**: Types directly derived from constants (e.g. `export type AllFilterValue = typeof ALL_FILTER_VALUE;`, `export type BaseButtonSize = keyof typeof BASE_BUTTON_SIZES;`, or `export type { LoginStep };` in constant files) are permitted to be exported from `src/constants/` and re-exported through `@/constants`.
- **Barrel `index.ts` files**:
  - MUST strictly use `export * from './...'` (wildcard export only).
  - Do NOT use named exports (`export { Component } from './...'`) or named type exports (`export type { ... } from './...'`) in `index.ts` files.
- **Services**: name objects with the `*Api` suffix. `@/services/api/index.ts` only re-exports (`export * from './...'`). No monolithic facade classes. Services call the live backend only; mock/presentation data goes in `@/constants`.
- **Thin `page.tsx`**: it only wires hooks, state, and components. No business constants, magic numbers (`OTP_EXPIRY_SECONDS`), or domain types/enums (`LoginStep`).
  - Constants, timers, flow-step mappings, routes → `src/constants/{domain}.ts` (re-exported by `src/constants/index.ts`).
  - Interfaces, DTOs, payloads, flow-step types → `src/type/{domain}.ts` (re-exported by `src/type/index.ts`).
- **Component file shape (`*.tsx`)**: a component file contains only the props interface and the function component (plus its default export). Everything else lives in its home layer:
  - Column configs, option lists, static maps → `src/constants/{domain}.ts`.
  - Entities, DTOs, row types → `src/type/{domain}.ts`.
  - Format/map helpers → `utils/` next to the component (or `@/utils` if shared).
  - Data fetching and orchestration → `@/hooks` and `@/services/api`.
- **Boundaries**: base components never re-export feature types or constants. Avoid circular dependencies.
- **UI composition** (native HTML, Base components, no MUI `Box`/`Typography`/`sx`): see `UI_CONVENTIONS.md`.

---

## 3. State Management

Classify each piece of state into the first tier that fits:

| Tier                  | Use when                                                               | Mechanism                                               | Rules                                                          |
| :-------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------------- |
| **1. URL**            | Search, filters, tabs, pagination must survive reload and be shareable | `useSearchParams`, `useRouter`, `usePathname`           | Use `router.replace` while filtering to keep history clean.    |
| **2. Server / async** | Data comes from or goes to the API                                     | `useFetch` (GET), `useMutation` (POST/PUT/PATCH/DELETE) | Provide `loading`, `fetching`, `error`, `refetch`.             |
| **3. Global**         | App-wide: auth session, top-level dashboard filters                    | React Context (`@/context/*`)                           | Never put page- or form-specific state here. No toast context. |
| **4. Local**          | Modal/drawer visibility, draft inputs, hover/selection                 | `useState`, `useReducer`                                | Scope as tightly as possible.                                  |

---

## 4. API & Data Fetching

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  meta: ApiPaginationMeta;
}
```

`useFetch` unwraps `ApiResponse.data`; `usePaginatedFetch` unwraps paginated `data` + `meta`:

```typescript
// Read: refetches automatically when dependencies change
const { data, loading, fetching, error, refetch } = useFetch<IndustryDto[]>(
  () => settingsApi.getIndustries(true),
  [status],
);

// Paginated read: data is T[], meta is separate
const {
  data: rows,
  meta,
  loading,
  fetching,
  error,
  refetch,
} = usePaginatedFetch<ClientListItemDto>(() => clientApi.list({ status, page }), [status, page]);

// Write
const createMutation = useMutation<IClient, CreateClientDto>(
  (payload) => clientApi.create(payload),
  {
    onSuccess: (newClient) => {
      /* refresh list, close modal, redirect */
    },
    onError: (message) => {
      /* set inline error */
    },
  },
);
await createMutation.mutate(formData);
```

- `loading`: initial load only → render Skeletons.
- `fetching`: background refetch → keep the existing layout (no layout shift).

---

## 5. Forms

1. **State**: `values`, `errors` (`Record<keyof FormValues, string>`), `isSubmitting`.
2. **`onChange`**: clear that field's error.
3. **`onBlur`**: validate that field.
4. **`onSubmit`**: `e.preventDefault()` → validate all fields → on errors, set `errors`, focus the first invalid field, stop → otherwise set `isSubmitting` and mutate.
5. **Server errors**: map 400/422 field errors into `errors` (`error` + `helperText`); show general errors in an inline alert at the top of the form.

Required: `<form noValidate>` (no native browser popups), and the submit `BaseButton` gets `disabled={isSubmitting}` and `loading={isSubmitting}`.

---

## 6. Inline Feedback (No Toasts)

Floating toasts are prohibited. Every notification is contextual and inline:

| Scenario                        | Handled by                     | UI                                                      |
| :------------------------------ | :----------------------------- | :------------------------------------------------------ |
| Network error / timeout         | API call catch                 | Inline warning with **Retry**                           |
| Data fetch failure (500/404)    | `useFetch` `error`             | `<BaseErrorState message={error} onRetry={refetch} />`  |
| Empty data (200, `[]`)          | `!data \|\| data.length === 0` | Empty state with message + CTA                          |
| Form validation (client or 400) | Form validation                | Field `error` + `helperText` (`COLORS.secondary.red4`)  |
| Session expired (401)           | Axios response interceptor     | Purge tokens, reset `AuthContext`, redirect to `/login` |
| Runtime UI crash                | `error.tsx` / `ErrorBoundary`  | Fallback screen with **Reload**                         |

Rendering details for these states: `UI_CONVENTIONS.md` §3.

---

## 7. Auth & Storage

- `localStorage` holds **tokens only**: `greenx7_access_token`, `greenx7_refresh_token`.
- User profile (`currentUser`, `AuthUserDto`) and permissions live **only in memory** (`AuthContext`).
- On logout or unrecoverable 401: purge all tokens and reset `AuthContext` to `null`.

---

## 8. YAGNI & Surgical Changes

- Write the minimum code that solves the immediate problem. No wrapper utility used in only one place. Prefer inline feedback over notification libraries.
- Touch only the lines and files the task needs. No drive-by refactors or formatting changes that inflate diffs.

---

## 9. Verification & Type Checking (No Build)

- **Forbidden during dev & verification**: Do NOT run `next build`, `npm run build`, or `yarn build` just to verify changes. Next.js build prerenders and exports 70+ static pages, causing high memory spikes and wasting time.
- **Type check**: Run `yarn tsc --noEmit` (or `yarn type-check`) for lightweight type checking with low memory usage.
- **Lint**: Run `yarn lint`.
