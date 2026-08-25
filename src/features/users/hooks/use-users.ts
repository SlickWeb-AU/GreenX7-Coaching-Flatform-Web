'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ApiError } from '@/lib/api-error';
import { queryKeys } from '@/lib/query-client';
import type { UserStatus } from '@/types/auth';

import { usersApi } from '../api/users.api';
import type { CreateUserInput, UpdateUserInput, UserListParams } from '../schemas';

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.list(params),
    placeholderData: (previous) => previous,
  });
}

export function useUserStatistics() {
  return useQuery({
    queryKey: queryKeys.users.statistics,
    queryFn: usersApi.statistics,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Tạo người dùng thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      usersApi.update(id, input),
    onSuccess: async () => {
      await invalidate();
      toast.success('Cập nhật người dùng thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useUpdateUserStatus() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      usersApi.updateStatus(id, status),
    onSuccess: async () => {
      await invalidate();
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: async () => {
      await invalidate();
      toast.success('Xoá người dùng thành công');
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
}
