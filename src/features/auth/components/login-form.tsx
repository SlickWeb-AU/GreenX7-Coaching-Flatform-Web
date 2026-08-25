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
import { loginSchema, type LoginInput } from '../schemas';

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setUser(user);
      toast.success(`Xin chào ${user.fullName}!`);

      // Ưu tiên nơi user định đến trước khi bị chặn, nếu không thì về trang mặc định của role
      const destination = next ?? DEFAULT_REDIRECT_BY_ROLE[user.role];
      router.replace(destination);
      // Bắt server component render lại để layout nhận đúng user mới
      router.refresh();
    },
    onError: (error: ApiError) => {
      // Lỗi theo field (nếu có) đổ thẳng vào form, lỗi chung thì hiện toast
      const applied = applyFieldErrors(error, (field, err) =>
        form.setError(field as keyof LoginInput, err),
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
        <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin tài khoản để tiếp tục sử dụng GreenX7.
        </p>
      </div>

      <FormField
        label="Email"
        htmlFor="email"
        required
        error={form.formState.errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="ban@example.com"
          aria-invalid={!!form.formState.errors.email}
          {...form.register('email')}
        />
      </FormField>

      <FormField
        label="Mật khẩu"
        htmlFor="password"
        required
        error={form.formState.errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!form.formState.errors.password}
          {...form.register('password')}
        />
      </FormField>

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        Đăng nhập
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{' '}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </p>

      <div className="rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">Tài khoản dùng thử</p>
        <p>Admin: admin@greenx7.com / Admin@123</p>
        <p>Khách hàng: customer@greenx7.com / Customer@123</p>
      </div>
    </form>
  );
}
