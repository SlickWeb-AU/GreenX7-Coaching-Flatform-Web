export interface DashboardVsChangeDto {
  change: number;
  changePercent: number;
}

export interface DashboardZoneSummaryDto {
  key: string;
  label: string;
}

export interface DashboardOverviewDto {
  averageBatteryScore: number | null;
  change: number | null;
  clientCount: number | null;
  participantCount: number | null;
  departmentCount: number | null;
  industryCount?: number | null;
}

export interface DashboardWellbeingAreaDto {
  area: string;
  label: string;
  score: number | null;
  change?: number | null;
  vsPrevious?: DashboardVsChangeDto;
  vsFirstCheck?: DashboardVsChangeDto;
}

export interface DashboardZoneDistributionDto {
  key: string;
  label: string;
  min?: number;
  max?: number;
  count: number | null;
  percentage: number | null;
}

export interface DashboardTrendPointDto {
  year: number;
  month: number;
  label: string;
  score: number | null;
}

export interface DashboardQuery {
  month: number;
  year: number;
  industry: string;
}

export interface AdminDashboardDto {
  filters?: {
    year: number;
    month: number;
    industryId: string | null;
  };
  averageBatteryScore?: number | null;
  zone?: DashboardZoneSummaryDto;
  vsPrevious?: DashboardVsChangeDto;
  industryCount?: number;
  clientCount?: number;
  participantCount?: number;
  departmentCount?: number;
  overview?: DashboardOverviewDto | null;
  wellbeingAreas?: DashboardWellbeingAreaDto[];
  zoneDistribution?: DashboardZoneDistributionDto[];
  historicalTrend?: DashboardTrendPointDto[];
}
