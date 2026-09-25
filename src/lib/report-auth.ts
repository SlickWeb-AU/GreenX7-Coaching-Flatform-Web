import { REPORT_FALLBACK_PASSWORD } from '@/constants/auth';

export function reportSessionKey(clientId: string): string {
  return `greenx7_report_auth_${clientId}`;
}

export function isReportPasswordValid(input: string, expected?: string | null): boolean {
  const secret = expected || REPORT_FALLBACK_PASSWORD;
  return input.trim().toLowerCase() === secret.toLowerCase();
}
