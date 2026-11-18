'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { COVER_PILLS, PRESENTATION_TOTAL_SLIDES, DIMENSION_CARDS } from '@/constants/presentation';
import { usePresentationNav } from '@/lib/presentation-nav';
import { cn } from '@/lib/utils';

/**
 * Khung thiết kế của bộ slide (Figma frame 1600×900). Nội dung co giãn theo tỉ lệ
 * này cho vừa màn hình — màn 1024–1500px nhìn giống hệt design thay vì chữ tràn,
 * xuống dòng, chồng lên nhau (bug 372, 374). Màn không đúng 16:9 thì slide được nới
 * thêm bề ngang/chiều cao để nền phủ kín màn hình (không còn dải đen hai bên); nội
 * dung giữa vẫn giữ khung 1600 (max-w-1600 mx-auto), nút ở góc bám theo góc màn hình.
 */
const DECK_WIDTH = 1600;
const DECK_HEIGHT = 900;

export interface DeckShellProps {
  children?: ReactNode;
  currentSlide?: number;
  direction?: 'next' | 'prev';
  className?: string;
}

export function DeckShell({
  children,
  currentSlide: propCurrentSlide,
  direction: propDirection,
  className,
}: DeckShellProps) {
  const nav = usePresentationNav(PRESENTATION_TOTAL_SLIDES);
  const currentSlide = propCurrentSlide ?? nav.currentSlide;
  const direction = propDirection ?? nav.direction;

  const content = children;

  const frameRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState({ scale: 1, width: DECK_WIDTH, height: DECK_HEIGHT });
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const scale = Math.min(w / DECK_WIDTH, h / DECK_HEIGHT) || 1;
      setCanvas({
        scale,
        width: Math.max(DECK_WIDTH, w / scale),
        height: Math.max(DECK_HEIGHT, h / scale),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tải trước mọi ảnh của bộ slide ngay khi mở (bug 370): mỗi slide chỉ được dựng
  // khi chuyển tới, nên trước đây ảnh slide cuối mới bắt đầu tải lúc người trình
  // bày bấm sang — chữ hiện trước, ảnh hiện sau.
  useEffect(() => {
    const sources = [
      ...COVER_PILLS.map((p) => p.src),
      ...DIMENSION_CARDS.map((a) => a.src),
      '/images/Northern-Rivers_Wolllunbin.webp',
    ];
    for (const src of sources) {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = src;
    }
  }, []);

  return (
    <div className="hidden h-screen w-full overflow-hidden bg-brand-green-2 p-0 lg:flex">
      <div
        ref={frameRef}
        className={cn(
          'relative h-full w-full select-none overflow-hidden bg-brand-green-2',
          className,
        )}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: canvas.width,
            height: canvas.height,
            transform: `scale(${canvas.scale})`,
          }}
        >
          <div
            key={currentSlide}
            className={cn(
              'h-full w-full transition-all duration-300 ease-out',
              direction === 'next'
                ? 'duration-300 animate-in fade-in slide-in-from-right-10'
                : 'duration-300 animate-in fade-in slide-in-from-left-10',
            )}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
