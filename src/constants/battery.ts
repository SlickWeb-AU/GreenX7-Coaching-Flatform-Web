import { FIXED_WELLBEING_AREAS } from './dashboard';

export const BATTERY_STEPS = {
  LANDING: 'landing',
  QUESTIONS: 'questions',
  LOADING: 'loading',
  RESULTS: 'results',
} as const;

export type BatteryStep = (typeof BATTERY_STEPS)[keyof typeof BATTERY_STEPS];

export const BATTERY_CHECK_STATES = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ALREADY_SUBMITTED: 'ALREADY_SUBMITTED',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
} as const;

export type BatteryCheckState = (typeof BATTERY_CHECK_STATES)[keyof typeof BATTERY_CHECK_STATES];

export const BATTERY_QUESTION_AREAS = FIXED_WELLBEING_AREAS.map((d) => d.area);

export const BATTERY_RESUME_WINDOW_MS = 60 * 60 * 1000;

export const BATTERY_MARKER_KEY_PREFIX = 'gx7-bc';

export interface BatteryAreaTheme {
  color: string;
  bgColor: string;
  headerBg: string;
  bodyBg: string;
  buttonBg: string;
}

export const BATTERY_AREA_THEMES: Record<string, BatteryAreaTheme> = {
  Physical: {
    color: '#F09E5D',
    bgColor: '#FBE7D7',
    headerBg: 'bg-secondary-orange-1/40',
    bodyBg: 'bg-secondary-orange-2',
    buttonBg: 'bg-secondary-orange-1 hover:bg-secondary-orange-1/90',
  },
  Sleep: {
    color: '#5FC8C9',
    bgColor: '#D7F1F2',
    headerBg: 'bg-secondary-cyan-1/40',
    bodyBg: 'bg-secondary-cyan-2',
    buttonBg: 'bg-secondary-cyan-1 hover:bg-secondary-cyan-1/90',
  },
  Nutrition: {
    color: '#9ACC63',
    bgColor: '#E6F2D8',
    headerBg: 'bg-secondary-green-1/40',
    bodyBg: 'bg-secondary-green-2',
    buttonBg: 'bg-secondary-green-1 hover:bg-secondary-green-1/90',
  },
  Fun: {
    color: '#EBD343',
    bgColor: '#FAF4D0',
    headerBg: 'bg-secondary-yellow-1/40',
    bodyBg: 'bg-secondary-yellow-2',
    buttonBg: 'bg-secondary-yellow-1 hover:bg-secondary-yellow-1/90',
  },
  Mindset: {
    color: '#AC8ED4',
    bgColor: '#EBE4F5',
    headerBg: 'bg-secondary-violet-1/40',
    bodyBg: 'bg-secondary-violet-2',
    buttonBg: 'bg-secondary-violet-1 hover:bg-secondary-violet-1/90',
  },
  Friendships: {
    color: '#EE8F9F',
    bgColor: '#FCDADD',
    headerBg: 'bg-secondary-rose-1/40',
    bodyBg: 'bg-secondary-rose-2',
    buttonBg: 'bg-secondary-rose-1 hover:bg-secondary-rose-1/90',
  },
  Relationships: {
    color: '#F56C77',
    bgColor: '#FBE3E7',
    headerBg: 'bg-secondary-red-1/40',
    bodyBg: 'bg-secondary-red-2',
    buttonBg: 'bg-secondary-red-1 hover:bg-secondary-red-1/90',
  },
  Purpose: {
    color: '#83ADB9',
    bgColor: '#E1EBEE',
    headerBg: 'bg-secondary-teal-1/40',
    bodyBg: 'bg-secondary-teal-2',
    buttonBg: 'bg-secondary-teal-1 hover:bg-secondary-teal-1/90',
  },
};
