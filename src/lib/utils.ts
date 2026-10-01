import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { USER_ROLES } from '@/types/auth';

/** Merge Tailwind classes, later classes override earlier ones correctly */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return currencyFormatter.format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatRoleLabel(role?: string | null): string {
  if (!role) return '—';
  if (role === USER_ROLES.SUPER_ADMIN) return 'Super Admin';
  if (role === USER_ROLES.ADMINISTRATOR) return 'Administrator';
  return role.charAt(0) + role.slice(1).toLowerCase();
}

/** Drop empty keys from query params to keep URLs clean and cache keys stable */
export function cleanParams<T extends object>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  ) as Partial<T>;
}

export function getOrdinalSuffix(day: number): string {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) return `${day}st`;
  if (j === 2 && k !== 12) return `${day}nd`;
  if (j === 3 && k !== 13) return `${day}rd`;
  return `${day}th`;
}

export function formatDayOfMonth(dateOrDay: Date | number): string {
  const day = typeof dateOrDay === 'number' ? dateOrDay : dateOrDay.getDate();
  return `${getOrdinalSuffix(day)} of the month`;
}

/**
 * Standard arithmetic rounding: round up when decimal >= 0.5, down when < 0.5
 */
export function roundScore(value: number | null | undefined): number | null {
  if (value === null || value === undefined || isNaN(value)) return null;
  return Math.round(value);
}

/**
 * Formats a score (whether given on a 1–10 scale e.g. 7.2 or 0–100 scale e.g. 72)
 * into a whole-number percentage integer (e.g. 72).
 * Calculation: to 1 decimal place on 1–10 scale (e.g. 7.2) -> displayed as whole-number percentage (72).
 */
export function formatScoreToPercent(score: number | null | undefined): number | null {
  if (score === null || score === undefined || isNaN(score)) return null;
  // If score is on 1–10 scale (e.g. 7.2), convert to 0–100 percentage (7.2 * 10 = 72)
  if (score > 0 && score <= 10) {
    return Math.round(score * 10);
  }
  return Math.round(score);
}

/**
 * Calculates Average Battery % = (sum of the 8 area scores ÷ 8) × 10
 * Each area score can be on 1–10 scale (e.g. 7.2) or 0–100 scale (e.g. 72).
 * Returns a rounded whole-number percentage.
 */
export function calculateAverageBatteryScore(scores: (number | null | undefined)[]): number | null {
  const validScores = scores.filter((s): s is number => s !== null && s !== undefined && !isNaN(s));
  if (validScores.length === 0) return null;
  const sum = validScores.reduce((acc, s) => acc + (s <= 10 ? s * 10 : s), 0);
  const avg = sum / validScores.length;
  return Math.round(avg);
}

/**
 * Normalizes URL strings:
 * - Full URLs starting with http:// or https:// are preserved.
 * - Relative paths starting with / are prefixed with window.location.origin.
 * - Domain strings without protocol (e.g. battery.greenx7.com) are prefixed with https://.
 */
export function normalizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${trimmed}`;
    }
    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    return `${appUrl.replace(/\/+$/, '')}${trimmed}`;
  }
  return `https://${trimmed}`;
}

/** Resolve image path to usable src: env domain + API link, fallback APP origin. */
export function resolveImageUrl(path?: string | null, fallback = ''): string {
  if (!path) return fallback;
  const trimmed = path.trim();
  if (!trimmed) return fallback;

  // Blob / object URLs (e.g. URL.createObjectURL from local file upload) and base64 data URLs
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Already a full absolute or protocol-relative URL (API link)
  if (/^(?:https?:)?\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Backend-relative image path: prepend the configured image domain
  const domain = (process.env.NEXT_PUBLIC_IMAGE_DOMAIN ?? '').trim().replace(/\/+$/, '');
  if (!domain) return trimmed;
  const cleanPath = trimmed.replace(/^\/+/, '');
  return `${domain}/${cleanPath}`;
}

/** Turn a URL slug into a display label: 'blackpole-advisory' -> 'Blackpole Advisory'. */
export function formatSlugLabel(slug?: string | null): string {
  if (!slug) return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
