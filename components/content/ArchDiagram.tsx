'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Brain, Container, Database, LayoutDashboard, Maximize2, Minus, Plus, Server, Shield, User, X, type LucideIcon } from 'lucide-react';
import { NW, VNW, type ArchGroup, type ArchLayout, type ArchNode } from '@/lib/content/architecture';

export type ArchStrings = {
  title: string; hint: string; auto: string; expand: string; close: string; zoomIn: string; zoomOut: string;
  groups: Record<ArchGroup, string>; roles: Record<ArchGroup, string>;
};

const ICONS: Record<ArchGroup, LucideIcon> = { user: User, frontend: LayoutDashboard, backend: Server, ai: Brain, data: Database, infra: Container, security: Shield };
const NH = 60;

/**
 * Architecture design for a project page: components as cards on a pipeline, links with particles flowing along them (CSS-gated
 * SMIL, so reduced motion and no-JS get still lines), hover, focus or tap a component to light its path and read why it is there.
 * The whole diagram is server-rendered HTML + SVG; this client part only fits it to the column, tracks the active component and
 * opens the expanded view with zoom. Phones get the stacked layout (two cards per row) through CSS alone.
 */
export function ArchDiagram({ layout, t }: { layout: ArchLayout; t: ArchStrings }) {
  const uid = useId();
  const viewRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [fit, setFit] = useState<{ s: number; phone: boolean; scroll: boolean } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 40rem)');
    const measure = () => {
      const phone = mq.matches;
      const w = el.clientWidth, W = phone ? layout.vw : layout.hw;
      // wide pipelines keep readable cards (80% or more) and scroll sideways inside the card instead of shrinking
      const fs = phone ? Math.min(1, w / W) : Math.max(0.8, Math.min(1, w / W));
      setFit({ s: fs, phone, scroll: W * fs > w + 1 });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    mq.addEventListener('change', measure);
    return () => { ro.disconnect(); mq.removeEventListener('change', measure); };
  }, [layout.hw, layout.vw]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (!expanded) {
      // back from the expanded view: return focus to the button that opened it (it exists again only after this render)
      if (wasOpen.current) expandRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setExpanded(false); setZoom(1); } };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [expanded]);

  function close() { setExpanded(false); setZoom(1); }

  const near = new Set<string>();
  const on = new Set<string>();
  const node = active ? layout.nodes.find((n) => n.id === active) : undefined;
  if (node) {
    near.add(node.id);
    for (const e of layout.edges) if (e.from === node.id || e.to === node.id) { on.add(e.id); near.add(e.from); near.add(e.to); }
    for (const l of layout.links) if (l.a === node.band || l.b === node.band) on.add(l.id);
  }
  const s = fit ? (expanded ? Math.max(fit.s, fit.phone ? 1 : 0.9) * zoom : fit.s) : 1;
  const style = { '--hw': layout.hw, '--hh': layout.hh, '--vw': layout.vw, '--vh': layout.vh, '--s': s } as CSSProperties;

  const enter = (id: string) => { if (!pinned) setActive(id); };
  const leave = () => { if (!pinned) setActive(null); };
  const tap = (id: string) => { if (pinned && active === id) { setPinned(false); setActive(null); } else { setPinned(true); setActive(id); } };

  const edgeLayer = (o: 'h' | 'v') => (
    <svg className={`arch__edges arch__edges--${o}`} width={o === 'h' ? layout.hw : layout.vw} height={o === 'h' ? layout.hh : layout.vh} aria-hidden="true">
      {layout.lanes.map((l) => {
        const b = l[o];
        return (
          <g key={l.group} className="arch__lane" data-group={l.group}>
            <rect x={b.x} y={b.y} width={b.w} height={b.ht} rx={14} />
            <text x={b.x + 12} y={b.y + 15}>{t.groups[l.group]}</text>
          </g>
        );
      })}
      {(o === 'h' ? layout.edges.map((e) => ({ id: e.id, d: e.h, label: e.label, at: e.lh })) : layout.links.map((l) => ({ id: l.id, d: l.d, label: undefined, at: undefined }))).map((e, i) => {
        const begin = `${((i * 0.53) % 2.2).toFixed(2)}s`;
        return (
          <g key={e.id} className="arch__edge" data-on={on.has(e.id) ? '' : undefined}>
            <path d={e.d} />
            <circle className="arch__dot" r={3} opacity={0}>
              <set attributeName="opacity" to="0.9" begin={begin} />
              <animateMotion dur={`${2.6 + (i % 4) * 0.35}s`} begin={begin} repeatCount="indefinite" path={e.d} />
            </circle>
            {e.label && e.at && <text className="arch__elabel" x={e.at.x} y={e.at.y - 6} textAnchor="middle">{e.label}</text>}
          </g>
        );
      })}
    </svg>
  );

  const card = (n: ArchNode) => {
    const phone = fit?.phone ?? false;
    const p = phone ? n.v : n.h, w = phone ? VNW : NW, W = phone ? layout.vw : layout.hw, H = phone ? layout.vh : layout.hh;
    const cw = Math.min(280, W - 8);
    const left = Math.max(4, Math.min(W - cw - 4, p.x + w / 2 - cw / 2));
    const below = p.y + NH / 2 < H / 2;
    const pos: CSSProperties = below ? { left, top: p.y + NH + 10, width: cw } : { left, bottom: H - p.y + 10, width: cw };
    return (
      <div className="arch__card" role="tooltip" id={`${uid}-card`} style={pos} data-group={n.group}>
        <p className="arch__card-group">{t.groups[n.group]}</p>
        <p className="arch__card-title">{n.label}</p>
        {n.notes.length > 0 && <ul>{n.notes.map((x) => <li key={x}>{x}</li>)}</ul>}
        <p className="arch__card-role">{t.roles[n.group]}</p>
      </div>
    );
  };

  return (
    <section className="arch" data-expanded={expanded ? '' : undefined} aria-labelledby={`${uid}-t`} role={expanded ? 'dialog' : undefined} aria-modal={expanded || undefined}>
      <div className="arch__head">
        <div>
          <h2 id={`${uid}-t`} className="arch__title">{t.title}</h2>
          <p className="arch__hint">{t.hint}{layout.kind === 'auto' && <> {t.auto}</>}</p>
        </div>
        <div className="arch__tools">
          {expanded && <>
            <button type="button" className="arch__btn" onClick={() => setZoom((z) => Math.max(0.5, +(z / 1.25).toFixed(2)))} aria-label={t.zoomOut} title={t.zoomOut}><Minus size={16} aria-hidden="true" /></button>
            <button type="button" className="arch__btn" onClick={() => setZoom((z) => Math.min(3, +(z * 1.25).toFixed(2)))} aria-label={t.zoomIn} title={t.zoomIn}><Plus size={16} aria-hidden="true" /></button>
          </>}
          {expanded
            ? <button ref={closeRef} type="button" className="arch__btn" onClick={close} aria-label={t.close} title={t.close}><X size={16} aria-hidden="true" /></button>
            : <button ref={expandRef} type="button" className="arch__btn arch__btn--expand" onClick={() => setExpanded(true)}><Maximize2 size={15} aria-hidden="true" /><span>{t.expand}</span></button>}
        </div>
      </div>
      <div className="arch__view" ref={viewRef} data-scroll={fit?.scroll && !expanded ? '' : undefined} onScroll={(e) => { const v = e.currentTarget; v.toggleAttribute('data-end', v.scrollLeft + v.clientWidth >= v.scrollWidth - 4); }} onClick={(e) => { if (e.target === e.currentTarget) { setPinned(false); setActive(null); } }}>
        <div className="arch__fit" style={style} data-js={fit ? '' : undefined}>
          <div className="arch__stage" data-active={active ? '' : undefined}>
            {edgeLayer('h')}
            {edgeLayer('v')}
            {layout.nodes.map((n) => {
              const Icon = ICONS[n.group];
              return (
                <button
                  key={n.id} type="button" className="arch__node" data-group={n.group} data-lane={n.lane ? '' : undefined}
                  data-near={near.has(n.id) ? '' : undefined} data-current={active === n.id ? '' : undefined}
                  aria-describedby={active === n.id ? `${uid}-card` : undefined} aria-pressed={pinned && active === n.id}
                  style={{ '--hx': n.h.x, '--hy': n.h.y, '--vx': n.v.x, '--vy': n.v.y } as CSSProperties}
                  onMouseEnter={() => enter(n.id)} onMouseLeave={leave} onFocus={() => enter(n.id)} onBlur={leave} onClick={() => tap(n.id)}
                >
                  <span className="arch__marks" aria-hidden="true">
                    {n.marks.length
                      // eslint-disable-next-line @next/next/no-img-element -- brand marks served as-is from public/logos
                      ? n.marks.map((m) => <img key={m.src} src={m.src} alt="" width={22} height={22} decoding="async" loading="lazy" data-mono={m.mono ? '' : undefined} />)
                      : <Icon size={18} strokeWidth={2} />}
                  </span>
                  <span className="arch__label">{n.label}</span>
                  <span className="sr-only">{` (${t.groups[n.group]})${n.notes.length ? ': ' + n.notes.join('; ') : ''}`}</span>
                </button>
              );
            })}
            {node && card(node)}
          </div>
        </div>
      </div>
    </section>
  );
}
