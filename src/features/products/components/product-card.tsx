import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import { cn, formatCurrency } from '@/lib/utils';
import type { Product } from '@/types/entities';

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const onSale = product.salePrice !== null && product.salePrice < product.price;
  const outOfStock = product.stock <= 0;

  return (
    <Link href={ROUTES.shop.productDetail(product.slug)} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-8 w-8" aria-hidden />
            </div>
          )}

          {onSale && <Badge className="absolute left-2 top-2" variant="destructive">Giảm giá</Badge>}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Badge variant="secondary">Hết hàng</Badge>
            </div>
          )}
        </div>

        <CardContent className="space-y-2 p-4">
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className={cn('font-semibold text-primary', onSale && 'text-destructive')}>
              {formatCurrency(onSale ? product.salePrice : product.price)}
            </span>
            {onSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
