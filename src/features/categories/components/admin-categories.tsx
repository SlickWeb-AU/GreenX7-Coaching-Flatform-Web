'use client';

import { MoreHorizontal, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Can } from '@/components/shared/can';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { FormField } from '@/components/shared/form-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PERMISSIONS } from '@/config/permissions';
import { applyFieldErrors, type ApiError } from '@/lib/api-error';
import type { Category } from '@/types/entities';

import type { CategoryInput } from '../api/categories.api';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/use-categories';

const EMPTY_FORM: CategoryInput = { name: '', description: '', sortOrder: 0 };

export function AdminCategories() {
  const { data, isLoading } = useCategories(true);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const form = useForm<CategoryInput>({ defaultValues: EMPTY_FORM });

  useEffect(() => {
    if (!formOpen) return;
    form.reset(
      editing
        ? {
            name: editing.name,
            description: editing.description ?? '',
            sortOrder: editing.sortOrder,
          }
        : EMPTY_FORM,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formOpen, editing]);

  const onSubmit = (values: CategoryInput) => {
    const payload: CategoryInput = { ...values, sortOrder: Number(values.sortOrder) || 0 };
    const handlers = {
      onSuccess: () => setFormOpen(false),
      onError: (error: ApiError) =>
        applyFieldErrors(error, (field, err) => form.setError(field as keyof CategoryInput, err)),
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, input: payload }, handlers);
    } else {
      createMutation.mutate(payload, handlers);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex justify-end">
            <Can permission={PERMISSIONS.CATEGORY_MANAGE}>
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus />
                Thêm danh mục
              </Button>
            </Can>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Số sản phẩm</TableHead>
                  <TableHead className="text-right">Thứ tự</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <p className="font-medium">{category.name}</p>
                      {category.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-right">{category.productCount ?? 0}</TableCell>
                    <TableCell className="text-right">{category.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? 'success' : 'secondary'}>
                        {category.isActive ? 'Hiển thị' : 'Ẩn'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Can permission={PERMISSIONS.CATEGORY_MANAGE}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal />
                              <span className="sr-only">Thao tác</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditing(category);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => setDeleting(category)}
                            >
                              <Trash2 />
                              Xoá
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Can>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Tags} title="Chưa có danh mục nào" />
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
            <DialogDescription>Slug được tạo tự động từ tên danh mục.</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              label="Tên danh mục"
              htmlFor="category-name"
              required
              error={form.formState.errors.name?.message}
            >
              <Input
                id="category-name"
                {...form.register('name', { required: 'Vui lòng nhập tên danh mục' })}
              />
            </FormField>

            <FormField label="Mô tả" htmlFor="category-description">
              <Textarea id="category-description" rows={3} {...form.register('description')} />
            </FormField>

            <FormField label="Thứ tự hiển thị" htmlFor="category-sortOrder">
              <Input
                id="category-sortOrder"
                type="number"
                min={0}
                className="no-spinner"
                {...form.register('sortOrder')}
              />
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Huỷ
              </Button>
              <Button
                type="submit"
                loading={editing ? updateMutation.isPending : createMutation.isPending}
              >
                {editing ? 'Lưu thay đổi' : 'Tạo danh mục'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xoá danh mục?"
        description={
          deleting?.productCount
            ? `Danh mục này đang có ${deleting.productCount} sản phẩm — hệ thống sẽ từ chối xoá.`
            : `Danh mục "${deleting?.name}" sẽ bị ẩn khỏi hệ thống.`
        }
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
