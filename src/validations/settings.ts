import { z } from 'zod';

export const INDUSTRY_NAME_MAX_LENGTH = 120;

export const industryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Industry name must be at least 2 characters.')
    .max(
      INDUSTRY_NAME_MAX_LENGTH,
      `Industry name must be at most ${INDUSTRY_NAME_MAX_LENGTH} characters.`,
    ),
});

export type IndustryFormValues = z.infer<typeof industryFormSchema>;

export const inviteSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter first name.'),
  lastName: z.string().trim().min(1, 'Please enter last name.'),
  email: z.string().trim().email('Please enter a valid email.'),
});

export type InviteValues = z.infer<typeof inviteSchema>;
