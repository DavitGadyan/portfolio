'use client';
import { createElement, useCallback, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

/**
 * Scroll reveal. One shared IntersectionObserver sets `data-inview` on the element; all motion lives in CSS
 * (app/globals.css, gated by `(scripting: enabled)` and `(prefers-reduced-motion: no-preference)`), so SSR, no-JS and
 * reduced-motion markup is always the final state. Every reveal replays each time it enters the viewport (David asked
 * for the animations to run again when scrolling back up); `replay` is kept as a no-op prop for compatibility.
 */
let io: IntersectionObserver | null = null;
function observe(el: Element) {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) el.setAttribute('data-inview', '');
        else el.removeAttribute('data-inview'); // every reveal replays on its next entrance, scrolling down or back up
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  io.observe(el);
}

type Tag = 'div' | 'section' | 'article' | 'li' | 'ul' | 'ol' | 'figure' | 'h1' | 'h2' | 'h3';

export function Reveal({ as = 'div', children, delay = 0, group = false, replay = false, stagger = false, className, style, ...rest }: {
  as?: Tag; children: ReactNode; delay?: number; group?: boolean; replay?: boolean; stagger?: boolean;
} & HTMLAttributes<HTMLElement>) {
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { el.setAttribute('data-inview', ''); return; }
    observe(el);
    return () => { io?.unobserve(el); };
  }, []);
  const s: CSSProperties = { ...style, ...(delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : {}) };
  return createElement(as, {
    ref, 'data-reveal': '',
    ...(group ? { 'data-reveal-group': '' } : {}),
    ...(replay ? { 'data-reveal-replay': '' } : {}),
    ...(stagger ? { 'data-stagger': '' } : {}),
    className, style: s, ...rest,
  }, children);
}
