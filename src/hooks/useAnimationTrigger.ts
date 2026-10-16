'use client';

import { useEffect, useRef, useState, type DependencyList, type RefObject } from 'react';

export interface UseAnimationTriggerOptions {
  delayMs?: number;
  ref?: RefObject<Element | null>;
  threshold?: number;
  once?: boolean;
}

/**
 * Triggers animation smoothly by briefly delaying `active=true` by `delayMs` (default: 50ms)
 * on mount or whenever any dependency changes.
 *
 * If `options.ref` is provided, triggering is deferred until the element scrolls into viewport
 * via IntersectionObserver.
 *
 * If `controlledActive` is provided (boolean), it overrides the internal state.
 */
export function useAnimationTrigger(
  deps: DependencyList = [],
  controlledActive?: boolean,
  optionsOrDelayMs: number | UseAnimationTriggerOptions = 50,
): boolean {
  const [internalActive, setInternalActive] = useState(false);
  const delayMs =
    typeof optionsOrDelayMs === 'number' ? optionsOrDelayMs : (optionsOrDelayMs.delayMs ?? 50);
  const observerRef = typeof optionsOrDelayMs === 'object' ? optionsOrDelayMs.ref : undefined;
  const threshold =
    typeof optionsOrDelayMs === 'object' ? (optionsOrDelayMs.threshold ?? 0.15) : 0.15;
  const once = typeof optionsOrDelayMs === 'object' ? (optionsOrDelayMs.once ?? true) : true;

  // Track dependency changes safely without dynamic useEffect deps array size
  const [triggerCount, setTriggerCount] = useState(0);
  const prevDepsRef = useRef<DependencyList | null>(null);

  if (prevDepsRef.current === null) {
    prevDepsRef.current = deps;
  } else {
    const prev = prevDepsRef.current;
    const hasChanged =
      prev.length !== deps.length || deps.some((val, idx) => !Object.is(val, prev[idx]));

    if (hasChanged) {
      prevDepsRef.current = deps;
      setTriggerCount((c) => c + 1);
    }
  }

  useEffect(() => {
    setInternalActive(false);

    // If an element ref is supplied, wait until it intersects the viewport
    if (observerRef) {
      if (!observerRef.current || typeof IntersectionObserver === 'undefined') {
        const timer = setTimeout(() => setInternalActive(true), delayMs);
        return () => clearTimeout(timer);
      }

      let timer: ReturnType<typeof setTimeout> | null = null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            timer = setTimeout(() => {
              setInternalActive(true);
            }, delayMs);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            if (timer) clearTimeout(timer);
            setInternalActive(false);
          }
        },
        { threshold },
      );

      observer.observe(observerRef.current);
      return () => {
        if (timer) clearTimeout(timer);
        observer.disconnect();
      };
    }

    const timer = setTimeout(() => {
      setInternalActive(true);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [triggerCount, delayMs, observerRef, threshold, once]);

  return controlledActive ?? internalActive;
}

/**
 * Convenience hook that returns a [ref, active] pair to trigger animations
 * when the container element is scrolled into view.
 */
export function useInViewTrigger<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  deps: DependencyList = [],
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const active = useAnimationTrigger(deps, undefined, { ref, threshold });
  return [ref, active];
}

export default useAnimationTrigger;
