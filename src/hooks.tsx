import React, { useEffect, RefObject, useLayoutEffect, useCallback } from 'react';

export const useOnEscape = (
  handler: (event: KeyboardEvent) => void,
  active = true
): void => {
  const memoizedHandler = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') handler(event);
  }, [handler]);

  useEffect(() => {
    if (!active) return;
    
    document.addEventListener('keyup', memoizedHandler);
    return () => document.removeEventListener('keyup', memoizedHandler);
  }, [memoizedHandler, active]);
};

export const useRepositionOnResize = (handler: () => void, active = true) => {
  const memoizedHandler = useCallback(() => {
    handler();
  }, [handler]);
  
  useEffect(() => {
    if (!active) return;
    
    window.addEventListener('resize', memoizedHandler);
    return () => window.removeEventListener('resize', memoizedHandler);
  }, [memoizedHandler, active]);
};

interface UseOnClickOutsideOptions {
  refs: RefObject<HTMLElement>[];
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

export function useOnClickOutside({
  refs,
  handler,
  enabled = true
}: UseOnClickOutsideOptions) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      let contains = false;
      refs.forEach(ref => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          contains = true;
        }
      });
      if (!contains) {
        handler(event);
      }
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      if (!enabled) return;
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler, refs, enabled]);
}

// Make sure that user is not able TAB out of the Modal content on Open
export const useTabbing = (
  contentRef: RefObject<HTMLElement>,
  active = true
) => {
  useEffect(() => {
    if (!active) return;
    const listener = (event: KeyboardEvent) => {
      // check if key is an Tab
      if (event.keyCode === 9) {
        const els = contentRef?.current?.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        );

        const focusableEls = Array.prototype.slice.call(els);
        if (focusableEls.length === 1) {
          event.preventDefault();
          return;
        }

        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        if (event.shiftKey && document.activeElement === firstFocusableEl) {
          event.preventDefault();
          lastFocusableEl.focus();
        } else if (document.activeElement === lastFocusableEl) {
          event.preventDefault();
          firstFocusableEl.focus();
        }
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      if (!active) return;
      document.removeEventListener('keydown', listener);
    };
  }, [contentRef, active]);
};

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
