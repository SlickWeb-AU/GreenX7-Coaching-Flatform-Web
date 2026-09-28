import { z } from 'zod';

export const industryNameSchema = z.string().trim().min(1, 'Please enter an industry name.');

export const inviteSchema = z.object({
  name: z.string().trim().min(1, 'Please enter name and a valid email.'),
  email: z.string().trim().email('Please enter name and a valid email.'),
});

export type InviteValues = z.infer<typeof inviteSchema>;
