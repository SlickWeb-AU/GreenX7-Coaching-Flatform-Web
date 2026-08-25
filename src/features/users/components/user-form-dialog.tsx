'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applyFieldErrors, type ApiError } from '@/lib/api-error';
import type { User } from '@/types/entities';

import { useCreateUser, useUpdateUser } from '../hooks/use-users';
import { createUserSchema, updateUserSchema, type CreateUserInput } from '../schemas';

const EMPTY_FORM: CreateUserInput = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'CUSTOMER',
  status: 'ACTIVE',
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = !!user;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const form = useForm<CreateUserInput>({
    // Chế độ sửa không đụng tới email/password nên dùng schema khác
    resolver: zodResolver(isEdit ? (updateUserSchema as never) : createUserSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      user
        ? {
            fullName: user.fullName,
            email: user.email,
            password: '',
            phone: user.phone ?? '',
            role: user.role,
            status: user.status,
          }
        : EMPTY_FORM,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const onSubmit = (values: CreateUserInput) => {
    const handlers = {
      onSuccess: () => onOpenChange(false),
      onError: (error: ApiError) =>
        applyFieldErrors(error, (field, err) => form.setError(field as keyof CreateUserInput, err)),
    };

    if (isEdit && user) {
      const { fullName, phone, role, status } = values;
      updateMutation.mutate({ id: user.id, input: { fullName, phone, role, status } }, handlers);
    } else {
      createMutation.mutate(values, handlers);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Email và mật khẩu không thể thay đổi tại đây.'
              : 'Đây là nơi duy nhất có thể gán quyền quản trị cho tài khoản.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="Họ và tên"
            htmlFor="user-fullName"
            required
            error={form.formState.errors.fullName?.message}
          >
            <Input id="user-fullName" {...form.register('fullName')} />
          </FormField>

          <FormField
            label="Email"
            htmlFor="user-email"
            required={!isEdit}
            error={form.formState.errors.email?.message}
          >
            <Input id="user-email" type="email" disabled={isEdit} {...form.register('email')} />
          </FormField>

          {!isEdit && (
            <FormField
              label="Mật khẩu"
              htmlFor="user-password"
              required
              error={form.formState.errors.password?.message}
              hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
            >
              <Input id="user-password" type="password" {...form.register('password')} />
            </FormField>
          )}

          <FormField
            label="Số điện thoại"
            htmlFor="user-phone"
            error={form.formState.errors.phone?.message}
          >
            <Input id="user-phone" placeholder="0912345678" {...form.register('phone')} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Vai trò" htmlFor="user-role" required>
              <Select
                value={form.watch('role')}
                onValueChange={(value) => form.setValue('role', value as CreateUserInput['role'])}
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Trạng thái" htmlFor="user-status" required>
              <Select
                value={form.watch('status')}
                onValueChange={(value) =>
                  form.setValue('status', value as CreateUserInput['status'])
                }
              >
                <SelectTrigger id="user-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Chưa kích hoạt</SelectItem>
                  <SelectItem value="BANNED">Bị khoá</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button
              type="submit"
              loading={isEdit ? updateMutation.isPending : createMutation.isPending}
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
