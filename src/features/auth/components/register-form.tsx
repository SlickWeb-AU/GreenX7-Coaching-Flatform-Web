'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@/components/shared/form-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_REDIRECT_BY_ROLE, ROUTES } from '@/config/routes';
import { applyFieldErrors, type ApiError } from '@/lib/api-error';

import { authApi } from '../api/auth.api';
import { useAuth } from '../auth-provider';
import { registerSchema, type RegisterInput } from '../schemas';

export function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => {
      setUser(user);
      toast.success('Đăng ký thành công!');
      router.replace(DEFAULT_REDIRECT_BY_ROLE[user.role]);
      router.refresh();
    },
    onError: (error: ApiError) => {
      const applied = applyFieldErrors(error, (field, err) =>
        form.setError(field as keyof RegisterInput, err),
      );
      if (!applied) toast.error(error.message);
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Tạo tài khoản</h1>
        <p className="text-sm text-muted-foreground">
          Đăng ký để mua sắm và theo dõi đơn hàng tại GreenX7.
        </p>
      </div>

      <FormField label="Họ và tên" htmlFor="fullName" required error={form.formState.errors.fullName?.message}>
        <Input id="fullName" autoComplete="name" placeholder="Nguyễn Văn A" {...form.register('fullName')} />
      </FormField>

      <FormField label="Email" htmlFor="email" required error={form.formState.errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" placeholder="ban@example.com" {...form.register('email')} />
      </FormField>

      <FormField label="Số điện thoại" htmlFor="phone" error={form.formState.errors.phone?.message}>
        <Input id="phone" autoComplete="tel" placeholder="0912345678" {...form.register('phone')} />
      </FormField>

      <FormField
        label="Mật khẩu"
        htmlFor="password"
        required
        error={form.formState.errors.password?.message}
        hint="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
      >
        <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
      </FormField>

      <FormField
        label="Nhập lại mật khẩu"
        htmlFor="confirmPassword"
        required
        error={form.formState.errors.confirmPassword?.message}
      >
        <Input id="confirmPassword" type="password" autoComplete="new-password" {...form.register('confirmPassword')} />
      </FormField>

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        Đăng ký
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{' '}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
