import type {
  CheckinStatus,
  ClientStatus,
  ReportStatus,
  SortOrder,
  WellbeingArea,
} from '@/constants/clients';

export type { CheckinStatus, ClientStatus, ReportStatus, SortOrder, WellbeingArea };
export type { ClientsSortField } from '@/constants/clients';

export interface IndustryBrief {
  id: string;
  name: string;
  slug: string;
}

export interface ClientListItem {
  id: string;
  businessName: string;
  industry: IndustryBrief | string;
  departmentCount: number;
  currentBatteryScore: number | null;
  status: ClientStatus;
}

export interface ClientsQuery {
  page: number;
  search?: string;
  industry?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface ClientContact {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ClientDepartment {
  id: string;
  name: string;
  status: ClientStatus;
  participantCount?: number;
  batteryScore?: number | null;
}

export interface ClientDetail {
  id: string;
  businessName: string;
  industry: IndustryBrief | string;
  companySize: string;
  state: string;
  status: ClientStatus;
  checkInStartDay: number;
  checkInEndDay: number;
  timezone: string;
  autoSendReport: boolean;
  contacts: ClientContact[];
  departments: ClientDepartment[];
}

/** Matches CreateClientDto (POST /clients) */
export interface CreateClientPayload {
  businessName: string;
  industryId: string;
  companySize: string;
  state: string;
  status: ClientStatus;
  contacts: ClientContact[];
  departments?: { name: string; status: ClientStatus }[];
  checkInStartDay?: number;
  checkInEndDay?: number;
  autoSendReport: boolean;
}

/** Matches UpdateClientDto (PATCH /clients/{id}) — no contacts/departments/timezone */
export interface UpdateClientPayload {
  businessName: string;
  industryId: string;
  companySize: string;
  state: string;
  status: ClientStatus;
  checkInStartDay?: number;
  checkInEndDay?: number;
  autoSendReport: boolean;
}

export interface DepartmentListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  year?: number;
  month?: number;
}

export interface CreateDepartmentPayload {
  name: string;
  status: ClientStatus;
}

export interface DeltaDto {
  change: number | null;
  changePercent: number | null;
}

export interface PeriodDto {
  year: number;
  month: number;
  label: string;
}

export interface ZoneDto {
  name: string;
  slug?: string;
  description?: string;
}

export interface TrendPointDto {
  year: number;
  month: number;
  label: string;
  score: number | null;
}

export interface AreaScoreDto {
  area: WellbeingArea;
  label: string;
  score: number | null;
  vsPrevious: DeltaDto;
  vsFirstCheck: DeltaDto;
}

export interface ClientDashboardDto {
  clientId: string;
  businessName: string;
  status: string;
  filters: { year: number; month: number };
  batteryScore: number | null;
  zone: ZoneDto | null;
  vsPrevious: DeltaDto;
  vsFirstCheck: DeltaDto;
  firstCheck: PeriodDto | null;
  participantCount: number;
  wellbeingAreas: AreaScoreDto[];
  historicalTrend: TrendPointDto[];
}

export interface DepartmentListItemDto {
  id: string;
  name: string;
  slug: string;
  status: ClientStatus;
  isCompanyWide: boolean;
  participantCount: number;
  score: number | null;
  vsPreviousChange: number | null;
  vsFirstCheckChange: number | null;
}

export interface CheckInHistoryItemDto {
  checkInId: string;
  periodLabel: string;
  periodYear: number;
  periodMonth: number;
  timeFrame: string;
  participants: number;
  score: number | null;
  checkInStatus: CheckinStatus;
  reportStatus: ReportStatus;
  reportSentAt: string | null;
  reportFailureReason: string | null;
  reportId: string | null;
}

export interface DepartmentDashboardDto extends ClientDashboardDto {
  departmentId: string;
  departmentName: string;
  strengths: AreaScoreDto[];
  focus: AreaScoreDto[];
  isOpen: boolean;
  openUntil: string | null;
  shareUrl: string;
  liveUrl: string;
  presentationUrl: string;
}

export interface DepartmentShareLinksDto {
  batteryCheckUrl: string;
  liveDashboardUrl: string;
  presentationUrl: string;
  qrCode?: string;
}
