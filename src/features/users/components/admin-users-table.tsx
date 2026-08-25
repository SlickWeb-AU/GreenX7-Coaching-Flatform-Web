'use client';

import { Ban, CircleCheck, MoreHorizontal, Pencil, Plus, Trash2, UsersRound } from 'lucide-react';
import { useState } from 'react';

import { Can } from '@/components/shared/can';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchInput } from '@/components/shared/search-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PERMISSIONS } from '@/config/permissions';
import { useAuth } from '@/features/auth/auth-provider';
import { formatDateTime, getInitials } from '@/lib/utils';
import type { UserRole, UserStatus } from '@/types/auth';
import type { User } from '@/types/entities';

import { useDeleteUser, useUpdateUserStatus, useUsers } from '../hooks/use-users';
import type { UserListParams } from '../schemas';
import { UserFormDialog } from './user-form-dialog';

const ALL = 'all';

const STATUS_META: Record<UserStatus, { label: string; variant: 'success' | 'secondary' | 'destructive' }> = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  INACTIVE: { label: 'Chưa kích hoạt', variant: 'secondary' },
  BANNED: { label: 'Bị khoá', variant: 'destructive' },
};

export function AdminUsersTable() {
  const { user: currentUser } = useAuth();
  const [params, setParams] = useState<UserListParams>({ page: 1, pageSize: 10 });
  const [editing, setEditing] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);

  const { data, isLoading } = useUsers(params);
  const deleteMutation = useDeleteUser();
  const statusMutation = useUpdateUserStatus();

  const updateFilter = (partial: Partial<UserListParams>) =>
    setParams((prev) => ({ ...prev, ...partial, page: 1 }));

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={params.search ?? ''}
              onChange={(search) => updateFilter({ search })}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="sm:max-w-xs"
            />

            <Select
              value={params.role ?? ALL}
              onValueChange={(value) =>
                updateFilter({ role: value === ALL ? undefined : (value as UserRole) })
              }
            >
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả vai trò</SelectItem>
                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.status ?? ALL}
              onValueChange={(value) =>
                updateFilter({ status: value === ALL ? undefined : (value as UserStatus) })
              }
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Chưa kích hoạt</SelectItem>
                <SelectItem value="BANNED">Bị khoá</SelectItem>
              </SelectContent>
            </Select>

            <Can permission={PERMISSIONS.USER_CREATE}>
              <Button
                className="sm:ml-auto"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus />
                Thêm người dùng
              </Button>
            </Can>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : data?.items.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Đăng nhập gần nhất</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((user) => {
                    const isSelf = user.id === currentUser?.id;

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.fullName} />}
                              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.fullName}
                                {isSelf && (
                                  <span className="ml-2 text-xs text-muted-foreground">(bạn)</span>
                                )}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.phone ?? '—'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>
                            {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_META[user.status].variant}>
                            {STATUS_META[user.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDateTime(user.lastLoginAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal />
                                <span className="sr-only">Thao tác</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Can permission={PERMISSIONS.USER_UPDATE}>
                                <DropdownMenuItem
                                  onSelect={() => {
                                    setEditing(user);
                                    setFormOpen(true);
                                  }}
                                >
                                  <Pencil />
                                  Sửa
                                </DropdownMenuItem>

                                {/* Không cho tự khoá chính mình — BE cũng chặn, đây chỉ là chặn sớm cho đỡ khó chịu */}
                                {!isSelf &&
                                  (user.status === 'ACTIVE' ? (
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        statusMutation.mutate({ id: user.id, status: 'BANNED' })
                                      }
                                    >
                                      <Ban />
                                      Khoá tài khoản
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        statusMutation.mutate({ id: user.id, status: 'ACTIVE' })
                                      }
                                    >
                                      <CircleCheck />
                                      Mở khoá
                                    </DropdownMenuItem>
                                  ))}
                              </Can>

                              <Can permission={PERMISSIONS.USER_DELETE}>
                                {!isSelf && (
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={() => setDeleting(user)}
                                  >
                                    <Trash2 />
                                    Xoá
                                  </DropdownMenuItem>
                                )}
                              </Can>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Pagination
                meta={data.meta}
                onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              />
            </>
          ) : (
            <EmptyState
              icon={UsersRound}
              title="Không tìm thấy người dùng"
              description="Thử đổi từ khoá hoặc bỏ bớt bộ lọc."
            />
          )}
        </CardContent>
      </Card>

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xoá người dùng?"
        description={`Tài khoản "${deleting?.fullName}" sẽ bị vô hiệu hoá và đăng xuất khỏi mọi thiết bị.`}
        confirmLabel="Xoá"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleting) return;
          deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
        }}
      />
    </>
  );
}
