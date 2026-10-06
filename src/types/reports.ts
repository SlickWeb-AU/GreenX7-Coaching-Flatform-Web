import type { ClientDashboardDto, DepartmentDashboardDto, ReportStatus } from './clients';

export interface SendReportResultDto {
  id: string;
  checkInId: string;
  status: ReportStatus;
  sentAt: string | null;
  expiresAt?: string;
  recipientsCount?: number;
}

/** Kỳ có số liệu — đổ vào hai ô chọn Month / Year trên màn báo cáo */
export interface ReportPeriodOptionDto {
  year: number;
  month: number;
  label: string;
}

/**
 * Response của POST /reports/{token}/view (màn 17).
 * `overall` = tab Overall (null với báo cáo gửi riêng một phòng ban);
 * `departments` = một tab cho mỗi phòng ban.
 */
export interface ReportContentDto {
  businessName: string;
  darkLogoUrl: string | null;
  whiteLogoUrl: string | null;
  periodLabel: string;
  periodYear: number;
  periodMonth: number;
  overall: ClientDashboardDto | null;
  departments: DepartmentDashboardDto[];
  availablePeriods: ReportPeriodOptionDto[];
}

export interface ReportPasswordPayload {
  password: string;
}
