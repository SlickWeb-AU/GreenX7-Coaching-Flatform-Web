export interface InsightBadgeItem {
  area: string;
  label: string;
  score: number | null;
}

export interface WellbeingItemData {
  area: string;
  label?: string;
  score: number | null;
  vsPreviousMonth: number | null;
  vsFirstCheck: number | null;
}

export interface BatteryCheckLiveResult {
  branding?: {
    clientName?: string;
    departmentName?: string;
    darkLogoUrl?: string | null;
    whiteLogoUrl?: string | null;
  };
  period?: {
    year: number;
    month: number;
    label: string;
  };
  isLive?: boolean;
  batteryScore?: number;
  zone?: {
    key: string;
    label: string;
  };
  vsPrevious?: {
    change: number;
    changePercent: number;
  };
  vsFirstCheck?: {
    change: number;
    changePercent: number;
  };
  participantCount?: number;
  wellbeingAreas?: {
    area: string;
    label?: string;
    score: number | null;
    vsPrevious?: { change: number; changePercent: number };
    vsFirstCheck?: { change: number; changePercent: number };
  }[];
  areas?: {
    area: string;
    label?: string;
    score: number | null;
  }[];
}
