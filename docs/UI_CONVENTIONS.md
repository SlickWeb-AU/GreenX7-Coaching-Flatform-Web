# GreenX7 UI & Design System Conventions

Mandatory UI guidelines, design tokens, and component standards for developers building the GreenX7 frontend. Architecture, API, and routing rules live in `PROJECT_CONVENTIONS.md`.

---

## Core UI Principles

Before implementing or modifying frontend UI, adhere to these key principles:

1. **Reuse Base Components**: Always reach for `@/components/base` (`BaseButton`, `BaseInput`, `BaseSelect`, `BaseTable`, etc.) before creating custom interactive elements.
2. **Clean Component Signatures**: Type props directly on the function parameter (`export function Component({ title }: ComponentProps)`). Avoid `React.FC`.
3. **Direct Named React Imports**: Import hooks and types directly from `'react'` (e.g. `import { useState } from 'react'`). Avoid `React.*` namespace prefixes.
4. **Token Consistency**: Stick strictly to Tailwind tokens defined in `src/constants/tokens.ts` and `globals.css`. Never introduce arbitrary hex codes or external UI component libraries (NO Radix, MUI, Emotion).
5. **Standard Button Hierarchy**: Use standard variants (`primary` for main CTA, `secondary` for Cancel/Back, `ghost` for subtle actions, `outline` for themed highlights).

---

## 1. Component Composition & Hierarchy

When building or modifying UI, select the appropriate tier:

1. **Text & Structure Layout** → Semantic HTML (`div`, `p`, `span`, `h1`–`h6`, `section`, `header`) styled with Tailwind classes + typography utilities.
2. **Interactive Controls** → Design-system components from `@/components/base`:
   - Buttons: `BaseButton`, `BaseIconButton`
   - Form Inputs: `BaseInput`, `BaseSelect`, `BaseSelectInside`, `BaseSwitch`, `BaseOtp`, `BaseDatePicker`
   - Data Presentation: `BaseTable`, `BasePagination`, `BaseCard`, `BaseTag`, `BaseTrend`
   - Overlays & Navigation: `BaseDialog`, `BasePopover`, `BaseTabs`, `BasePillTabs`, `BaseHeader`, `BaseBreadcrumb`, `BaseLink`, `BaseLoading`
3. **Domain Components** → Build in `@/components/{domain}/` (e.g. `@/components/clients/ClientsTable.tsx`) by composing Base components and Tailwind styling.

### Standard Component Declaration Pattern

```tsx
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

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

### Typography Utilities (`src/app/globals.css` is the source of truth)

Always use predefined typography utility classes instead of arbitrary `text-[...px]`:

- Headings: `heading-64-bold`, `heading-48-bold`, `heading-32-bold`
- Body: `body-20-bold`, `body-16-bold`, `body-16-medium`, `body-14-bold`, `body-14-medium`, `body-14-regular`
- Caption: `caption-12-bold`, `caption-12-medium`, `caption-12-regular`
- Font family: Satoshi (`font-satoshi`).

### Color Tokens (`tailwind.config.ts` & `@/constants/tokens`)

| Category          | Tailwind Class Prefix                                            | Standard Usage                                              |
| :---------------- | :--------------------------------------------------------------- | :---------------------------------------------------------- |
| **Brand Primary** | `bg-brand-green-2`, `text-brand-green-2`, `border-brand-green-2` | Primary brand actions, active navigation, primary button bg |
|                   | `bg-brand-green-3`, `text-brand-green-3`                         | Active live pulsing dots, accent indicators                 |
|                   | `bg-brand-green-4`, `border-brand-green-4`                       | Live data cards border & soft backgrounds                   |
| **Neutral Grey**  | `text-neutral-grey-1`, `bg-neutral-grey-1`                       | Primary heading text, dark surfaces                         |
|                   | `text-neutral-grey-2`                                            | Secondary body text, form field labels                      |
|                   | `text-neutral-grey-3`                                            | Muted descriptions, placeholder text, chevron icons         |
|                   | `border-neutral-grey-5`                                          | Default input & select borders                              |
|                   | `border-neutral-grey-6`                                          | Divider lines                                               |
|                   | `bg-neutral-grey-7`, `border-neutral-grey-7`                     | Card borders, skeleton placeholders                         |
|                   | `bg-neutral-grey-8`                                              | Page background, subtle section background                  |
|                   | `bg-white`, `text-white`                                         | Card backgrounds, primary button text                       |
| **Status Colors** | `text-secondary-red-4`, `bg-secondary-red-2`                     | Errors, destructive actions, survive zone                   |
|                   | `text-secondary-green-4`, `bg-secondary-green-2`                 | Active status badges, success indicators                    |
|                   | `text-secondary-yellow-3`, `bg-secondary-yellow-2`               | Warnings, function zone                                     |

---

## 3. Base Component Specifications

### 1. `BaseButton` (`@/components/base`)

```tsx
import { BaseButton } from '@/components/base';
import { PlusIcon } from 'lucide-react';

// Primary CTA / Submit
<BaseButton
  variant="primary"    // 'primary' (green) | 'secondary' (white border) | 'ghost' | 'outline'
  size="medium"        // 'small' (h-9) | 'medium' (h-11) | 'mediumPlus' (h-12) | 'large' (h-14)
  pill                 // boolean: rounded-full (true) vs rounded-lg (false)
  loading={isPending}  // disables button and shows spinner
  startIcon={<PlusIcon className="h-4 w-4" />}
  onClick={handleClick}
>
  Add Client
</BaseButton>

// Secondary / Cancel
<BaseButton variant="secondary" onClick={handleCancel}>
  Cancel
</BaseButton>
```

### 2. `BaseInput` (`@/components/base`)

```tsx
import { BaseInput } from '@/components/base';
import { Search } from 'lucide-react';

<BaseInput
  label="Client Name"
  placeholder="Enter business name"
  size="medium"
  prefix={<Search className="h-4 w-4 text-neutral-grey-3" />}
  error={Boolean(errors.businessName)}
  helperText={errors.businessName?.message}
  {...register('businessName')}
/>;
```

### 3. `BaseSelect` (`@/components/base`)

```tsx
import { BaseSelect } from '@/components/base';

<BaseSelect
  label="Industry"
  placeholder="Select industry"
  value={selectedIndustry}
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
  ]}
  onChange={(val) => setSelectedIndustry(val)}
  error={Boolean(error)}
  helperText={error}
/>;
```

### 4. `BaseTable` & `BasePagination` (`@/components/base`)

Never hand-roll native `<table>` elements in pages:

```tsx
import { BaseTable, type BaseColumn } from '@/components/base';

const columns: BaseColumn<ClientListItem>[] = [
  {
    key: 'businessName',
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
  },
];

<BaseTable
  columns={columns}
  data={data?.items ?? []}
  rowKey="id"
  meta={data?.meta}
  page={page}
  totalPages={data?.meta?.totalPages}
  onPageChange={(p) => setPage(p)}
  loading={isLoading}
  onRowClick={(row) => router.push(ROUTES.admin.clientDetail(row.id))}
/>;
```

### 5. `BaseDialog` (`@/components/base`)

```tsx
import { BaseDialog, BaseButton, BaseInput } from '@/components/base';

<BaseDialog title="Add Department" onClose={() => setIsOpen(false)} className="max-w-lg">
  <form onSubmit={handleSubmit(onSubmit)} noValidate>
    <BaseInput label="Department Name" {...register('name')} />
    <div className="mt-6 flex justify-end gap-3">
      <BaseButton variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </BaseButton>
      <BaseButton type="submit" loading={isSubmitting}>
        Save
      </BaseButton>
    </div>
  </form>
</BaseDialog>;
```

---

## 4. Five Standard UI States

Every data-driven screen or section must handle all 5 states:

| State                      | Condition                          | Standard Handling                                                                              |
| :------------------------- | :--------------------------------- | :--------------------------------------------------------------------------------------------- |
| **1. Loading (Initial)**   | `isLoading && !data`               | `<BaseLoading message="Loading..." fullScreen />` or table skeleton.                           |
| **2. Background Fetching** | `isFetching && data`               | Keep existing UI rendered without layout shift.                                                |
| **3. Error**               | `error && !data`                   | Show inline error card with Retry button (`<BaseButton onClick={refetch}>Retry</BaseButton>`). |
| **4. Empty**               | `!isLoading && items.length === 0` | Dashed-border empty container with clear helper message and CTA button.                        |
| **5. Content**             | Normal data available              | Render interactive `BaseTable`, grid cards, or forms.                                          |

---

## 5. Touch Targets & Accessibility

- **Interactive Targets**: Minimum clickable target size of 36×36px (desktop) and 44×44px (mobile).
- **Icon Buttons**: Always supply `aria-label` for icon-only buttons (`<BaseIconButton aria-label="Delete item" />`).
- **Form Fields**: Connect error state to `aria-invalid={Boolean(error)}`.
