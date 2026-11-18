import { z } from 'zod';

export const loginEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter a valid work email address.')
    .email('Please enter a valid work email address.'),
});

export type LoginEmailValues = z.infer<typeof loginEmailSchema>;

export const loginOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Please enter the complete 6-digit code.')
    .length(6, 'Please enter the complete 6-digit code.')
    .regex(/^\d{6}$/, 'Code must be exactly 6 digits.'),
});

export type LoginOtpValues = z.infer<typeof loginOtpSchema>;
