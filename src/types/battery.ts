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
