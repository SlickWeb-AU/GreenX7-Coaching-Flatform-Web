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

export interface BatteryAreaResultDto {
  area: string;
  title?: string;
  answer?: number;
  score: number;
}

export interface BatteryRechargeTipDto {
  id: string;
  area: string;
  areaLabel?: string;
  title: string;
  body?: string;
  tags?: string[];
}

export interface BatterySubmitResult {
  batteryScore: number;
  zoneKey: string;
  zoneLabel: string;
  introMessage: string;
  zoneHeadline: string;
  zoneDescription: string;
  areaScores: BatteryAreaResultDto[];
  strongestAreas: BatteryAreaResultDto[];
  rechargeTips: BatteryRechargeTipDto[];
  resultToken: string;
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
  timezone?: string | null;
  areas: BatteryAreaPromptDto[];
  scoreMin: number;
  scoreMax: number;
}
