import { z } from 'zod';

export const batteryEmailSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
});

export type BatteryEmailValues = z.infer<typeof batteryEmailSchema>;
