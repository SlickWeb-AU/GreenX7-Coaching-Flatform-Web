# GreenX7 UI & Design System Conventions

Mandatory for all developers and AI agents building or modifying UI. Architecture, state, and API rules live in `PROJECT_CONVENTIONS.md`.

---

## 1. Component Rules

Pick the first option that fits:

1. **Layout & text → native HTML** (`div`, `p`, `span`, `h1`–`h6`, `section`, `header`, `button`) styled with Tailwind tokens + `clsx`.
2. **Interactive / design-system controls → Base component** from `@/components/base`: `BaseButton`, `BaseInput`, `BaseSelect`, `BaseCard`, `BaseDialog`, `BaseTable`, `BaseTableRow`, `BaseSwitch`, `BaseTabs`, `BasePill`, `BasePagination`, `BaseOtp`, `BaseLabel`, `DeltaBadge`.
3. **Specialized MUI primitive** (`Drawer`, `Menu`, `Tooltip`, `Slider`, `Skeleton`) → wrap once inside `@/components/base/*` with a module-level `styled()`. Never import it in feature code.

### Component Declaration & Typing (All Code)

- ❌ **`React.FC` / `FC` is forbidden**: Never type components as `React.FC<Props>` or `FC<Props>`.
- ❌ **`React.*` namespace calls are forbidden**: Do not use `React.useState`, `React.useEffect`, `React.useCallback`, `React.useMemo`, etc. Import hooks and types directly (`import { useState, useEffect, useCallback, type ReactNode, type FormEvent } from 'react'`).
- ❌ **Unnecessary `<Suspense>` page wrappers are forbidden**: Do not wrap whole page contents in `<Suspense>` unless explicitly architected for streaming.
- ✅ **Standard typed arguments**: Type props directly on the function parameter:
  - `export function Comp({ title }: CompProps) { ... }`
  - `export const Comp = ({ title }: CompProps) => { ... };`
- If children are accepted, explicitly define `children?: ReactNode` in the component props interface.

### Feature code (`src/app/*`, `src/component/{feature}/*`)

- ❌ MUI `Box` / `Typography` / raw MUI components, `sx`, inline `style`, hand-built Skeletons, template-literal class strings.
- ✅ Tailwind token classes for all spacing, layout, color, and typography.
- ✅ `clsx` for conditional classes and for merging an external `className`.

### Base components (`src/component/base/*`)

- **Styling**: `styled(MuiComponent)` at module level for colors, borders, shadows, hover/active/focus, `.Mui-disabled`/`.Mui-error`. No `sx`, no fixed heights. Never override MUI internal classes in `globals.css`.
- **Sizes**: via `size` prop from static dictionaries in `src/constants/base/*.ts` (e.g. `BaseButton`: `'xs' | 'small' | 'medium' | 'mediumPlus' | 'large'`, default `'medium'`; use `'xs'` for compact cases like pagination). Custom components and wrapped MUI primitives size via `size` prop — never hard-code `width`/`height`/`padding` in `styled()` when Tailwind can do it. Native HTML tags (`div`, `p`, `span`, `button`) size via Tailwind classes (`w-8`, `h-8`, `body-14-*`).
- **Skeletons**: form controls accept `loading?: boolean` and render a size-matched Skeleton. `BaseButton`: `loading` = submit spinner, `skeleton` = initial page load.
- **Tokens only**: full `TYPOGRAPHY.*` tokens (never a lone `fontSize`); direct `COLORS.*` access with no fallbacks (`COLORS.neutral?.grey2 || '#...'` is forbidden).
- **`className`**: accept it and merge with `clsx` so callers can adjust layout (`w-full`, `mt-4`).
- **Barrels**: `src/component/base/index.ts` exports only base components and their prop types.

### Form field spec

- **`BaseLabel`** (wraps MUI `FormLabel`): `small` → `caption-12-bold`, `medium` → `body-14-bold`, `large` → `body-16-bold`. Asterisk and error use `COLORS.secondary.red4`.
- **Placeholder**: `body-16-medium`, `COLORS.neutral.grey3`, `opacity: 1`.
- **Field error**: `mt-2` below the field, `body-16-medium`, `COLORS.secondary.red4`; cleared on `onChange`.
- **Input border**: `border-primary-main`.
- **Select border**: `1px solid ${COLORS.neutral.grey5}` (`#CBD1CD`). Error: `COLORS.secondary.red4`.
- **Border radius**: interactive controls (`BaseInput`, `BaseSelect`, `BaseButton` when `pill={false}`, sidebar nav items) use `8px` (`rounded-lg`). Modals use `24px` (`rounded-2xl`).
- **Select labels & variant**: Without `variant` (default) → use the external `BaseLabel`. With `variant="filled"` → hide `BaseLabel` and use the inner `label` in `StyledSelect`.
- **Select dropdown arrow**: `COLORS.neutral.grey3` (`#6A7A72`).
- **Header controls gap**: Gap between Selects and Buttons in the Header is `8px` (`gap-2`).

### Table spec

- **Never hand-roll `<table>` in feature code** — use `BaseTable` from `@/components/base`. Define columns antd-style, then pass `data` + `meta` (`PaginationMeta` from `@/types/api`):

```tsx
import { BaseTable, type BaseColumn } from '@/components/base';

const columns: BaseColumn<ClientListItem>[] = [
  { key: 'name', title: 'Client', sorter: 'businessName', render: (_, row) => (...) },
  { key: 'industry', title: 'Industry', dataIndex: 'industry', sorter: 'industry' },
  { key: 'departments', title: 'Departments', dataIndex: 'departmentCount', align: 'right' },
];

<BaseTable
  columns={columns}
  data={rows}
  rowKey="id"
  meta={data?.meta}
  onPageChange={(p) => setParams({ page: p > 1 ? String(p) : null })}
  sortField={sortKey}
  sortOrder={sortAsc ? 'asc' : 'desc'}
  onSortChange={handleSort}
  loading={isLoading}
  onRowClick={(row) => router.push(`/admin/clients/${row.id}`)}
/>;
```

- **`BaseColumn<T>`**: `key` (unique), `title`, `dataIndex?: keyof T` (plain value cells), `render?(value, record, index)` (custom cells; required for object values — a bare object cell renders `—`), `sorter?: boolean | string` (`true` = sort by `key`, string = custom sort key), `align`, `width`, `className` / `headerClassName`.
- **Sorting is controlled**: `sortField` + `sortOrder` + `onSortChange`. Sortable headers render a button with an `▲/▼/↕` indicator. Keep sort state in URL search params (`PROJECT_CONVENTIONS.md` §3 Tier 1).
- **States**: `loading` renders skeleton rows with `aria-busy` on the table; empty `data` renders the shared empty card — override via `emptyTitle` / `emptyDescription` / `emptyAction`.
- **Row click**: `onRowClick(record, index)` adds pointer cursor + hover. `rowKey` accepts `keyof T` or `(record, index) => string`.
- **Footer pagination**: shown when `meta` + `onPageChange` are provided (hide with `showFooter={false}`), sitting 24px (`gap-6`) below the table. Left shows `Showing X–Y of Z` (from `meta.total` / `meta.pageSize`); right shows Prev/Next icon buttons flanking numbered page buttons — large totals window as `1 … 4 5 6 … 20` (all pages when `totalPages <= 7`). Every button is `BaseButton` `size="small"` at 32×32 (`h-8 w-8 px-0`); the active page uses `variant="primary"`.
- **`BasePagination`** is reused inside the `BaseTable` footer and can be used standalone: `<BasePagination meta={meta} onPageChange={setPage} />` (also accepts manual `page` / `totalPages` without `meta`; hide the range with `showTotal={false}`).

### Example

```tsx
import clsx from 'clsx';
import { BaseButton, BaseInput } from '@/components/base';

<div
  className={clsx(
    'flex flex-col gap-2 rounded-2xl border p-5 transition-all',
    isHighlighted
      ? 'border-primary-main bg-primary-lighter'
      : 'border-border-default bg-background-card',
    className,
  )}
>
  <h3 className="body-18-bold text-text-primary">Card Title</h3>
  <p className="body-14-regular text-text-muted">Description</p>
  <BaseInput
    label="Work Email"
    size="medium"
    loading={isLoading}
    className="w-full"
    error={Boolean(error)}
    helperText={error}
  />
  <BaseButton loading={isSubmitting} skeleton={isLoading}>
    Save Changes
  </BaseButton>
</div>;
```

---

## 2. Design Tokens

### Typography

Tailwind class `{group}-{size}-{weight}` maps to `TYPOGRAPHY.{group}{Size}{Weight}` (e.g. `body-14-medium` → `TYPOGRAPHY.body14Medium`). Weights: bold 700, semibold 600, medium 500, regular 400.

| Group      | Size / line height (px)    | Weights               | Letter spacing |
| :--------- | :------------------------- | :-------------------- | :------------- |
| `heading`  | 64/68, 48/52               | bold                  | -3%            |
| `heading`  | 36/40, 32/36, 28/32, 24/28 | bold                  | -2%            |
| `heading`  | 20/26                      | bold, semibold        | -2%            |
| `body`     | 18/24, 16/22               | bold, medium, regular | -2%            |
| `body`     | 14/20                      | bold, medium, regular | -1%            |
| `body`     | 13/18                      | medium, regular       | -1%            |
| `body`     | 12/18                      | bold, medium, regular | -1%            |
| `caption`  | 12/18                      | bold, medium, regular | -1%            |
| `caption`  | 10/14                      | bold, medium          | 0              |
| `overline` | 11/16, 12/16               | bold (UPPERCASE)      | +5%            |

### Colors

TypeScript `COLORS.{group}.{camelName}` maps to Tailwind `{bg|text|border}-{group}-{kebab-name}` (`cardSubtle` → `bg-background-card-subtle`, `red4` → `text-secondary-red-4`). Hover variants: `hover:bg-primary-hover`, `hover:bg-background-hover`.

| Group        | Tokens                                                                                                                     | Notes                                                      |
| :----------- | :------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| `primary`    | main `#005943`, hover `#004835`, dark `#003326`, deep `#05513D`, light `#CFE4CA`, lighter `#E7F1E5`, subtle `#EAF0EA`      | `bg-brand-green-2` aliases `primary-main`                  |
| `secondary`  | yellow1 `#EBD343`, red4 `#B43E47`                                                                                          | red4 = error                                               |
| `accent`     | yellow `#F5D547`, green `#63D556`                                                                                          |                                                            |
| `neutral`    | grey1 `#12211C`, grey2 `#53635C`, grey3 `#6A7A72`, grey4 `#BFCFC5`, grey5 `#CBD1CD`, grey7 `#EDF3EF`, whiteSolid `#FFFFFF` | grey3 = placeholder, grey4 = border, grey5 = select border |
| `text`       | primary `#111827`, secondary `#374151`, muted `#6B7280`, light `#9CA3AF`, darkMuted `#5C6E66`, white `#FFFFFF`             | Tailwind: `text-text-*`                                    |
| `background` | page `#F4F7F2`, card `#FFFFFF`, cardSubtle `#F8FAF8`, tableHead `#EAF0EA`, hover `#F9FAF9`, disabled `#F3F4F6`             |                                                            |
| `border`     | default `#E6EBE6`, input `#D1D5DB`, line `#E2E8E2`, lineSoft `#EFF3EF`, light `#F0F4F0`, divider `#F0F3F0`                 |                                                            |
| `status`     | up `#0A7D5C`, down `#D6464F`, warn `#F5D547`                                                                               |                                                            |

---

## 3. UI States

Every data-driven view (Card, Table, List, Form) handles all five states. Behavior rules: `PROJECT_CONVENTIONS.md` §6.

| State          | Trigger                   | Rendering                                                                                                      |
| :------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------- |
| **Loading**    | Initial fetch (`loading`) | `loading` prop on Base form controls and `BaseTable` (auto size-matched Skeletons); `skeleton` on `BaseButton` |
| **Error**      | `error` from `useFetch`   | Error card with **Retry** (`refetch`)                                                                          |
| **Empty**      | 200 with no items         | Dashed container with message + CTA                                                                            |
| **Content**    | Data present              | `BaseCard`, `BaseTable`, or grid                                                                               |
| **Submitting** | Mutation in flight        | `loading={isSubmitting}` on `BaseButton` (spinner, blocks double click)                                        |

**Page-level loading/error**: keep the page `BaseHeader` visible in every branch — render `<BaseLoading fullScreen={false} />` or `<BaseErrorState onRetry={refetch} />` below the header instead of returning them full-screen. Guard with `!data` (`(loading || fetching) && !data`, `error && !data`) so background refetches keep the existing layout.

```tsx
// Error: shared card from @/components/base (never hand-roll this markup)
if (error) {
  return <BaseErrorState message={error} onRetry={refetch} />;
}

if (!data || data.length === 0) {
  return (
    <div className="border-border-default flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-12 text-center">
      <p className="body-16-bold text-text-primary mb-1">No items found</p>
      <p className="body-14-regular text-text-muted mb-4 max-w-sm">
        Get started by creating a new entry or adjusting your filters.
      </p>
      <BaseButton size="small" onClick={handleCreate}>
        Add New Item
      </BaseButton>
    </div>
  );
}
```

---

## 4. Feature Page Anatomy

Every feature page has four zones, top to bottom:

1. **Header**: breadcrumbs / title on the left, primary CTA on the right.
2. **Filter toolbar**: search input, status dropdown, date range, clear-filters action.
3. **Main content**: `BaseTable` or `BaseCard` grid, handling all five UI states.
4. **Footer**: result count ("Showing 1–10 of 120") and `BasePagination`.

---

## 5. Overlays

| Overlay    | Component            | Use for                                                                           | Specs                                                                                                 |
| :--------- | :------------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Modal**  | `BaseDialog`         | Short forms (1–5 fields), confirmations, destructive actions                      | 4px backdrop blur, 24px radius, dismiss on ESC / backdrop click. Destructive: `COLORS.secondary.red4` |
| **Drawer** | Wrapped MUI `Drawer` | Entity inspection, multi-step forms without leaving the page, mobile filter panel | `anchor="right"`, width `w-full max-w-md` or `max-w-xl`, persistent close button in header            |

---

## 6. Responsive

- **Breakpoints**: Tailwind defaults `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- **Touch targets**: at least 44×44px on mobile for buttons, inputs, and tabs.
- **Tables**: below `md`, replace with stacked `BaseCard` views.
- **Toolbars**: `flex-row` on desktop, `flex-col w-full` on mobile.
