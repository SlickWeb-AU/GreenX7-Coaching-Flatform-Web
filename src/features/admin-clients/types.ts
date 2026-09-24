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
  status: string;
}

export type ClientsSortField = 'name' | 'industry' | 'batteryScore';

export interface ClientContact {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface ClientDepartment {
  id: string;
  name: string;
  status: string;
  participantCount?: number;
  batteryScore?: number | null;
}

export interface ClientDetail {
  id: string;
  businessName: string;
  industry: IndustryBrief | string;
  companySize: string;
  state: string;
  status: string;
  checkInStartDay: number;
  checkInEndDay: number;
  timezone: string;
  autoSendReport: boolean;
  contacts: ClientContact[];
  departments: ClientDepartment[];
}

export interface CreateClientPayload {
  businessName: string;
  industry?: string;
  companySize?: string;
  state?: string;
  status?: string;
  contacts?: ClientContact[];
  departments?: { name: string; status: string }[];
  checkInStartDay: number;
  checkInEndDay: number;
  timezone: string;
  autoSendReport?: boolean;
}

export type ClientFormValues = CreateClientPayload;
