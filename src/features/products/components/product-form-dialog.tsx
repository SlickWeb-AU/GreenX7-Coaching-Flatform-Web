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
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { applyFieldErrors, type ApiError } from '@/lib/api-error';
import type { Product } from '@/types/entities';

import { useCreateProduct, useUpdateProduct } from '../hooks/use-products';
import { productSchema, type ProductInput } from '../schemas';

const NO_CATEGORY = 'none';

const EMPTY_FORM: ProductInput = {
  name: '',
  description: '',
  price: 0,
  salePrice: null,
  stock: 0,
  sku: '',
  status: 'DRAFT',
  categoryId: '',
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Có product => chế độ sửa, không có => chế độ tạo mới */
  product?: Product | null;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEdit = !!product;
  const { data: categories } = useCategories(true);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY_FORM,
  });

  // Nạp dữ liệu khi mở dialog; reset sạch khi chuyển sang chế độ tạo mới
  useEffect(() => {
    if (!open) return;

    form.reset(
      product
        ? {
            name: product.name,
            description: product.description ?? '',
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
            sku: product.sku ?? '',
            status: product.status,
            categoryId: product.category?.id ?? '',
          }
        : EMPTY_FORM,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const onSubmit = (values: ProductInput) => {
    const handlers = {
      onSuccess: () => onOpenChange(false),
      onError: (error: ApiError) =>
        applyFieldErrors(error, (field, err) => form.setError(field as keyof ProductInput, err)),
    };

    if (isEdit && product) {
      updateMutation.mutate({ id: product.id, input: values }, handlers);
    } else {
      createMutation.mutate(values, handlers);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin sản phẩm. Đổi trạng thái sang "Đang bán" để hiển thị với khách hàng.'
              : 'Sản phẩm mới được tạo ở trạng thái nháp, khách hàng chưa nhìn thấy.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="Tên sản phẩm"
            htmlFor="product-name"
            required
            error={form.formState.errors.name?.message}
          >
            <Input id="product-name" {...form.register('name')} />
          </FormField>

          <FormField
            label="Mô tả"
            htmlFor="product-description"
            error={form.formState.errors.description?.message}
          >
            <Textarea id="product-description" rows={3} {...form.register('description')} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Giá gốc (VND)"
              htmlFor="product-price"
              required
              error={form.formState.errors.price?.message}
            >
              <Input
                id="product-price"
                type="number"
                min={0}
                className="no-spinner"
                {...form.register('price')}
              />
            </FormField>

            <FormField
              label="Giá khuyến mãi"
              htmlFor="product-salePrice"
              error={form.formState.errors.salePrice?.message}
            >
              <Input
                id="product-salePrice"
                type="number"
                min={0}
                className="no-spinner"
                {...form.register('salePrice', {
                  setValueAs: (value) => (value === '' ? null : Number(value)),
                })}
              />
            </FormField>

            <FormField
              label="Tồn kho"
              htmlFor="product-stock"
              required
              error={form.formState.errors.stock?.message}
            >
              <Input
                id="product-stock"
                type="number"
                min={0}
                className="no-spinner"
                {...form.register('stock')}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="SKU" htmlFor="product-sku" error={form.formState.errors.sku?.message}>
              <Input id="product-sku" placeholder="GX7-RAU-001" {...form.register('sku')} />
            </FormField>

            <FormField label="Danh mục" htmlFor="product-category">
              <Select
                value={form.watch('categoryId') || NO_CATEGORY}
                onValueChange={(value) =>
                  form.setValue('categoryId', value === NO_CATEGORY ? '' : value)
                }
              >
                <SelectTrigger id="product-category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>Không có</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Trạng thái" htmlFor="product-status" required>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as ProductInput['status'])}
              >
                <SelectTrigger id="product-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                  <SelectItem value="PUBLISHED">Đang bán</SelectItem>
                  <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
