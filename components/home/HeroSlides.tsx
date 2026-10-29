'use client';
import { useEffect, useState } from 'react';
import { Img } from '@/components/ui/Img';
import slide2 from '@/assets/images/slider/slider-3.jpg';

/**
 * The second hero background is mounted only once the page is idle (or after 5 s), so the crossfade
 * never competes with the LCP image or inflates Speed Index.
 */
export function HeroSlides() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (n: number) => void };
    let done = false;
    const go = () => { if (done) return; done = true; setReady(true); };
    const t = setTimeout(go, 5000);
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setTimeout(go, 2500), { timeout: 5000 }) : 0;
    return () => { clearTimeout(t); if (id && w.cancelIdleCallback) w.cancelIdleCallback(id); };
  }, []);
  if (!ready) return null;
  return <Img src={slide2} alt="" fill sizes="(max-width: 640px) 640px, 100vw" className="hero-slide hero-slide--alt object-cover" loading="lazy" />;
}
