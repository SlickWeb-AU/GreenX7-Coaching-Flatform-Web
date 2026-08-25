import { z } from 'zod';

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const createUserSchema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(150),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(PASSWORD_RULE, 'Mật khẩu cần chữ hoa, chữ thường, số và ký tự đặc biệt'),
  phone: z
    .string()
    .regex(/^(0|\+84)\d{9,10}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),
  role: z.enum(['ADMIN', 'CUSTOMER']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/** Update không cho đổi email/password — khớp với UpdateUserDto bên BE */
export const updateUserSchema = createUserSchema.omit({ email: true, password: true }).partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: 'ADMIN' | 'CUSTOMER';
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
