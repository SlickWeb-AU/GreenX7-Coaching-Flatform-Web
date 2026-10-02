import { PurposeIcon } from '@/components/icons';
import { AREA_BAR_COLORS, AREA_ICON_MAP } from './dashboard';
import type { OrbitItem } from '@/types';

export const PRESENTATION_TOTAL_SLIDES = 12;

export const QR_COUNTDOWN_SECONDS = 60;

export const PRESENTATION_TITLE_SUFFIX = 'Monthly Coaching Check-in';

export const COVER_PILLS = [
  {
    src: '/images/cover-pill-office.jpg',
    alt: 'Office team meeting',
    img: '-scale-x-100 object-cover object-[51%_20%]',
    pad: 'pt-[52px]',
  },
  {
    src: '/images/cover-pill-remote.jpg',
    alt: 'Remote work',
    img: 'object-cover object-[65%_30%]',
    pad: 'pt-28',
  },
  {
    src: '/images/cover-pill-surfing.jpg',
    alt: 'Lifestyle thriving',
    img: 'object-cover object-[55%_35%]',
    pad: '',
  },
] as const;

export const DIMENSION_CARDS = [
  { label: 'Purpose', src: '/images/GreenX_Areas_Purpose.png' },
  { label: 'Sleep', src: '/images/GreenX_Areas_Sleep.png' },
  { label: 'Physical Health', src: '/images/GreenX_Areas_Physical-Health.png' },
  { label: 'Nutrition', src: '/images/GreenX_Areas_Nutrition.png' },
  { label: 'Mindset', src: '/images/GreenX_Areas_Mindset.png' },
  { label: 'Fun', src: '/images/GreenX_Areas_Fun.png' },
  { label: 'Relationships', src: '/images/GreenX_Areas_Relationships.png' },
  { label: 'Friendships', src: '/images/GreenX_Areas_Friendship.png' },
] as const;

export const DIMENSION_ORBIT_LABELS: Record<string, string> = {
  Physical: 'Physical Health',
};

export const DIMENSION_ORBIT_ORDER = [
  'Purpose',
  'Sleep',
  'Physical',
  'Nutrition',
  'Mindset',
  'Fun',
  'Relationships',
  'Friendships',
] as const;

export const ORBIT_ITEMS: OrbitItem[] = DIMENSION_ORBIT_ORDER.map((area, idx) => ({
  key: area,
  label: DIMENSION_ORBIT_LABELS[area] ?? area,
  angle: idx * 45,
  bg: AREA_BAR_COLORS[area] ?? 'bg-secondary-teal-1',
  icon: AREA_ICON_MAP[area] ?? PurposeIcon,
}));
