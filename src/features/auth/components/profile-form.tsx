'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { applyFieldErrors, type ApiError } from '@/lib/api-error';

import { authApi } from '../api/auth.api';
import { useAuth } from '../auth-provider';
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from '../schemas';

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: { fullName: user?.fullName ?? '', phone: user?.phone ?? '' },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updated) => {
      setUser({ ...user!, fullName: updated.fullName, phone: updated.phone });
      toast.success('Cập nhật hồ sơ thành công');
      router.refresh();
    },
    onError: (error: ApiError) => {
      const applied = applyFieldErrors(error, (field, err) =>
        profileForm.setError(field as keyof UpdateProfileInput, err),
      );
      if (!applied) toast.error(error.message);
    },
  });

  const changePassword = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      passwordForm.reset();
      // BE huỷ toàn bộ phiên sau khi đổi mật khẩu => bắt buộc đăng nhập lại
      toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      void authApi.logout().finally(() => {
        setUser(null);
        router.replace('/login');
        router.refresh();
      });
    },
    onError: (error: ApiError) => {
      const applied = applyFieldErrors(error, (field, err) =>
        passwordForm.setError(field as keyof ChangePasswordInput, err),
      );
      if (!applied) toast.error(error.message);
    },
  });

  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Email không thể thay đổi sau khi đăng ký.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit((values) => updateProfile.mutate(values))}
            className="space-y-4"
            noValidate
          >
            <FormField label="Email" htmlFor="profile-email">
              <Input id="profile-email" value={user.email} disabled />
            </FormField>

            <FormField
              label="Họ và tên"
              htmlFor="profile-fullName"
              required
              error={profileForm.formState.errors.fullName?.message}
            >
              <Input id="profile-fullName" {...profileForm.register('fullName')} />
            </FormField>

            <FormField
              label="Số điện thoại"
              htmlFor="profile-phone"
              error={profileForm.formState.errors.phone?.message}
            >
              <Input id="profile-phone" placeholder="0912345678" {...profileForm.register('phone')} />
            </FormField>

            <Button type="submit" loading={updateProfile.isPending}>
              Lưu thay đổi
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
          <CardDescription>
            Sau khi đổi, tất cả thiết bị đang đăng nhập sẽ bị đăng xuất.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit((values) => changePassword.mutate(values))}
            className="space-y-4"
            noValidate
          >
            <FormField
              label="Mật khẩu hiện tại"
              htmlFor="currentPassword"
              required
              error={passwordForm.formState.errors.currentPassword?.message}
            >
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register('currentPassword')}
              />
            </FormField>

            <FormField
              label="Mật khẩu mới"
              htmlFor="newPassword"
              required
              error={passwordForm.formState.errors.newPassword?.message}
              hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
            >
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('newPassword')}
              />
            </FormField>

            <FormField
              label="Nhập lại mật khẩu mới"
              htmlFor="confirmNewPassword"
              required
              error={passwordForm.formState.errors.confirmPassword?.message}
            >
              <Input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register('confirmPassword')}
              />
            </FormField>

            <Button type="submit" variant="outline" loading={changePassword.isPending}>
              Đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
