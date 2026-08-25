import { ImageOff, PackageCheck, PackageX } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { serverGet } from '@/lib/server-api';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/entities';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await serverGet<Product>(`/products/${slug}`);

  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await serverGet<Product>(`/products/${slug}`);

  // BE trả 404 cho hàng chưa PUBLISHED => khách không thể mò ra sản phẩm nháp bằng slug
  if (!product) notFound();

  const onSale = product.salePrice !== null && product.salePrice < product.price;
  const inStock = product.stock > 0;

  return (
    <div className="container py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={ROUTES.shop.products} className="hover:text-foreground">
          Sản phẩm
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <span>{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-12 w-12" aria-hidden />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            {product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-primary">
              {formatCurrency(onSale ? product.salePrice : product.price)}
            </span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {inStock ? (
              <>
                <PackageCheck className="h-4 w-4 text-success" aria-hidden />
                <span className="text-success">Còn {product.stock} sản phẩm</span>
              </>
            ) : (
              <>
                <PackageX className="h-4 w-4 text-destructive" aria-hidden />
                <span className="text-destructive">Tạm hết hàng</span>
              </>
            )}
          </div>

          {product.description && (
            <div className="space-y-2 border-t pt-6">
              <h2 className="font-medium">Mô tả sản phẩm</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* TODO: nối vào module giỏ hàng khi triển khai Orders */}
          <Button size="lg" className="w-full sm:w-auto" disabled={!inStock}>
            {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
        </div>
      </div>
    </div>
  );
}
