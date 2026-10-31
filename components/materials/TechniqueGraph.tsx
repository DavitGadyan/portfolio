'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { X } from 'lucide-react';

export type TechniqueView = { id: string; group: string; title: string; sub: string; when: string; what: string; why: string; saving?: string; savingKind?: 'official' | 'estimate' };
export type ToolView = { id: string; name: string; logo: string; scale: number; techniques: TechniqueView[] };
export type GraphStrings = { label: string; close: string; when: string; what: string; why: string; saving: string; estimate: string; official: string; hint: string };

// ---- geometry in stage percentages, derived from the index only (server and client render the same strings) ----
const PAD = 9;
const f = (v: number) => v.toFixed(1);
type Pt = { x: number; y: number };
const spread = (k: number, r: number, from: number, to: number) => (k === 1 ? (from + to) / 2 : from + (r * (to - from)) / (k - 1));
/**
 * Wide stages: the cards sit on the four sides of a rectangle (clockwise from the top-left), which keeps neighbours
 * evenly apart however narrow the stage gets. Phones: two columns. Both sets are rendered; CSS picks one.
 */
function place(i: number, n: number): { ring: Pt; cols: Pt } {
  const base = Math.floor(n / 4), extra = n % 4;
  const counts = [base + (extra > 0 ? 1 : 0), base + (extra > 2 ? 1 : 0), base + (extra > 1 ? 1 : 0), base]; // top, right, bottom, left
  let side = 0, r = i;
  while (r >= counts[side]) { r -= counts[side]; side++; }
  const k = counts[side];
  const ring = side === 0 ? { x: spread(k, r, 24, 76), y: 10 } : side === 1 ? { x: 88, y: spread(k, r, 28, 72) } : side === 2 ? { x: spread(k, r, 76, 24), y: 90 } : { x: 12, y: spread(k, r, 72, 28) };
  const half = Math.ceil(n / 2), left = i < half, kc = left ? half : n - half, rc = left ? i : i - half;
  const cols = { x: left ? 20 : 80, y: spread(kc, rc, PAD, 100 - PAD) };
  return { ring, cols };
}

/**
 * Technique map: the tool's logo in the centre, its techniques around it, straight wires and a travelling spark per
 * wire, and an inline panel with the details of the selected technique. Reusable for any tool: everything
 * tool-specific comes in through `tool`. Positions are plain percentages, so nothing is measured, and the sparks are
 * ordinary elements moved with `translate` in container units, so the animation stays on the compositor (the SVG
 * itself is static; animating strokes repainted it every frame and halved the frame rate).
 */
export function TechniqueGraph({ tool, t }: { tool: ToolView; t: GraphStrings }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const n = tool.techniques.length;
  const active = open ? tool.techniques.find((x) => x.id === open) : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); opener.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = (id: string, el: HTMLButtonElement) => {
    opener.current = el;
    const opening = open !== id;
    setOpen(opening ? id : null);
    if (opening) panel.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); // a no-op when the panel is already on screen
  };
  const close = () => { setOpen(null); opener.current?.focus(); };
  const spots = tool.techniques.map((_, i) => place(i, n));

  return (
    <div className="tg" role="group" aria-label={t.label.replace('{tool}', tool.name)}>
      <div className="tg__layout" data-open={open ?? undefined}>
        <div className="tg__stage">
          <svg className="tg__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {tool.techniques.map((k, i) => (
              <g key={k.id} data-hot={hot === k.id || undefined} data-open={open === k.id || undefined}>
                <path className="tg__wire tg__wire--ring" d={`M50 50 L${f(spots[i].ring.x)} ${f(spots[i].ring.y)}`} vectorEffect="non-scaling-stroke" />
                <path className="tg__wire tg__wire--cols" d={`M50 50 L${f(spots[i].cols.x)} ${f(spots[i].cols.y)}`} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>
          <div className="tg__sparks" aria-hidden="true">
            {tool.techniques.map((k, i) => (
              <span
                key={k.id} className="tg__spark"
                style={{ '--dx': `${f(spots[i].ring.x - 50)}cqw`, '--dy': `${f(spots[i].ring.y - 50)}cqh`, '--mx': `${f(spots[i].cols.x - 50)}cqw`, '--my': `${f(spots[i].cols.y - 50)}cqh`, '--i': i } as CSSProperties}
              />
            ))}
          </div>
          <div className="tg__core" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
            <img src={tool.logo} alt="" width={64} height={64} style={{ '--k': tool.scale } as CSSProperties} />
          </div>
          {tool.techniques.map((k, i) => (
            <button
              key={k.id} type="button" className="tg__node" data-id={k.id}
              style={{ '--rx': `${f(spots[i].ring.x)}%`, '--ry': `${f(spots[i].ring.y)}%`, '--kx': `${f(spots[i].cols.x)}%`, '--ky': `${f(spots[i].cols.y)}%`, '--i': i } as CSSProperties}
              aria-expanded={open === k.id} aria-controls="tg-panel"
              onClick={(e) => toggle(k.id, e.currentTarget)}
              onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHot(k.id); }} onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(k.id)} onBlur={() => setHot(null)}
            >
              <span className="tg__title">{k.title}</span>
              <span className="tg__sub">{k.sub}</span>
            </button>
          ))}
        </div>
        <div ref={panel} id="tg-panel" className="tg__panel" role="region" aria-live="polite" aria-labelledby="tg-panel-title" data-state={active ? 'open' : 'empty'}>
          {active ? (
            <>
              <p className="tg__group">{active.group}</p>
              <h3 id="tg-panel-title" className="tg__ptitle">{active.title}</h3>
              <p className="tg__psub">{active.sub}</p>
              <dl className="tg__dl">
                <dt>{t.when}</dt><dd>{active.when}</dd>
                <dt>{t.what}</dt><dd>{active.what}</dd>
                <dt>{t.why}</dt><dd>{active.why}</dd>
              </dl>
              {active.saving && (
                <p className="tg__chip" data-kind={active.savingKind}>
                  <span>{t.saving}: </span>{active.saving} <em>({active.savingKind === 'official' ? t.official : t.estimate})</em>
                </p>
              )}
              <button type="button" className="tg__close" aria-label={t.close} onClick={close}><X size={18} aria-hidden="true" /></button>
            </>
          ) : (
            <p id="tg-panel-title" className="tg__hint">{t.hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
