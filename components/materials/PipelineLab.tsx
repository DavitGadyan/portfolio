'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PipeKind } from '@/data/mindmaps/pipelines';

/** A pipeline already resolved to one locale (the server page does that, so no Localized objects reach the client). */
export interface PipeView {
  id: string; tab: string; title: string; intro: string;
  nodes: { id: string; kind: PipeKind; col: number; row: number; label: string; value?: string; note: string }[];
  edges: { from: string; to: string; label?: string }[];
  steps: { title: string; text: string; nodes: string[]; calc: string[] }[];
}
export interface PipeStrings { heading: string; hint: string; step: string; prev: string; next: string; calc: string; all: string; kinds: Record<PipeKind, string> }

/* geometry in CSS px at scale 1: card size, column and row pitch, padding (top/bottom leave room for return loops) */
export const NW = 152, NH = 64, CP = 180, RP = 100, PAD = 22, VPAD = 44;
type Pt = { x: number; y: number };
type Box = Pt & { id: string };

/** Does an axis-aligned segment cross a card (2 px inside its border)? */
const crosses = (a: Pt, b: Pt, r: Pt) => {
  const x1 = Math.min(a.x, b.x), x2 = Math.max(a.x, b.x), y1 = Math.min(a.y, b.y), y2 = Math.max(a.y, b.y);
  return x2 > r.x + 2 && x1 < r.x + NW - 2 && y2 > r.y + 2 && y1 < r.y + NH - 2;
};

/**
 * Edge path + label position. Forward: S-curve; same column: straight; backwards (an update feeding a model again): an
 * orthogonal loop under all cards, or over all of them when that way is clear.
 */
export function route(a: Box, b: Box, all: Box[], floor: number, ceil: number): { d: string; at: Pt } {
  if (a.x === b.x) {
    const down = b.y > a.y, x = a.x + NW / 2, y1 = down ? a.y + NH : a.y, y2 = down ? b.y : b.y + NH;
    return { d: `M${x} ${y1} L${x} ${y2}`, at: { x: x + 6, y: (y1 + y2) / 2 } };
  }
  if (b.x > a.x) {
    const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2, dx = (x2 - x1) / 2;
    return { d: `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`, at: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } };
  }
  const x1 = a.x + NW / 2, x2 = b.x + NW / 2;
  const under: Pt[] = [{ x: x1, y: a.y + NH }, { x: x1, y: floor }, { x: x2, y: floor }, { x: x2, y: b.y + NH }];
  const over: Pt[] = [{ x: x1, y: a.y }, { x: x1, y: ceil }, { x: x2, y: ceil }, { x: x2, y: b.y }];
  const clear = (pts: Pt[]) => all.every((r) => r.id === a.id || r.id === b.id || pts.every((q, i) => i === 0 || !crosses(pts[i - 1], q, r)));
  const pts = clear(under) || !clear(over) ? under : over;
  return { d: 'M' + pts.map((q) => `${q.x} ${q.y}`).join(' L'), at: { x: (x1 + x2) / 2, y: pts[1].y + (pts === under ? -2 : 14) } };
}

/** Card positions, canvas size and every edge path of one pipeline. */
export function pipeLayout(nodes: { id: string; col: number; row: number }[], edges: { from: string; to: string }[]) {
  const boxes: Box[] = nodes.map((n) => ({ id: n.id, x: PAD + n.col * CP, y: VPAD + n.row * RP }));
  const pos = new Map(boxes.map((b) => [b.id, b]));
  const cols = Math.max(...nodes.map((n) => n.col)), rows = Math.max(...nodes.map((n) => n.row));
  const W = PAD * 2 + cols * CP + NW, H = VPAD * 2 + rows * RP + NH;
  const floor = H - VPAD + 22, ceil = VPAD - 22;
  return { pos, W, H, paths: edges.map((e) => route(pos.get(e.from)!, pos.get(e.to)!, boxes, floor, ceil)) };
}

/**
 * Step-through training pipelines (SFT, reward model, RLHF with PPO, RLVR, GRPO): models, data and calculation nodes on a
 * small canvas; Next/Prev (or a click on a card) walks through the computation and shows each step's formula with worked
 * numbers. Plain HTML + SVG, no graph library; wide pipelines scroll sideways on phones. Every step is also printed as text
 * in a <details> block, so the content reads without JavaScript.
 */
export function PipelineLab({ pipes, t }: { pipes: PipeView[]; t: PipeStrings }) {
  const uid = useId();
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);
  const p = pipes[tab];
  const { pos, W, H, paths } = pipeLayout(p.nodes, p.edges);
  const cur = p.steps[step];
  const on = new Set(cur.nodes);
  // the step in which each node is computed (its first appearance as the lead node); its value shows from then on
  const firstStep = new Map<string, number>();
  p.steps.forEach((s, i) => { if (!firstStep.has(s.nodes[0])) firstStep.set(s.nodes[0], i); });
  const shown = (id: string) => !firstStep.has(id) || firstStep.get(id)! <= step;

  // fit the canvas to the column (never below 72%, so labels stay readable; wider pipelines then scroll sideways)
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setFit(Math.max(0.72, Math.min(1, (el.clientWidth - 2) / W)));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);
  // keep the card computed in this step in view when the canvas scrolls
  const lead = pos.get(cur.nodes[0]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !lead) return;
    const x1 = lead.x * fit, x2 = (lead.x + NW) * fit;
    if (x1 < el.scrollLeft || x2 > el.scrollLeft + el.clientWidth) el.scrollTo({ left: Math.max(0, x1 - 24), behavior: 'smooth' });
  }, [lead, fit]);

  const pick = (i: number) => { setTab(i); setStep(0); };
  const go = (i: number) => setStep(Math.max(0, Math.min(p.steps.length - 1, i)));

  return (
    <section className="pl" aria-labelledby={`${uid}-h`}>
      <h2 id={`${uid}-h`} className="pl__h">{t.heading}</h2>
      <p className="pl__hint">{t.hint}</p>
      <div className="pl__tabs" role="tablist" aria-label={t.heading}>
        {pipes.map((q, i) => (
          <button key={q.id} type="button" role="tab" id={`${uid}-t-${q.id}`} aria-selected={i === tab} aria-controls={`${uid}-p`} className="pl__tab" onClick={() => pick(i)}>{q.tab}</button>
        ))}
      </div>
      <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t-${p.id}`} className="pl__panel">
        <h3 className="pl__title">{p.title}</h3>
        <p className="pl__intro">{p.intro}</p>
        <div className="pl__scroll" ref={scrollRef}>
          <div className="pl__fit" style={{ width: W * fit, height: H * fit } as CSSProperties}>
          <div className="pl__stage" style={{ width: W, height: H, transform: fit < 1 ? `scale(${fit})` : undefined } as CSSProperties}>
            <svg className="pl__edges" width={W} height={H} aria-hidden="true">
              <defs>
                <marker id={`${uid}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" /></marker>
              </defs>
              {p.edges.map((e, i) => {
                const r = paths[i];
                const lit = on.has(e.from) && on.has(e.to);
                return (
                  <g key={e.from + '>' + e.to} className="pl__edge" data-on={lit ? '' : undefined}>
                    <path d={r.d} markerEnd={`url(#${uid}-a)`} />
                    {e.label && <text x={r.at.x} y={r.at.y - 5} textAnchor="middle">{e.label}</text>}
                  </g>
                );
              })}
            </svg>
            {p.nodes.map((n) => {
              const at = pos.get(n.id)!;
              const lead = cur.nodes[0] === n.id;
              const target = firstStep.get(n.id);
              return (
                <button
                  key={n.id} type="button" className="pl__node" data-kind={n.kind} data-on={on.has(n.id) ? '' : undefined} data-cur={lead ? '' : undefined}
                  style={{ left: at.x, top: at.y, width: NW, height: NH } as CSSProperties}
                  onClick={() => target !== undefined && go(target)} title={n.note} aria-label={`${n.label}. ${n.note}`}
                >
                  <span className="pl__kind">{t.kinds[n.kind]}</span>
                  <span className="pl__label">{n.label}</span>
                  {n.value && <span className="pl__value" data-hidden={shown(n.id) ? undefined : ''}>{shown(n.id) ? n.value : '?'}</span>}
                </button>
              );
            })}
          </div>
          </div>
        </div>
        <div className="pl__step" aria-live="polite">
          <div className="pl__nav">
            <button type="button" className="pl__btn" onClick={() => go(step - 1)} disabled={step === 0} aria-label={t.prev}><ChevronLeft size={16} aria-hidden="true" /></button>
            <span className="pl__count">{t.step.replace('{n}', String(step + 1)).replace('{m}', String(p.steps.length))}</span>
            <button type="button" className="pl__btn" onClick={() => go(step + 1)} disabled={step === p.steps.length - 1} aria-label={t.next}><ChevronRight size={16} aria-hidden="true" /></button>
            <span className="pl__dots" aria-hidden="true">{p.steps.map((_, i) => <span key={i} data-on={i === step ? '' : undefined} data-done={i < step ? '' : undefined} />)}</span>
          </div>
          <p className="pl__stitle">{cur.title}</p>
          {cur.text && <p className="pl__stext">{cur.text}</p>}
          <p className="pl__calcl">{t.calc}</p>
          <pre className="pl__calc"><code>{cur.calc.join('\n')}</code></pre>
        </div>
      </div>
      <details className="pl__all">
        <summary>{t.all}</summary>
        {pipes.map((q) => (
          <div key={q.id}>
            <h3>{q.title}</h3>
            <ol>{q.steps.map((s, i) => <li key={i}><strong>{s.title}.</strong> {s.text} <code>{s.calc.join(' · ')}</code></li>)}</ol>
          </div>
        ))}
      </details>
    </section>
  );
}
