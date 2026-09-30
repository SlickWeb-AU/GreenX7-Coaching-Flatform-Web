import { z } from 'zod';

export const industryNameSchema = z.string().trim().min(1, 'Please enter an industry name.');

export const industryFormSchema = z.object({
  name: industryNameSchema,
});

export type IndustryFormValues = z.infer<typeof industryFormSchema>;

export const inviteSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter first name.'),
  lastName: z.string().trim().min(1, 'Please enter last name.'),
  email: z.string().trim().email('Please enter a valid email.'),
});

export type InviteValues = z.infer<typeof inviteSchema>;
