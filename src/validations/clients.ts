import { z } from 'zod';

import { CLIENT_CHECK_IN_DAY_MAX, CLIENT_STATUSES } from '@/constants/clients';

export const clientContactSchema = z.object({
  firstName: z.string().trim().min(1, 'Please fill in the contact first name.'),
  lastName: z.string().trim().min(1, 'Please fill in the contact last name.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please fill in the contact email.')
    .email('Please enter a valid email address.'),
  role: z.string().trim().min(1, 'Please fill in the contact role.'),
});

export const clientDepartmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Please enter a department name.'),
  status: z
    .enum([CLIENT_STATUSES.ACTIVE, CLIENT_STATUSES.INACTIVE])
    .default(CLIENT_STATUSES.ACTIVE),
});

export const clientFormSchema = z
  .object({
    businessName: z.string().trim().min(2, 'Business name must be at least 2 characters.'),
    industryId: z.string().trim().min(1, 'Please select an industry.'),
    companySize: z.string().trim().min(1, 'Please select a company size.'),
    state: z.string().trim().min(1, 'Please select a state.'),
    status: z
      .enum([CLIENT_STATUSES.ACTIVE, CLIENT_STATUSES.INACTIVE])
      .default(CLIENT_STATUSES.ACTIVE),
    contacts: z.array(clientContactSchema).min(1, 'Please add at least one contact.').default([]),
    departments: z.array(clientDepartmentSchema).default([]),
    checkInStartDay: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(1).max(CLIENT_CHECK_IN_DAY_MAX).optional(),
    ),
    checkInEndDay: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z.number().min(1).max(CLIENT_CHECK_IN_DAY_MAX).optional(),
    ),
    timezone: z.string().default('Australia/Sydney'),
    autoSendReport: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.checkInStartDay !== undefined && data.checkInEndDay !== undefined) {
        return data.checkInStartDay <= data.checkInEndDay;
      }
      return true;
    },
    {
      message: 'Start day must be on or before end day.',
      path: ['checkInStartDay'],
    },
  );

export type ClientFormValues = z.infer<typeof clientFormSchema>;
