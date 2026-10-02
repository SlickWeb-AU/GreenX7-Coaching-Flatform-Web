import { FIXED_WELLBEING_AREAS } from './dashboard';

export const BATTERY_STEPS = {
  LANDING: 'landing',
  QUESTIONS: 'questions',
  LOADING: 'loading',
  RESULTS: 'results',
} as const;

export type BatteryStep = (typeof BATTERY_STEPS)[keyof typeof BATTERY_STEPS];

export const BATTERY_QUESTION_AREAS = FIXED_WELLBEING_AREAS.map((d) => d.area);

export const BATTERY_RESUME_WINDOW_MS = 60 * 60 * 1000;

export const BATTERY_DRAFT_KEY_PREFIX = 'gx7-bc-draft';
export const BATTERY_MARKER_KEY_PREFIX = 'gx7-bc';
