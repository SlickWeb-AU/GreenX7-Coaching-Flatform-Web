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
  clientCount: number;
  participantCount: number;
  departmentCount: number;
  industryCount?: number;
}

export interface DashboardWellbeingAreaDto {
  area: string;
  label: string;
  score: number | null;
  change?: number;
  vsPrevious?: DashboardVsChangeDto;
  vsFirstCheck?: DashboardVsChangeDto;
}

export interface DashboardZoneDistributionDto {
  key: string;
  label: string;
  min?: number;
  max?: number;
  count: number;
  percentage: number;
}

export interface DashboardTrendPointDto {
  year: number;
  month: number;
  label: string;
  score: number | null;
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

export interface IndustryDto {
  id: string;
  name: string;
}
