'use client';

import { Search, X } from 'lucide-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Chờ bao lâu sau khi người dùng ngừng gõ mới bắn request */
  debounceMs?: number;
}

/**
 * Ô tìm kiếm có debounce sẵn. Không debounce thì mỗi ký tự là một request —
 * gõ "cà chua" là 7 lần gọi API và 7 lần render lại bảng.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
  debounceMs = 400,
}: SearchInputProps) {
  const [draft, setDraft] = React.useState(value);

  // Đồng bộ khi giá trị bị reset từ bên ngoài (ví dụ bấm "xoá bộ lọc")
  React.useEffect(() => setDraft(value), [value]);

  React.useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => onChange(draft), debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, debounceMs]);

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {draft && (
        <button
          type="button"
          onClick={() => setDraft('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Xoá tìm kiếm"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
