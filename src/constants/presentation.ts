import { PurposeIcon } from '@/components/icons';
import { AREA_BAR_COLORS, AREA_ICON_MAP } from './dashboard';
import type { OrbitItem } from '@/types';

export const PRESENTATION_TOTAL_SLIDES = 12;

export const QR_COUNTDOWN_SECONDS = 60;

export const PRESENTATION_TITLE_SUFFIX = 'Monthly Coaching Check-in';

export const COVER_PILLS = [
  {
    src: '/images/cover-pill-office.webp',
    alt: 'Office team meeting',
    img: '-scale-x-100 object-cover object-[51%_20%]',
    pad: 'pt-[52px]',
  },
  {
    src: '/images/cover-pill-remote.webp',
    alt: 'Remote work',
    img: 'object-cover object-[65%_30%]',
    pad: 'pt-28',
  },
  {
    src: '/images/cover-pill-surfing.webp',
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

/**
 * Nội dung theo zone trên slide 4 "Take a moment" — CÙNG câu chữ và ngưỡng với
 * SCORE_ZONES bên BE (màn kết quả của nhân viên). Trước đây slide viết cứng câu
 * của Momentum nên điểm 59 vẫn hiện "momentum zone" (bug 371).
 */
export const SCORE_ZONE_COPY = {
  SURVIVE: {
    min: 0,
    max: 49,
    intro: 'Time for a recharge 👊',
    zone: 'surviving zone',
    color: '#F56C77',
    description:
      "You're low on charge but checking in is the first win. Pause, breathe, and begin your recharge. This is your comeback.",
  },
  FUNCTION: {
    min: 50,
    max: 69,
    intro: 'Good effort 👍',
    zone: 'functioning zone',
    color: '#F09E5D',
    description:
      "You're holding steady, but there's a gap between functioning and flourishing. This is your chance to reconnect, reset and recharge.",
  },
  MOMENTUM: {
    min: 70,
    max: 79,
    intro: 'Well done 👏',
    zone: 'momentum zone',
    color: '#EBD343',
    description:
      "Momentum's building. You're finding your rhythm. Stay with it, keep showing up, and you'll be thriving before you know it.",
  },
  THRIVE: {
    min: 80,
    max: 100,
    intro: 'Ride that rainbow 🦄',
    zone: 'thriving zone',
    color: '#9ACC63',
    description:
      "This is your peak state. You have clarity, energy, and purpose. Now let's make it sustainable.",
  },
} as const;

export type ScoreZoneKey = keyof typeof SCORE_ZONE_COPY;

/** Zone theo điểm 0–100 (hai đầu đều tính), giống zoneForScore bên BE */
export function zoneKeyForScore(score: number): ScoreZoneKey {
  const key = (Object.keys(SCORE_ZONE_COPY) as ScoreZoneKey[]).find(
    (k) => score >= SCORE_ZONE_COPY[k].min && score <= SCORE_ZONE_COPY[k].max,
  );
  return key ?? 'SURVIVE';
}
