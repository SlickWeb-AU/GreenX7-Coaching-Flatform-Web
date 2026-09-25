# GreenX7 UI & Design System Conventions

Mandatory UI, design tokens, and component guidelines for all developers and AI agents building or modifying the frontend. Architecture, API, and state rules live in `PROJECT_CONVENTIONS.md`.

---

## 1. UI Tech Stack & Component Hierarchy

### Core Tech Stack

- **Styling**: Tailwind CSS v3 with CSS variables & customized tokens (`tailwind.config.ts`, `globals.css`).
- **Icons**: Lucide React (`lucide-react`) and custom SVG icons in `@/components/icons`.
- **Primitives**: Radix UI headless components (`@radix-ui/react-*`).
- **Class Utilities**: `clsx` and `tailwind-merge` unified via `@/lib/utils` (`cn(...)`).
- **Strict Rule**: **NO Material UI (MUI)**, **NO Emotion `styled()`**, **NO `sx` props**, **NO inline style objects** for layout.

### Component Composition Rules

Pick the first option that fits:

1. **Layout & Text → Native Semantic HTML** (`div`, `p`, `span`, `h1`–`h6`, `section`, `header`, `button`) styled with Tailwind classes + typography utilities.
2. **Interactive / Base Design-System Controls → Base Components** from `@/components/base`:
   - `BaseButton`, `BaseIconButton`
   - `BaseInput`
   - `BaseSelect`, `BaseSelectInside`
   - `BaseTable`, `BasePagination`
   - `BaseCard`, `BaseDialog`, `BasePopover`
   - `BaseTabs`, `BasePillTabs`, `BaseSwitch`, `BaseOtp`, `BaseTag`
   - `BaseHeader`, `BaseBreadcrumb`, `BaseLink`, `BaseLoading`, `BaseDatePicker`
3. **Complex Domain Components** → Build inside `@/components/{domain}/` (e.g. `@/components/clients/ClientsTable.tsx`, `@/components/dashboard/WellbeingScoreCard.tsx`) by composing Base components and Tailwind styling.

### Component Declaration & Typing

- ❌ **`React.FC` / `FC` is forbidden**: Never type components as `React.FC<Props>` or `FC<Props>`.
- ❌ **`React.*` namespace imports are forbidden**: Do not use `React.useState`, `React.useEffect`, `React.useCallback`, `React.useMemo`, etc. Import directly from `'react'`.
- ✅ **Standard typed arguments**: Type props directly on the function parameter:
  ```tsx
  import { useState, type ReactNode } from 'react';

  export interface UserCardProps {
    name: string;
    avatarUrl?: string | null;
    children?: ReactNode;
    className?: string;
  }

  export function UserCard({ name, avatarUrl, children, className }: UserCardProps) {
    return (
      <div className={cn('rounded-2xl border border-neutral-grey-7 bg-white p-4', className)}>
        <h4 className="body-16-bold text-neutral-grey-1">{name}</h4>
        {children}
      </div>
    );
  }
  ```

---

## 2. Design Tokens & Styling System

### Typography Utility Classes (`src/app/globals.css`)

Always use the predefined typography utility classes instead of manual arbitrary font sizes:

| Group       | Utility Class        | Tailwind Font / Line-height | Weight        | Letter Spacing   |
| :---------- | :------------------- | :-------------------------- | :------------ | :--------------- |
| **Heading** | `heading-64-bold`    | `text-[64px]/[68px]`        | Bold (700)    | `tracking-tight` |
|             | `heading-48-bold`    | `text-[48px]/[52px]`        | Bold (700)    | `tracking-tight` |
|             | `heading-28-bold`    | `text-[28px]/[32px]`        | Bold (700)    | `tracking-tight` |
|             | `heading-20-bold`    | `text-xl/[26px]`            | Bold (700)    | `tracking-tight` |
| **Body**    | `body-32-bold`       | `text-[32px]/[38px]`        | Bold (700)    | `tracking-tight` |
|             | `body-20-bold`       | `text-xl/[26px]`            | Bold (700)    | `tracking-tight` |
|             | `body-18-bold`       | `text-lg/[24px]`            | Bold (700)    | `tracking-tight` |
|             | `body-18-medium`     | `text-lg/[24px]`            | Medium (500)  | `tracking-tight` |
|             | `body-16-bold`       | `text-base/[22px]`          | Bold (700)    | `tracking-tight` |
|             | `body-16-medium`     | `text-base/[22px]`          | Medium (500)  | `tracking-tight` |
|             | `body-14-bold`       | `text-sm/[20px]`            | Bold (700)    | `tracking-tight` |
|             | `body-14-medium`     | `text-sm/[20px]`            | Medium (500)  | `tracking-tight` |
|             | `body-14-regular`    | `text-sm/[20px]`            | Regular (400) | `tracking-tight` |
|             | `body-12-bold`       | `text-xs/[18px]`            | Bold (700)    | `tracking-tight` |
|             | `body-12-medium`     | `text-xs/[18px]`            | Medium (500)  | `tracking-tight` |
| **Caption** | `caption-12-regular` | `text-xs/[18px]`            | Regular (400) | `tracking-tight` |
|             | `caption-12-bold`    | `text-xs/[18px]`            | Bold (700)    | `tracking-tight` |

- **Font family**: Satoshi (`font-satoshi` / `var(--font-satoshi)`).

### Color Tokens (`tailwind.config.ts` & `src/constants/tokens.ts`)

| Category             | Tailwind Class Prefix                                                  | Hex Values           | Usage                                                                |
| :------------------- | :--------------------------------------------------------------------- | :------------------- | :------------------------------------------------------------------- |
| **Brand Primary**    | `bg-brand-green-2`, `text-brand-green-2`, `border-brand-green-2`       | `#005943`            | Primary brand action, active sidebar item, primary button background |
|                      | `bg-brand-green-3`, `text-brand-green-3`                               | `#63D556`            | Live data dot & active pulsing indicator                             |
|                      | `bg-brand-green-4`, `border-brand-green-4`                             | `#C7E3A9`            | Live data card border                                                |
| **Neutral Grey**     | `text-neutral-grey-1`, `bg-neutral-grey-1`                             | `#12211C`            | Primary heading text, dark surfaces                                  |
|                      | `text-neutral-grey-2`                                                  | `#53635C`            | Secondary body text, form field labels                               |
|                      | `text-neutral-grey-3`                                                  | `#6A7A72`            | Muted descriptions, placeholder text, chevron icons                  |
|                      | `border-neutral-grey-4`                                                | `#BFCFC5`            | Input hover border                                                   |
|                      | `border-neutral-grey-5`                                                | `#CBD1CD`            | Default input & select borders                                       |
|                      | `border-neutral-grey-6`                                                | `#DFE5E1`            | Divider lines                                                        |
|                      | `bg-neutral-grey-7`, `border-neutral-grey-7`                           | `#EDF3EF`            | Card borders, skeleton placeholders, subtle hover                    |
|                      | `bg-neutral-grey-8`                                                    | `#F6F8F5`            | Page background, secondary input background                          |
|                      | `bg-white`, `text-white`                                               | `#FFFFFF`            | Solid white cards, primary button text                               |
| **Secondary Red**    | `text-secondary-red-4`, `border-secondary-red-4`, `bg-secondary-red-2` | `#B43E47`, `#FBE3E7` | Form errors, destructive actions, survive zone badge                 |
| **Secondary Green**  | `text-secondary-green-4`, `bg-secondary-green-2`                       | `#087452`, `#E6F2D8` | Active status badges, success indicators                             |
| **Secondary Yellow** | `text-secondary-yellow-3`, `bg-secondary-yellow-2`                     | `#9E892E`, `#FAF4D0` | Function zone badge, warning indicator                               |

### Wellbeing Zone Colors (`ZONE_COLORS` in `@/constants/tokens.ts`)

- **Thrive Zone** (80–100%): `color: #005943`, `bg: #E6F2D8`
- **Momentum Zone** (70–79%): `color: #087452`, `bg: #E6F2D8`
- **Function Zone** (50–69%): `color: #53635C`, `bg: #FAF4D0`
- **Survive Zone** (0–49%): `color: #B43E47`, `bg: #FBE3E7`

---

## 3. Base Component Specifications & Patterns

### 1. `BaseButton` (`@/components/base`)

```tsx
<BaseButton
  variant="primary" // 'primary' (brand green) | 'secondary' (white with border) | 'ghost'
  size="medium" // 'small' (h-9 body-14-bold) | 'medium' (h-11 body-14-bold) | 'mediumPlus' (h-12 body-16-bold)
  pill // boolean: rounded-full (true) vs rounded-lg 8px (false)
  loading={isPending} // boolean: shows spin loader Loader2 and disables click
  skeleton={isLoading} // boolean: renders size-matched pulse placeholder
  startIcon={<PlusIcon />}
  onClick={handleClick}
>
  Add Client
</BaseButton>
```

### 2. `BaseInput` (`@/components/base`)

```tsx
<BaseInput
  label="Business name"
  placeholder="Enter business name"
  size="medium" // 'small' (h-9) | 'medium' (h-10) | 'mediumPlus' (h-12)
  variant="primary" // 'primary' (bg-white) | 'secondary' (bg-neutral-grey-8)
  prefix={<SearchIcon aria-hidden />}
  error={Boolean(errors.businessName)}
  helperText={errors.businessName?.message}
  loading={isLoading} // Pulse skeleton
  {...register('businessName')}
/>
```

- **Error state**: Red border `border-secondary-red-4`, error helper text `text-secondary-red-4` (`body-14-medium`).
- **Focus state**: Green border `focus:border-brand-green-2` without ugly browser outlines.

### 3. `BaseSelect` (`@/components/base`)

```tsx
<BaseSelect
  label="Industry"
  placeholder="Select industry"
  value={selectedIndustry}
  options={[
    { value: 'all', label: 'All industries' },
    { value: 'tech', label: 'Technology' },
  ]}
  onChange={(val) => setSelectedIndustry(val)}
  size="medium"
  startIcon={<FilterSlidersIcon />}
  error={Boolean(error)}
  helperText={error}
/>
```

- **Smart Popover Positioning**: Auto-detects viewport clearance and renders dropdown either downward or upward to prevent off-screen clipping.

### 4. `BaseTable` & `BasePagination` (`@/components/base`)

Use `BaseTable` for all tabular data displays. Never hand-roll `<table>` elements in page views:

```tsx
import { BaseTable, type BaseColumn } from '@/components/base';

const columns: BaseColumn<ClientListItem>[] = [
  {
    key: 'name',
    title: 'Client Name',
    sorter: 'businessName',
    render: (_, row) => (
      <span className="body-14-bold text-neutral-grey-1">{row.businessName}</span>
    ),
  },
  {
    key: 'industry',
    title: 'Industry',
    dataIndex: 'industryName',
    sorter: 'industry',
  },
  {
    key: 'departments',
    title: 'Departments',
    align: 'right',
    render: (_, row) => <span>{row.departmentCount ?? 0}</span>,
  },
];

<BaseTable
  columns={columns}
  data={rows}
  rowKey="id"
  meta={data?.meta}
  page={page}
  totalPages={data?.meta.totalPages}
  onPageChange={(p) => setParams({ page: p > 1 ? String(p) : null })}
  sortField={sortField}
  sortOrder={sortAsc ? 'asc' : 'desc'}
  onSortChange={handleSortChange}
  loading={isLoading}
  onRowClick={(row) => router.push(`/admin/clients/${row.id}`)}
/>;
```

- **Footer & Pagination**: When `meta` and `onPageChange` are supplied, `BaseTable` automatically renders `BasePagination` (`Showing 1–10 of 120` on the left, Previous/Next + windowed numbered buttons on the right).
- **Sorting**: Pass `sortField`, `sortOrder` (`'asc'` | `'desc'`), and `onSortChange`. Column headers render interactive sort indicators.

### 5. `BaseDialog` (`@/components/base`)

```tsx
<BaseDialog title="Create new department" onClose={() => setIsOpen(false)} className="max-w-lg">
  <form onSubmit={handleSubmit} noValidate>
    <BaseInput label="Department name" {...register('name')} />
    <div className="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </BaseButton>
      <BaseButton type="submit" loading={isSubmitting}>
        Save
      </BaseButton>
    </div>
  </form>
</BaseDialog>
```

- **Specs**: Semi-transparent dark backdrop with animation (`bg-black/50 animate-in fade-in-0`), `rounded-2xl`, responsive padding, ESC key listener, and top-right close icon button.

---

## 4. UI States & Handling

Every data-driven page or section must handle all 5 primary states:

| State                      | Condition                                     | Rendering Pattern                                                                                                                                                                       |
| :------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Loading (Initial)**   | `isLoading && !data`                          | `<BaseLoading message="Loading..." fullScreen />` for pages, or skeleton rows in `BaseTable`                                                                                            |
| **2. Background Fetching** | `isFetching && data`                          | Keep existing UI rendered without full-screen overlays (no jarring layout shift)                                                                                                        |
| **3. Error**               | `error && !data`                              | Error card with message and **Retry** button (`<BaseButton onClick={refetch}>Retry</BaseButton>`) for tables/lists; aggregate dashboard pages use `toast.error(...)` and keep cached UI |
| **3b. No submissions**     | Period has data `null` (200 OK, no check-ins) | Display `—`, never `0`, for scores, changes, counts and zone percentages                                                                                                                |
| **4. Empty**               | `!isLoading && rows.length === 0`             | Dashed border container with descriptive text + CTA action button                                                                                                                       |
| **5. Content**             | Normal data available                         | Render interactive `BaseTable`, `BaseCard` grid, or forms                                                                                                                               |

---

## 5. Feature Page Anatomy & Layout

Standard admin pages follow a uniform 4-zone top-to-bottom structure:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Header: BaseHeader with title, breadcrumbs & action CTA   │
│    (e.g. "Clients" + Pill "Add client" button)              │
├─────────────────────────────────────────────────────────────┤
│ 2. Toolbar Card: White rounded-2xl container                │
│    - Left: BaseInput search with SearchIcon                 │
│    - Right: BaseSelect filters (Industry, Status, Date)     │
├─────────────────────────────────────────────────────────────┤
│ 3. Main Content:                                            │
│    - BaseTable (with skeleton loaders or empty state)       │
│    - Or BaseCard responsive grid                            │
├─────────────────────────────────────────────────────────────┤
│ 4. Table Footer / Pagination:                               │
│    - "Showing 1–10 of 48" + Windowed page buttons (1 … 4 5) │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Responsive & Accessibility Standards

- **Breakpoints**: Standard Tailwind breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Touch Targets**: All clickable buttons and interactive triggers must have a minimum target area of 36×36px (desktop) and 44×44px (mobile).
- **ARIA Attributes**:
  - Inputs: `aria-invalid={error}`, `aria-required={required}`.
  - Buttons: `aria-label` for icon-only buttons (`BaseIconButton`).
  - Dropdowns & Dialogs: `role="dialog"`, `aria-modal="true"`, `role="combobox"`, `aria-expanded`.
  - Spinners / Skeletons: `aria-hidden="true"` or `aria-busy="true"`.
