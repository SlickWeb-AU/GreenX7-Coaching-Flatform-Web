export { OTP_EXPIRY_SECONDS, RESEND_COOLDOWN_SECONDS } from '@/constants/auth';

export function formatOtpTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [name, domain] = parts as [string, string];
  return `${name.charAt(0)}••••@${domain}`;
}
