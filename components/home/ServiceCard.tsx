'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Service card: icon + title. The description sits in reserved space under the title (so it never covers another
 * card) and shows while the card is hovered with a mouse or pen, disappearing the moment the pointer leaves. Tap,
 * Enter or Space pins it open (touch and keyboard path) until the title is activated again, Escape, or a tap outside.
 * The text is always in the DOM, so crawlers and the no-JS page see it (CSS in app/globals.css).
 */
export function ServiceCard({ id, title, icon, delay, children }: { id: string; title: string; icon: ReactNode; delay: number; children: ReactNode }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setPinned(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [pinned]);

  const open = hover || pinned;
  return (
    <Reveal as="li" className="text-center" delay={delay}>
      <div
        ref={root} className="svc" data-state={open ? 'open' : 'closed'}
        onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHover(true); }}
        onPointerLeave={(e) => { if (e.pointerType !== 'touch') setHover(false); }}
        onKeyDown={(e) => { if (e.key === 'Escape') setPinned(false); }}
      >
        <h3 className="svc__title m-0 text-[0.95rem] font-semibold uppercase leading-snug tracking-[0.1em] text-ink-700">
          <button type="button" className="svc__btn" aria-expanded={open} aria-controls={`svc-${id}`} onClick={() => setPinned((p) => !p)}>
            {icon}
            <span className="svc__name mt-4 block">{title}</span>
          </button>
        </h3>
        <div id={`svc-${id}`} className="svc__panel">{children}</div>
      </div>
    </Reveal>
  );
}
