import type { ClientDashboardDto, DepartmentDashboardDto, ReportStatus } from './clients';

export interface SendReportResultDto {
  id: string;
  checkInId: string;
  status: ReportStatus;
  sentAt: string | null;
  expiresAt?: string | null;
  recipientCount?: number;
  failureReason?: string | null;
  /** Kết quả của từng người được chọn trong lần gửi này */
  recipients: SentRecipientDto[];
  failedRecipients: string[];
}

export interface SentRecipientDto {
  contactId: string;
  email: string;
  status: ReportStatus;
  /** Mã mới — chỉ trả về một lần; null khi gửi lỗi */
  password: string | null;
}

/** Một dòng trong dialog Resend: contact + trạng thái lần gửi gần nhất cho người đó */
export interface ReportRecipientDto {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: ReportStatus;
  lastSentAt: string | null;
  failureReason: string | null;
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

/** GET /reports/:token — dựng màn nhập mật khẩu, cố ý không có số liệu */
export interface ReportGateDto {
  businessName: string;
  whiteLogoUrl: string | null;
  periodLabel: string;
  requiresPassword: boolean;
}
