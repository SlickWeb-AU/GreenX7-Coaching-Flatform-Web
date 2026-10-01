import { useState, useEffect, useCallback } from 'react';

import { PRESENTATION_TOTAL_SLIDES } from '@/constants/presentation';

// Hash-based slide index keeps fullscreen presentation state out of Next.js routing
// so deck navigation never triggers a server round-trip.
export function usePresentationNav(totalSlides: number = PRESENTATION_TOTAL_SLIDES) {
  const getSlideFromHash = useCallback((): number => {
    if (typeof window === 'undefined') return 1;
    const parsed = Number(window.location.hash.replace('#slide=', '')) || 1;
    return Math.min(Math.max(1, parsed), totalSlides);
  }, [totalSlides]);

  const [currentSlide, setCurrentSlide] = useState<number>(getSlideFromHash);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      const target = Math.min(Math.max(1, index), totalSlides);
      if (target === currentSlide) return;
      setDirection(target > currentSlide ? 'next' : 'prev');
      setCurrentSlide(target);
      if (typeof window !== 'undefined') {
        window.location.hash = `#slide=${target}`;
      }
    },
    [currentSlide, totalSlides],
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentSlide(getSlideFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [getSlideFromHash]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'Space', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        nextSlide();
      } else if (['ArrowLeft', 'PageUp'].includes(e.code)) {
        e.preventDefault();
        prevSlide();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  return {
    currentSlide,
    totalSlides,
    direction,
    goToSlide,
    nextSlide,
    prevSlide,
    isFullscreen,
    toggleFullscreen,
  };
}
