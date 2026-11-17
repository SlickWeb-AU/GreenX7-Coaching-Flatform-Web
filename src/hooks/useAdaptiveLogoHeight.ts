'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

export interface UseAdaptiveLogoHeightOptions {
  src?: string | null;
  normalHeight?: string;
  verticalHeight?: string;
}

/**
 * Hook tự động tính toán class chiều cao cho logo dựa trên tỉ lệ ảnh:
 * - Khi chiều ngang < chiều dọc (ảnh đứng/dọc): trả về verticalHeight (mặc định: 'h-15').
 * - Bình thường (ảnh ngang hoặc vuông): trả về normalHeight (mặc định: 'h-15').
 */
export function useAdaptiveLogoHeight(
  srcOrOptions?: string | null | UseAdaptiveLogoHeightOptions,
  normalHeightParam: string = 'h-15',
  verticalHeightParam: string = 'h-15',
) {
  const isOptions = typeof srcOrOptions === 'object' && srcOrOptions !== null;
  const src = isOptions ? srcOrOptions.src : srcOrOptions;
  const normalHeight = isOptions ? (srcOrOptions.normalHeight ?? 'h-15') : normalHeightParam;
  const verticalHeight = isOptions ? (srcOrOptions.verticalHeight ?? 'h-15') : verticalHeightParam;

  const [isVertical, setIsVertical] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setIsVertical(naturalWidth < naturalHeight);
    } else {
      setIsVertical(false);
    }
  }, [src]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setIsVertical(naturalWidth < naturalHeight);
    }
  };

  const heightClass = isVertical ? verticalHeight : normalHeight;

  return {
    heightClass,
    isVertical,
    imgRef,
    handleImageLoad,
  };
}
