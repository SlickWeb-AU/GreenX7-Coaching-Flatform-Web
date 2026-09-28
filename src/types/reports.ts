import type { AreaScoreDto, PeriodDto, ReportStatus } from './clients';
import type {
  DashboardTrendPointDto,
  DashboardWellbeingAreaDto,
  DashboardZoneDistributionDto,
} from './dashboard';

export interface SendReportResultDto {
  id: string;
  checkInId: string;
  status: ReportStatus;
  sentAt: string | null;
  expiresAt?: string;
  recipientsCount?: number;
}

export interface ReportViewDto {
  token: string;
  clientId: string;
  clientName: string;
  clientLogo?: string | null;
  departmentName?: string | null;
  period: PeriodDto;
  averageBatteryScore: number;
  change?: number | null;
  vsPrevious?: {
    change: number | null;
    changePercent: number | null;
  } | null;
  vsFirstCheck?: {
    change: number | null;
    changePercent: number | null;
  } | null;
  wellbeingAreas: (DashboardWellbeingAreaDto | AreaScoreDto)[];
  zoneDistribution?: DashboardZoneDistributionDto[];
  historicalTrend?: DashboardTrendPointDto[];
  strengths?: AreaScoreDto[];
  focus?: AreaScoreDto[];
  expiredAt?: string;
}

export interface ReportLoginPayload {
  password: string;
}
