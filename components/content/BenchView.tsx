'use client';

import { useState } from 'react';

export type BenchViewRun = {
  id: string;
  label: string;
  quant: string;
  pick?: string;
  pickLabel?: string;
  metrics: Record<string, number | undefined>;
  caveat?: boolean;
  tok: Partial<Record<1 | 2 | 4 | 8 | 16, number>>;
  weights?: number;
  loadS?: number;
  docs: number;
  gp?: { cap: number; rps: number; tok: number; ttft95?: number; itl?: number; cs: number[] };
};
export type BenchViewPoint = { c: number; tok: number; user: number; rps: number; ttft: number; ttft95: number; itl: number; e2e: number; e2e95: number };
export type BenchViewCurve = { id: string; label: string; pick?: string; on: boolean; pts: BenchViewPoint[] };
export type BenchViewTech = { id: string; label: string; verdict: string; base?: string; cand?: string; deltas: { metric: string; value: number; unit: string; better: 'up' | 'down' }[] };
export type BenchViewAb = { candidate: string; baseline: string; verdict: string; metric: string; delta: number; lo: number; hi: number; unit: string; p?: number; n?: number; reps?: [number, number]; prec?: [number, number, number] };
export type BenchViewMetric = { id: string; label: string; unit: '%' | 's' | '$' | ''; better: 'up' | 'down' };
export type BenchViewStrings = {
  tabs: { cost: string; speed: string; goodput: string; metric: string; tech: string; ab: string };
  gpNote: string;
  gpUnit: string;
  gpNone: string;
  gpTested: string;
  costX: string;
  costY: string;
  speedX: string;
  hint: string;
  better: string;
  notMeasured: string;
  verdict: string;
  ci: string;
  caveat: string;
  showAll: string;
  showTop: string;
  abNote: string;
  load: Record<'tok' | 'user' | 'ttft' | 'ttft95' | 'itl' | 'e2e', string>;
  loadNote: string;
  users: string;
  weights: string;
  coldStart: string;
  docs: string;
  tokAt: string;
  precision: string;
  paired: string;
  reps: string;
  holm: string;
};
export type BenchViewData = { id: string; runs: BenchViewRun[]; curves: BenchViewCurve[]; metrics: BenchViewMetric[]; techniques: BenchViewTech[]; ab: BenchViewAb[]; s: BenchViewStrings };

type Tab = 'cost' | 'speed' | 'goodput' | 'metric' | 'tech' | 'ab';
type LoadKey = keyof BenchViewStrings['load'];
const PICK_COLOR: Record<string, string> = { quality: '#1faa55', balanced: '#38bdf8', cost: '#38bdf8', recall: '#a78bfa', throughput: '#f59e0b', numeric: '#f472b6' };
const LINE_COLOR = ['#2dd4bf', '#f87171', '#facc15', '#93c5fd', '#fdba74'];
const color = (r: { pick?: string }) => (r.pick ? PICK_COLOR[r.pick] : '#9ca3af');
const fmtV = (v: number, unit: string) => (unit === '$' ? `$${v.toFixed(2)}` : unit === '%' ? `${v.toFixed(1)}%` : unit === 's' ? `${v.toFixed(0)} s` : v.toFixed(1));
const LOAD_UNIT: Record<LoadKey, string> = { tok: '', user: '', ttft: 'ms', ttft95: 'ms', itl: 'ms', e2e: 's' };
const fmtL = (v: number, k: LoadKey) => (LOAD_UNIT[k] === 'ms' ? (v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`) : LOAD_UNIT[k] === 's' ? `${v.toFixed(1)} s` : `${Math.round(v)}`);
const signed = (v: number) => `${v > 0 ? '+' : ''}${v}`;

/** Interactive charts for a measured benchmark (Bench.tsx renders the tables for readers without JavaScript). Plain SVG, no chart library. */
export function BenchView({ data }: { data: BenchViewData }) {
  const { runs, curves, metrics, techniques, ab, s } = data;
  const tabs: Tab[] = ['cost', ...(curves.length ? (['speed'] as Tab[]) : []), ...(runs.some((r) => r.gp) ? (['goodput'] as Tab[]) : []), 'metric', 'tech', ...(ab.length ? (['ab'] as Tab[]) : [])];
  const [tab, setTab] = useState<Tab>('cost');
  const [sel, setSel] = useState<string>(runs.find((r) => r.pick === 'quality')?.id ?? runs[0]?.id ?? '');
  const [metric, setMetric] = useState<string>(metrics[0]?.id ?? '');
  const current = runs.find((r) => r.id === sel);

  return (
    <div className="bch" data-bench={data.id}>
      <div className="bch__tabs" role="tablist" aria-label={s.hint}>
        {tabs.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className="bch__tab" onClick={() => setTab(t)}>{s.tabs[t]}</button>
        ))}
      </div>
      <div className="bch__panel" role="tabpanel">
        {tab === 'cost' && <CostChart runs={runs} s={s} sel={sel} onSel={setSel} />}
        {tab === 'speed' && <LoadChart curves={curves} s={s} />}
        {tab === 'goodput' && <GoodputChart runs={runs} s={s} />}
        {tab === 'metric' && <MetricChart runs={runs} metrics={metrics} metric={metric} onMetric={setMetric} s={s} />}
        {tab === 'tech' && <TechChart techniques={techniques} runs={runs} s={s} />}
        {tab === 'ab' && <AbChart ab={ab} s={s} />}
        {tab === 'cost' && current && <RunDetail r={current} metrics={metrics} s={s} />}
        <p className="bch__hint">{s.hint}</p>
      </div>
    </div>
  );
}

function RunDetail({ r, metrics, s }: { r: BenchViewRun; metrics: BenchViewMetric[]; s: BenchViewStrings }) {
  const extra: [string, string][] = [
    [`${s.tokAt} 4 · 16`, `${r.tok[4] ?? '–'} · ${r.tok[16] ?? '–'}`],
    [s.weights, r.weights === undefined ? '–' : `${r.weights} GiB`],
    [s.coldStart, r.loadS === undefined ? '–' : `${r.loadS} s`],
    [s.docs, String(r.docs)],
  ];
  return (
    <div className="bch__detail" aria-live="polite">
      <strong style={{ color: color(r) }}>{r.label}</strong>{r.pickLabel && <span className="bch__pick">{r.pickLabel}</span>}
      <dl>
        {metrics.map((m) => (
          <div key={m.id}><dt>{m.label}</dt><dd>{r.metrics[m.id] === undefined ? s.notMeasured : fmtV(r.metrics[m.id]!, m.unit)}{m.id === 'grounding' && r.caveat ? ' *' : ''}</dd></div>
        ))}
        {extra.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
      {r.caveat && <p className="bch__note">* {s.caveat}</p>}
    </div>
  );
}

const W = 640, H = 360, PL = 56, PR = 20, PT = 20, PB = 48;

function axes(xTicks: { v: number; x: number; t: string }[], yTicks: { v: number; y: number; t: string }[], xLabel: string, yLabel: string) {
  return (
    <g className="bch__axes">
      {yTicks.map((t) => (<g key={`y${t.v}`}><line x1={PL} x2={W - PR} y1={t.y} y2={t.y} /><text x={PL - 8} y={t.y + 4} textAnchor="end">{t.t}</text></g>))}
      {xTicks.map((t) => (<text key={`x${t.v}`} x={t.x} y={H - PB + 18} textAnchor="middle">{t.t}</text>))}
      <text className="bch__axlabel" x={(PL + W - PR) / 2} y={H - 8} textAnchor="middle">{xLabel}</text>
      <text className="bch__axlabel" x={14} y={(PT + H - PB) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(PT + H - PB) / 2})`}>{yLabel}</text>
    </g>
  );
}

/** A small card next to the hovered point, placed by percentages of the chart box so it scales with the SVG. */
function Tip({ x, y, top, children }: { x: number; y: number; top?: boolean; children: React.ReactNode }) {
  const left = x / W > 0.55;
  return (
    <div className={top ? 'bch__tip bch__tip--top' : 'bch__tip'} style={{ top: `${(y / H) * 100}%`, ...(left ? { right: `${(1 - x / W) * 100 + 2}%` } : { left: `${(x / W) * 100 + 2}%` }) }} role="status">
      {children}
    </div>
  );
}

const TOP = 14;

function CostChart({ runs, s, sel, onSel }: { runs: BenchViewRun[]; s: BenchViewStrings; sel: string; onSel: (id: string) => void }) {
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const valid = runs.filter((r) => r.metrics.cost !== undefined && r.metrics.recall !== undefined);
  const top = new Set(valid.filter((r) => !r.pick).sort((a, b) => (b.metrics.quality ?? 0) - (a.metrics.quality ?? 0)).slice(0, TOP - valid.filter((r) => r.pick).length).map((r) => r.id));
  const pts = all ? valid : valid.filter((r) => r.pick || top.has(r.id) || r.id === sel);
  const xMax = Math.max(2, Math.ceil(Math.max(...pts.map((r) => r.metrics.cost!)) * 2) / 2);
  const step = xMax > 3 ? 1 : 0.5;
  const x = (v: number) => PL + (v / xMax) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / 100) * (H - PT - PB);
  const xt = Array.from({ length: Math.round(xMax / step) + 1 }, (_, i) => i * step).map((v) => ({ v, x: x(v), t: `$${v.toFixed(step < 1 ? 1 : 0)}` }));
  const yt = [0, 25, 50, 75, 100].map((v) => ({ v, y: y(v), t: `${v}%` }));
  const h = pts.find((r) => r.id === hover);
  const on = (id: string) => { setHover(id); onSel(id); };
  return (
    <>
      <div className="bch__plot">
        <svg viewBox={`0 0 ${W} ${H}`} className="bch__svg" role="img" aria-label={`${s.costY} / ${s.costX}`} onMouseLeave={() => setHover(null)}>
          {axes(xt, yt, s.costX, s.costY)}
          <text className="bch__better" x={PL + 8} y={PT + 14}>↖ {s.better}</text>
          {[...pts].sort((a, b) => Number(!!a.pick) - Number(!!b.pick)).map((r) => (
            <g key={r.id} className="bch__pt" data-on={r.id === sel || undefined} tabIndex={0} role="button" aria-label={r.label}
              onMouseEnter={() => on(r.id)} onFocus={() => on(r.id)} onBlur={() => setHover(null)} onClick={() => on(r.id)}>
              <circle cx={x(r.metrics.cost!)} cy={y(r.metrics.recall!)} r={r.id === sel ? 10 : r.pick ? 8 : 5} fill={color(r)} />
              {r.pick && r.id !== hover && (() => {
                const left = x(r.metrics.cost!) > W * 0.62 || r.pick === 'cost';
                return <text x={x(r.metrics.cost!) + (left ? -14 : 14)} y={y(r.metrics.recall!) + (r.pick === 'cost' ? -10 : 4)} textAnchor={left ? 'end' : 'start'}>{r.pickLabel}</text>;
              })()}
            </g>
          ))}
        </svg>
        {h && (
          <Tip x={x(h.metrics.cost!)} y={y(h.metrics.recall!)}>
            <strong style={{ color: color(h) }}>{h.label}</strong>
            <span>{s.costY}: <b>{fmtV(h.metrics.recall!, '%')}</b></span>
            <span>{s.costX.split(' (')[0]}: <b>{fmtV(h.metrics.cost!, '$')}</b></span>
            {h.metrics.quality !== undefined && <span>Q <b>{h.metrics.quality.toFixed(1)}</b> · {h.metrics.auditS !== undefined ? `${Math.round(h.metrics.auditS)} s` : ''} · {h.quant}</span>}
          </Tip>
        )}
      </div>
      {valid.length > pts.length || all ? <button type="button" className="bch__more" onClick={() => setAll((a) => !a)}>{all ? `${s.showTop.replace(/\d+/, String(TOP))}` : `${s.showAll} (${valid.length})`}</button> : null}
    </>
  );
}

const CS = [1, 2, 4, 8, 16] as const;

function LoadChart({ curves, s }: { curves: BenchViewCurve[]; s: BenchViewStrings }) {
  const [k, setK] = useState<LoadKey>('tok');
  const [shown, setShown] = useState<string[]>(curves.filter((c) => c.on).map((c) => c.id));
  const [hc, setHc] = useState<number | null>(null);
  const col = (id: string) => {
    const c = curves.find((x) => x.id === id)!;
    return c.pick ? PICK_COLOR[c.pick] : LINE_COLOR[curves.filter((x) => !x.pick).findIndex((x) => x.id === id) % LINE_COLOR.length];
  };
  const vis = curves.filter((c) => shown.includes(c.id));
  const ms = LOAD_UNIT[k] === 'ms';
  const raw = Math.max(1, ...vis.flatMap((c) => c.pts.map((p) => p[k])));
  const unit = ms && raw >= 2000 ? 1000 : 1;
  const yMax = Math.ceil(raw / unit / (raw / unit > 50 ? 50 : raw / unit > 10 ? 5 : 1)) * (raw / unit > 50 ? 50 : raw / unit > 10 ? 5 : 1);
  const x = (c: number) => PL + (CS.indexOf(c as (typeof CS)[number]) / (CS.length - 1)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / unit / yMax) * (H - PT - PB);
  const xt = CS.map((c) => ({ v: c, x: x(c), t: String(c) }));
  const yt = Array.from({ length: 6 }, (_, i) => +((yMax / 5) * i).toFixed(1)).map((v) => ({ v, y: PT + (1 - v / yMax) * (H - PT - PB), t: `${v}${ms ? (unit === 1000 ? ' s' : ' ms') : LOAD_UNIT[k] === 's' ? ' s' : ''}` }));
  const colW = (W - PL - PR) / (CS.length - 1);
  const atC = hc === null ? [] : vis.map((c) => ({ c, p: c.pts.find((p) => p.c === hc) })).filter((v) => v.p).sort((a, b) => b.p![k] - a.p![k]);
  return (
    <>
      <div className="bch__legend" role="group" aria-label={s.tabs.speed}>
        {(Object.keys(s.load) as LoadKey[]).map((m) => (<button key={m} type="button" aria-pressed={m === k} onClick={() => setK(m)}>{s.load[m]}</button>))}
      </div>
      <div className="bch__plot">
        <svg viewBox={`0 0 ${W} ${H}`} className="bch__svg" role="img" aria-label={`${s.load[k]} / ${s.speedX}`} onMouseLeave={() => setHc(null)}>
          {axes(xt, yt, s.speedX, s.load[k])}
          {hc !== null && <line className="bch__guide" x1={x(hc)} x2={x(hc)} y1={PT} y2={H - PB} />}
          {vis.map((c) => {
            const p = c.pts.map((q) => [x(q.c), y(q[k])] as const);
            return (
              <g key={c.id}>
                <polyline points={p.map((q) => q.join(',')).join(' ')} fill="none" stroke={col(c.id)} strokeWidth={3} strokeLinejoin="round" />
                {c.pts.map((q, i) => (<circle key={q.c} cx={p[i][0]} cy={p[i][1]} r={q.c === hc ? 6 : 4} fill={col(c.id)} />))}
              </g>
            );
          })}
          {CS.map((c) => (
            <rect key={c} className="bch__hit" x={x(c) - colW / 2} y={PT} width={colW} height={H - PT - PB} tabIndex={0} aria-label={`${c} ${s.users}`}
              onMouseEnter={() => setHc(c)} onFocus={() => setHc(c)} onBlur={() => setHc(null)} onClick={() => setHc(c)} />
          ))}
        </svg>
        {hc !== null && atC.length > 0 && (
          <Tip x={x(hc)} y={PT} top>
            <strong>{hc} {s.users}</strong>
            <table className="bch__tt">
              <tbody>
                {atC.map(({ c, p }) => (
                  <tr key={c.id}>
                    <th scope="row"><i style={{ background: col(c.id) }} />{c.label}</th>
                    <td><b>{fmtL(p![k], k)}</b></td>
                    <td>{k === 'tok' ? `${Math.round(p!.user)}/u` : `${Math.round(p!.tok)} t/s`}</td>
                    <td>{k === 'ttft' || k === 'ttft95' ? `${p!.e2e.toFixed(1)} s` : fmtL(p!.ttft, 'ttft')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tip>
        )}
      </div>
      <div className="bch__legend bch__legend--runs">
        {curves.map((c) => (
          <button key={c.id} type="button" aria-pressed={shown.includes(c.id)} onClick={() => setShown((h) => (h.includes(c.id) ? h.filter((x) => x !== c.id) : [...h, c.id]))}><i style={{ background: col(c.id) }} />{c.label}</button>
        ))}
      </div>
      <p className="bch__note">{s.loadNote}</p>
    </>
  );
}

/** Goodput: requests per second served within the latency SLO, best runs first; useful (quality >= 60) runs and the picks by default. */
function GoodputChart({ runs, s }: { runs: BenchViewRun[]; s: BenchViewStrings }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const withGp = runs.filter((r) => r.gp).sort((a, b) => b.gp!.rps - a.gp!.rps);
  const useful = withGp.filter((r) => r.pick || (r.metrics.quality ?? 0) >= 60);
  const rows = all ? withGp : useful;
  const max = Math.max(...rows.map((r) => r.gp!.rps), 0.01);
  return (
    <>
      <p className="bch__note">{s.gpNote}</p>
      <ul className="bch__bars" onMouseLeave={() => setOpen(null)}>
        {rows.map((r) => (
          <li key={r.id} data-open={r.id === open || undefined} tabIndex={0} onMouseEnter={() => setOpen(r.id)} onFocus={() => setOpen(r.id)} onClick={() => setOpen(r.id)}>
            <span className="bch__blabel">{r.label}</span>
            <span className="bch__btrack"><span className="bch__bfill" style={{ width: `${(r.gp!.rps / max) * 100}%`, background: color(r) }} /></span>
            <span className="bch__bval">{r.gp!.cap ? `${r.gp!.rps.toFixed(2)} · ${r.gp!.cap}×` : s.gpNone}</span>
            {r.id === open && (
              <span className="bch__more-row">
                <span>{s.load.tok} <b>{Math.round(r.gp!.tok)}</b></span>
                {r.gp!.ttft95 !== undefined && <span>{s.load.ttft95} <b>{fmtL(r.gp!.ttft95, 'ttft95')}</b></span>}
                {r.gp!.itl !== undefined && <span>{s.load.itl} <b>{r.gp!.itl.toFixed(1)} ms</b></span>}
                <span>{s.gpTested} <b>{r.gp!.cs.join(', ')}</b></span>
                {r.metrics.quality !== undefined && <span>Q <b>{r.metrics.quality.toFixed(1)}</b></span>}
                {r.pickLabel && <span className="bch__pick">{r.pickLabel}</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
      {withGp.length > useful.length && <button type="button" className="bch__more" onClick={() => setAll((a) => !a)}>{all ? s.showTop.replace(/\d+/, String(useful.length)) : `${s.showAll} (${withGp.length})`}</button>}
      <p className="bch__note">{s.gpUnit}</p>
    </>
  );
}

function MetricChart({ runs, metrics, metric, onMetric, s }: { runs: BenchViewRun[]; metrics: BenchViewMetric[]; metric: string; onMetric: (id: string) => void; s: BenchViewStrings }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const m = metrics.find((x) => x.id === metric)!;
  const sorted = runs.map((r) => ({ r, v: r.metrics[m.id] })).filter((x) => x.v !== undefined).sort((a, b) => (m.better === 'up' ? b.v! - a.v! : a.v! - b.v!));
  const rows = all ? sorted : sorted.slice(0, 12);
  const max = Math.max(...rows.map((x) => x.v ?? 0), m.unit === '%' ? 100 : 0) || 1;
  const best = sorted[0]?.r.id;
  const others = metrics.filter((x) => x.id !== m.id && ['quality', 'recall', 'precision', 'numeric', 'auditS', 'cost'].includes(x.id));
  return (
    <>
      <div className="bch__legend">
        {metrics.map((x) => (<button key={x.id} type="button" aria-pressed={x.id === metric} onClick={() => onMetric(x.id)}>{x.label}</button>))}
      </div>
      <ul className="bch__bars" onMouseLeave={() => setOpen(null)}>
        {rows.map(({ r, v }) => (
          <li key={r.id} data-best={r.id === best || undefined} data-open={r.id === open || undefined} tabIndex={0}
            onMouseEnter={() => setOpen(r.id)} onFocus={() => setOpen(r.id)} onClick={() => setOpen(r.id)}>
            <span className="bch__blabel">{r.label}{m.id === 'grounding' && r.caveat ? ' *' : ''}</span>
            <span className="bch__btrack">{v !== undefined && <span className="bch__bfill" style={{ width: `${(v / max) * 100}%`, background: color(r) }} />}</span>
            <span className="bch__bval">{v === undefined ? s.notMeasured : fmtV(v, m.unit)}</span>
            {r.id === open && (
              <span className="bch__more-row">
                {others.map((o) => (r.metrics[o.id] === undefined ? null : <span key={o.id}>{o.label} <b>{fmtV(r.metrics[o.id]!, o.unit)}</b></span>))}
                <span>{s.tokAt} 16 <b>{r.tok[16] ?? r.tok[4] ?? '–'}{r.tok[16] ? '' : ' (4)'}</b></span>
                {r.pickLabel && <span className="bch__pick">{r.pickLabel}</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
      {sorted.length > 12 && <button type="button" className="bch__more" onClick={() => setAll((a) => !a)}>{all ? s.showTop : `${s.showAll} (${sorted.length})`}</button>}
    </>
  );
}

function TechChart({ techniques, runs, s }: { techniques: BenchViewTech[]; runs: BenchViewRun[]; s: BenchViewStrings }) {
  const [open, setOpen] = useState<string | null>(null);
  const brief = (id?: string) => {
    const r = runs.find((x) => x.id === id);
    return r ? `${r.label}: Q ${r.metrics.quality?.toFixed(1) ?? '–'} · ${r.metrics.auditS !== undefined ? Math.round(r.metrics.auditS) : '–'} s · ${r.metrics.cost !== undefined ? `$${r.metrics.cost.toFixed(2)}` : '–'} · ${r.tok[4] ?? '–'} t/s @4` : null;
  };
  return (
    <div className="bch__tech">
      {techniques.map((t) => {
        const max = Math.max(...t.deltas.map((d) => Math.abs(d.value)), 10); // a floor of 10 keeps a +1% change from drawing as a full bar
        const b = brief(t.base), c = brief(t.cand);
        return (
          <section key={t.id} tabIndex={0} onMouseEnter={() => setOpen(t.id)} onMouseLeave={() => setOpen(null)} onFocus={() => setOpen(t.id)} onBlur={() => setOpen(null)}>
            <h4>{t.label}</h4>
            <ul className="bch__delta">
              {t.deltas.map((d) => {
                const good = d.value === 0 ? 'zero' : (d.value > 0) === (d.better === 'up') ? 'good' : 'bad';
                return (
                  <li key={d.metric} data-k={good}>
                    <span className="bch__blabel">{d.metric}</span>
                    <span className="bch__dtrack"><span className="bch__dfill" style={{ width: `${(Math.abs(d.value) / max) * 50}%`, [d.value < 0 ? 'right' : 'left']: '50%' }} /></span>
                    <span className="bch__bval">{signed(d.value)}{d.unit === 'pts' ? ' pts' : d.unit}</span>
                  </li>
                );
              })}
            </ul>
            {open === t.id && b && c && <p className="bch__note bch__runs">{b}<br />{c}</p>}
            <p className="bch__verdict"><strong>{s.verdict}:</strong> {t.verdict}</p>
          </section>
        );
      })}
    </div>
  );
}

function AbChart({ ab, s }: { ab: BenchViewAb[]; s: BenchViewStrings }) {
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const rows = all ? ab : ab.slice(0, 12);
  const max = Math.max(...rows.flatMap((a) => [Math.abs(a.lo), Math.abs(a.hi)]), 1);
  const pos = (v: number) => `${50 + (v / max) * 48}%`;
  return (
    <>
      <p className="bch__note">{s.abNote}</p>
      <ul className="bch__ab" onMouseLeave={() => setOpen(null)}>
        {rows.map((a) => {
          const key = `${a.candidate}-${a.baseline}`;
          return (
            <li key={key} data-v={a.verdict} data-open={key === open || undefined} tabIndex={0} onMouseEnter={() => setOpen(key)} onFocus={() => setOpen(key)} onClick={() => setOpen(key)}>
              <span className="bch__blabel">{a.candidate} <em>vs {a.baseline}</em>{a.metric !== ab[ab.length - 1]?.metric && <><br /><small>{a.metric}</small></>}</span>
              <span className="bch__citrack" aria-label={`${s.ci} ${a.lo} … ${a.hi}`}>
                <span className="bch__ci" style={{ left: pos(Math.min(a.lo, a.hi)), right: `calc(100% - ${pos(Math.max(a.lo, a.hi))})` }} />
                <span className="bch__cidot" style={{ left: pos(a.delta) }} />
              </span>
              <span className="bch__bval">{a.verdict}</span>
              {key === open && (
                <span className="bch__more-row">
                  <span>{a.metric} <b>{signed(a.delta)} pts</b> [{a.lo}, {a.hi}]</span>
                  {a.prec && <span>{s.precision} <b>{signed(a.prec[0])} pts</b> [{a.prec[1]}, {a.prec[2]}]</span>}
                  {a.n !== undefined && <span>{s.paired} <b>{a.n}</b></span>}
                  {a.reps && <span>{s.reps} <b>{a.reps[0]} / {a.reps[1]}</b></span>}
                  {a.p !== undefined && <span>{s.holm} <b>{a.p.toFixed(3)}</b></span>}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {ab.length > 12 && <button type="button" className="bch__more" onClick={() => setAll((x) => !x)}>{all ? s.showTop : `${s.showAll} (${ab.length})`}</button>}
    </>
  );
}
