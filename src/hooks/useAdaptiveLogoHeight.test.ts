import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import { useAdaptiveLogoHeight } from './useAdaptiveLogoHeight';

describe('useAdaptiveLogoHeight', () => {
  it('returns normal height by default', () => {
    const { result } = renderHook(() =>
      useAdaptiveLogoHeight('https://example.com/logo.png', 'h-12', 'h-18'),
    );

    expect(result.current.heightClass).toBe('h-12');
    expect(result.current.isVertical).toBe(false);
  });

  it('switches to vertical height when naturalWidth < naturalHeight on image load', () => {
    const { result } = renderHook(() =>
      useAdaptiveLogoHeight('https://example.com/logo.png', 'h-12', 'h-18'),
    );

    act(() => {
      result.current.handleImageLoad({
        currentTarget: {
          naturalWidth: 100,
          naturalHeight: 200,
        },
      } as unknown as SyntheticEvent<HTMLImageElement>);
    });

    expect(result.current.heightClass).toBe('h-18');
    expect(result.current.isVertical).toBe(true);
  });

  it('keeps normal height when naturalWidth >= naturalHeight on image load', () => {
    const { result } = renderHook(() =>
      useAdaptiveLogoHeight('https://example.com/logo.png', 'h-12', 'h-18'),
    );

    act(() => {
      result.current.handleImageLoad({
        currentTarget: {
          naturalWidth: 300,
          naturalHeight: 100,
        },
      } as unknown as SyntheticEvent<HTMLImageElement>);
    });

    expect(result.current.heightClass).toBe('h-12');
    expect(result.current.isVertical).toBe(false);
  });

  it('works with custom heights like h-6.5 and h-10', () => {
    const { result } = renderHook(() =>
      useAdaptiveLogoHeight('https://example.com/logo.png', 'h-6.5', 'h-10'),
    );

    expect(result.current.heightClass).toBe('h-6.5');

    act(() => {
      result.current.handleImageLoad({
        currentTarget: {
          naturalWidth: 120,
          naturalHeight: 250,
        },
      } as unknown as SyntheticEvent<HTMLImageElement>);
    });

    expect(result.current.heightClass).toBe('h-10');
    expect(result.current.isVertical).toBe(true);
  });

  it('supports options object syntax', () => {
    const { result } = renderHook(() =>
      useAdaptiveLogoHeight({
        src: 'https://example.com/logo.png',
        normalHeight: 'h-8',
        verticalHeight: 'h-16',
      }),
    );

    expect(result.current.heightClass).toBe('h-8');

    act(() => {
      result.current.handleImageLoad({
        currentTarget: {
          naturalWidth: 50,
          naturalHeight: 100,
        },
      } as unknown as SyntheticEvent<HTMLImageElement>);
    });

    expect(result.current.heightClass).toBe('h-16');
  });
});
