'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';

export interface UseAdaptiveLogoHeightOptions {
  src?: string | null;
  normalHeight?: string;
  verticalHeight?: string;
}

/**
 * Hook tự động tính toán class chiều cao cho logo dựa trên tỉ lệ ảnh:
 * - Khi chiều ngang < chiều dọc (ảnh đứng/dọc): trả về verticalHeight (ví dụ: 'h-18' hoặc 'h-10').
 * - Bình thường (ảnh ngang hoặc vuông): trả về normalHeight (ví dụ: 'h-12' hoặc 'h-6.5').
 */
export function useAdaptiveLogoHeight(
  srcOrOptions?: string | null | UseAdaptiveLogoHeightOptions,
  normalHeightParam: string = 'h-12',
  verticalHeightParam: string = 'h-18',
) {
  const isOptions = typeof srcOrOptions === 'object' && srcOrOptions !== null;
  const src = isOptions ? srcOrOptions.src : srcOrOptions;
  const normalHeight = isOptions ? (srcOrOptions.normalHeight ?? 'h-12') : normalHeightParam;
  const verticalHeight = isOptions ? (srcOrOptions.verticalHeight ?? 'h-18') : verticalHeightParam;

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
