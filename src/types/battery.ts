import type { BatteryCheckState } from '@/constants/battery';

export type { BatteryCheckState };

export interface BatteryAreaScore {
  area: string;
  score: number | null;
}

export interface BatteryScores {
  areas: BatteryAreaScore[];
  average: number | null;
  zone: BatteryZone | null;
}

export type BatteryZone = 'Survive' | 'Function' | 'Momentum' | 'Thrive';

export interface BatterySubmitPayload {
  scores: { area: string; score: number }[];
  deviceId?: string;
}

export interface BatterySubmitResult {
  resultToken?: string;
}

export interface BatteryBrandingDto {
  clientName: string;
  departmentName: string;
  darkLogoUrl: string | null;
  whiteLogoUrl: string | null;
}

export interface BatteryAreaPromptDto {
  area: string;
  label: string;
  title: string;
  question: string;
  order: number;
}

export interface BatteryCheckStateDto {
  state: BatteryCheckState;
  branding: BatteryBrandingDto;
  periodYear: number | null;
  periodMonth: number | null;
  closesAt: string | null;
  nextOpensAt: string | null;
  areas: BatteryAreaPromptDto[];
  scoreMin: number;
  scoreMax: number;
}
