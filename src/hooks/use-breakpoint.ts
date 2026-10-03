'use client';

import { useMemo, useSyncExternalStore } from 'react';

/** Mốc điểm gãy khớp Tailwind. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type BreakpointWithXs = 'xs' | BreakpointKey;

/** Thứ tự tăng dần — dùng để so sánh bằng chỉ số thay vì bề rộng thực. */
const ORDER: readonly BreakpointWithXs[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Bề rộng tối thiểu của mỗi mốc; `xs` là 0. */
const MIN_WIDTH: Record<BreakpointWithXs, number> = {
  xs: 0,
  ...BREAKPOINTS,
};

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const lists = Object.values(BREAKPOINTS).map((width) =>
    window.matchMedia(`(min-width: ${width}px)`),
  );
  lists.forEach((mql) => mql.addEventListener('change', callback));

  return () => lists.forEach((mql) => mql.removeEventListener('change', callback));
};

const getSnapshot = (): BreakpointWithXs => {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/** Mốc giả định khi render phía server — chọn `lg` cho giao diện quản trị. */
const getServerSnapshot = (): BreakpointWithXs => 'lg';

/**
 * Mốc điểm gãy hiện tại.
 *
 * MỌI cờ đều suy ra từ `active` — giá trị do `useSyncExternalStore` cung cấp.
 * Không đọc `window.innerWidth` trong lúc render: làm vậy thì lần hydrate đầu
 * dùng bề rộng thật trong khi server dựng theo `lg`, gây lệch DOM.
 */
export function useBreakpoint() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const index = ORDER.indexOf(active);
    const indexOf = (bp: BreakpointKey) => ORDER.indexOf(bp);

    const isAbove = (bp: BreakpointKey) => index >= indexOf(bp);
    const isBelow = (bp: BreakpointKey) => index < indexOf(bp);
    const isBetween = (min: BreakpointKey, max: BreakpointKey) =>
      index >= indexOf(min) && index < indexOf(max);

    return {
      /** 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' */
      active,
      /** Bề rộng tối thiểu của mốc hiện tại — không phải bề rộng thực của cửa sổ. */
      minWidth: MIN_WIDTH[active],

      isXs: active === 'xs',
      isSm: active === 'sm',
      isMd: active === 'md',
      isLg: active === 'lg',
      isXl: active === 'xl',
      is2xl: active === '2xl',

      /** < 768px */
      isMobile: isBelow('md'),
      /** >= 768px và < 1024px */
      isTablet: isBetween('md', 'lg'),
      /** >= 1024px */
      isDesktop: isAbove('lg'),

      isAbove,
      isBelow,
      isBetween,
    };
  }, [active]);
}
