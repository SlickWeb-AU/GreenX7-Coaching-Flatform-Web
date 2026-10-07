'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import { COVER_PILLS, PRESENTATION_TOTAL_SLIDES, DIMENSION_CARDS } from '@/constants/presentation';
import { usePresentationNav } from '@/lib/presentation-nav';
import { cn } from '@/lib/utils';

/**
 * Khung thiết kế của bộ slide (Figma frame 1600×900). Slide luôn dựng ở đúng
 * kích thước này rồi co giãn cả khung cho vừa màn hình — màn 1024–1500px nhìn
 * giống hệt design thay vì chữ tràn, xuống dòng, chồng lên nhau (bug 372, 374).
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
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () =>
      setScale(Math.min(el.clientWidth / DECK_WIDTH, el.clientHeight / DECK_HEIGHT) || 1);
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
    <div className="hidden h-screen w-full items-center justify-center overflow-hidden bg-black p-0 lg:flex">
      <div
        ref={frameRef}
        className={cn(
          'relative aspect-[16/9] select-none overflow-hidden bg-brand-green-2 shadow-2xl',
          className,
        )}
        // Khung 16:9 lớn nhất vừa màn hình (theo bề ngang hoặc chiều cao)
        style={{ width: 'min(100vw, calc(100vh * 16 / 9))' }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: DECK_WIDTH, height: DECK_HEIGHT, transform: `scale(${scale})` }}
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
