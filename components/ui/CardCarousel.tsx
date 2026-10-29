'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as PE } from 'react';
import { Img } from './Img';

export interface CarouselItem { name: string; image: string; role: string; quote: string }
export interface CarouselStrings { prev: string; next: string; goTo: string; pause: string; play: string; label: string; quote: string; translatedNote?: string }

const STEP = 0.6;     // one index = 60 % of a card width
const NEAR = 2.5;     // cards further than this (index units) are hidden
const BASE = 0.16;    // idle drift in index/s: the next card arrives from the right about every 6 s
const MAX_VEL = 7;    // index/s cap for a flick

type State = {
  pos: number; vel: number; target: number | null; active: number;
  hold: boolean; forced: boolean; dragging: boolean; gesture: boolean; hoverable: boolean;
  visible: boolean; on: boolean; reduced: boolean; raf: number; last: number;
};

/**
 * 3D glass card carousel that turns on its own. `pos` is a float index driven by a small physics loop: a slow
 * constant drift by default, momentum after a swipe (touch, mouse drag or trackpad wheel) that decays back to the
 * drift, and a hold (hover, finger down, focus, or the hidden pause toggle) that settles the nearest card to the
 * centre so it can be read. Per-card transforms are written straight to the DOM; React only owns the active index
 * (dots, aria-hidden) and the paused flag. The loop runs only while the carousel is on screen and the tab visible.
 * Without JS the CSS falls back to a horizontal scroll-snap row and every handler stays inert.
 */
export function CardCarousel({ items, t }: { items: CarouselItem[]; t: CarouselStrings }) {
  const N = items.length;
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const st = useRef<State>({ pos: 0, vel: BASE, target: null, active: 0, hold: false, forced: false, dragging: false, gesture: false, hoverable: false, visible: false, on: false, reduced: false, raf: 0, last: 0 });
  const drag = useRef<{ x0: number; p0: number; lx: number; lt: number; v: number; w: number; moved: boolean } | null>(null);
  const wheel = useRef({ lt: 0, v: 0, timer: 0 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const mod = (x: number) => ((x % N) + N) % N;
  const cardWidth = () => (cards.current[0]?.offsetWidth || 300) * STEP;
  const clamp = (v: number) => Math.max(-MAX_VEL, Math.min(MAX_VEL, v));

  const render = () => {
    const p = st.current.pos;
    cards.current.forEach((el, i) => {
      if (!el) return;
      let o = mod(i - p);
      if (o > N / 2) o -= N;
      const a = Math.abs(o), s = el.style;
      if (a > NEAR) { s.visibility = 'hidden'; return; }
      s.visibility = 'visible';
      if (st.current.reduced) { s.transform = 'none'; s.opacity = a < 0.5 ? '1' : '0'; s.zIndex = a < 0.5 ? '2' : '1'; return; }
      s.transform = `translateX(${(o * STEP * 100).toFixed(2)}%) rotateY(${(-o * 22).toFixed(2)}deg) translateZ(${(-a * 120).toFixed(1)}px) scale(${(1 - a * 0.08).toFixed(3)})`;
      s.opacity = (1 - a * 0.28).toFixed(3);
      s.zIndex = String(10 - Math.round(a * 2));
    });
  };

  const syncActive = () => {
    const s = st.current, idx = mod(Math.round(s.pos));
    if (idx !== s.active) { s.active = idx; setActive(idx); }
  };

  const frame = (now: number) => {
    const s = st.current;
    const dt = Math.min(0.25, (now - (s.last || now)) / 1000); // cap only guards against tab-switch gaps; low frame rates stay time-accurate
    s.last = now;
    const held = s.hold || s.forced;
    if (!s.dragging && !s.gesture) {
      if (s.target !== null) {
        s.pos += (s.target - s.pos) * Math.min(1, dt * 8);
        s.vel = 0;
        if (Math.abs(s.target - s.pos) < 0.002) { s.pos = mod(s.target); s.target = null; }
      } else {
        s.vel += ((held ? 0 : BASE) - s.vel) * (1 - Math.exp(-dt * 1.4));
        if (held && Math.abs(s.vel) < 0.25) {
          s.vel = 0;
          const r = Math.round(s.pos);
          s.pos += (r - s.pos) * Math.min(1, dt * 6);
          if (Math.abs(r - s.pos) < 0.001) s.pos = mod(r);
        } else {
          s.pos += s.vel * dt;
        }
      }
    }
    render();
    syncActive();
    const settled = held && s.target === null && !s.dragging && !s.gesture && s.vel === 0 && Math.abs(s.pos - Math.round(s.pos)) < 0.001;
    if (s.visible && !document.hidden && !settled) s.raf = requestAnimationFrame(frame);
    else { s.raf = 0; s.last = 0; delete root.current?.dataset.running; }
  };
  const kick = () => {
    const s = st.current;
    if (!s.on || s.reduced || s.raf) return;
    s.last = 0; s.raf = requestAnimationFrame(frame);
    if (root.current) root.current.dataset.running = '';
  };

  const goTo = (i: number) => {
    const s = st.current;
    if (!s.on) return;
    if (s.reduced) { s.pos = mod(i); render(); syncActive(); return; }
    let d = mod(i - s.pos);
    if (d > N / 2) d -= N;
    s.target = s.pos + d;
    kick();
  };

  const onDown = (e: PE) => {
    const s = st.current, el = root.current;
    if (!s.on || s.reduced || e.button !== 0 || !el) return;
    if ((e.target as Element).closest('button, a')) return;
    try { el.setPointerCapture(e.pointerId); } catch { /* synthetic event */ }
    el.dataset.dragging = '';
    s.target = null; s.dragging = true; s.vel = 0;
    if (e.pointerType === 'touch') s.hold = true;
    drag.current = { x0: e.clientX, p0: s.pos, lx: e.clientX, lt: e.timeStamp, v: 0, w: cardWidth(), moved: false };
  };
  const onMove = (e: PE) => {
    const d = drag.current;
    if (!d) return;
    const dt = e.timeStamp - d.lt;
    if (dt > 0) { d.v = (e.clientX - d.lx) / dt; d.lx = e.clientX; d.lt = e.timeStamp; }
    if (Math.abs(e.clientX - d.x0) > 6) d.moved = true;
    st.current.pos = d.p0 - (e.clientX - d.x0) / d.w;
    render();
  };
  const release = (e: PE, flick: boolean) => {
    const d = drag.current, s = st.current;
    if (!d) return;
    drag.current = null;
    delete root.current?.dataset.dragging;
    s.dragging = false;
    if (e.pointerType === 'touch') s.hold = false;
    if (flick && !d.moved) {
      const card = (document.elementFromPoint(e.clientX, e.clientY)?.closest('.ccard') as HTMLElement | null);
      const i = card ? Number(card.dataset.index) : NaN;
      if (!Number.isNaN(i) && i !== s.active) goTo(i);
    } else if (flick && e.timeStamp - d.lt < 100) {
      s.vel = clamp((-d.v * 1000) / d.w); // px/ms → index/s; dragging left turns forward
    }
    kick();
  };
  const onUp = (e: PE) => release(e, true);
  const onCancel = (e: PE) => release(e, false);

  const onWheel = (e: WheelEvent) => {
    const s = st.current, w = wheel.current;
    if (!s.on || s.reduced || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    const cw = cardWidth(), now = e.timeStamp, dt = now - w.lt;
    s.target = null; s.gesture = true; s.vel = 0;
    s.pos += e.deltaX / cw;
    if (dt > 0 && dt < 120) w.v = (e.deltaX / cw) / (dt / 1000);
    w.lt = now;
    render();
    syncActive();
    clearTimeout(w.timer);
    w.timer = window.setTimeout(() => { s.gesture = false; s.vel = clamp(w.v); w.v = 0; kick(); }, 90);
    kick();
  };

  const setHold = (v: boolean) => { st.current.hold = v; kick(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.round(st.current.pos) + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.round(st.current.pos) - 1); }
  };

  useEffect(() => {
    const s = st.current, el = root.current;
    if (!el || !window.matchMedia('(scripting: enabled)').matches) return;
    s.on = true;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.hoverable = window.matchMedia('(hover: hover)').matches;
    render();
    const io = new IntersectionObserver(([en]) => { s.visible = en.isIntersecting; if (s.visible) kick(); }, { threshold: 0.05 });
    io.observe(el);
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener('visibilitychange', onVis);
    el.addEventListener('wheel', onWheel, { passive: false });
    const w = wheel.current;
    return () => { cancelAnimationFrame(s.raf); s.raf = 0; io.disconnect(); document.removeEventListener('visibilitychange', onVis); el.removeEventListener('wheel', onWheel); clearTimeout(w.timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { st.current.forced = paused; kick(); }, [paused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={root} className="ccar" role="region" aria-roledescription="carousel" aria-label={t.label} tabIndex={0} onKeyDown={onKey}
      onMouseEnter={() => { if (st.current.hoverable) setHold(true); }} onMouseLeave={() => { if (st.current.hoverable) setHold(false); }}
      onFocusCapture={() => setHold(true)} onBlurCapture={(e) => { if (!root.current?.contains(e.relatedTarget as Node | null)) setHold(false); }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel}
    >
      <div className="ccar__stage" aria-live={paused ? 'polite' : 'off'}>
        {items.map((it, i) => (
          <div
            key={it.name} ref={(el) => { cards.current[i] = el; }} className="ccard" role="group" aria-roledescription="slide"
            aria-label={`${i + 1} / ${N}`} aria-hidden={i !== active} data-front={i === active ? '' : undefined} data-index={i}
          >
            <div className="ccard__body">
              <Img src={it.image} alt="" width={288} height={288} sizes="144px" className="ccard__img" loading="lazy" draggable={false} />
              <p className="ccard__name">{it.name}</p>
              <p className="ccard__role">{it.role}</p>
              <blockquote className="ccard__quote">{it.quote}</blockquote>
            </div>
          </div>
        ))}
      </div>
      <div className="ccar__ctrl mt-5 flex flex-wrap items-center justify-center gap-2">
        {items.map((it, i) => (
          <button key={it.name} type="button" className="carousel__dot" aria-current={i === active ? 'true' : undefined} aria-label={t.goTo.replace('{n}', String(i + 1))} onClick={() => goTo(i)} />
        ))}
      </div>
      {/* keyboard/screen-reader pause toggle; visible only while focused, positioned so it never shifts the layout */}
      <button type="button" className="btn btn-outline-dark btn-sm sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-20" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>{paused ? t.play : t.pause}</button>
      {t.translatedNote && <p className="mt-3 text-center text-xs text-ink-300">{t.translatedNote}</p>}
    </div>
  );
}
