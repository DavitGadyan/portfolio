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
  speed?: boolean;
  tok: Partial<Record<1 | 2 | 4 | 8 | 16, number>>;
};
export type BenchViewTech = { id: string; label: string; verdict: string; deltas: { metric: string; value: number; unit: string; better: 'up' | 'down' }[] };
export type BenchViewAb = { candidate: string; baseline: string; verdict: string; metric: string; delta: number; lo: number; hi: number; unit: string; p?: number };
export type BenchViewMetric = { id: string; label: string; unit: '%' | 's' | '$' | ''; better: 'up' | 'down' };
export type BenchViewStrings = {
  tabs: { cost: string; speed: string; metric: string; tech: string; ab: string };
  costX: string;
  costY: string;
  speedX: string;
  speedY: string;
  hint: string;
  better: string;
  notMeasured: string;
  verdict: string;
  ci: string;
  caveat: string;
  showAll: string;
  showTop: string;
  abNote: string;
};
export type BenchViewData = { id: string; runs: BenchViewRun[]; metrics: BenchViewMetric[]; techniques: BenchViewTech[]; ab: BenchViewAb[]; s: BenchViewStrings };

type Tab = 'cost' | 'speed' | 'metric' | 'tech' | 'ab';
const PICK_COLOR: Record<string, string> = { quality: '#1faa55', balanced: '#38bdf8', recall: '#a78bfa', throughput: '#f59e0b', cost: '#f472b6' };
const SPEED_COLOR = ['#2dd4bf', '#f87171', '#facc15'];
const color = (r: BenchViewRun, i = -1) => (r.pick ? PICK_COLOR[r.pick] : i >= 0 ? SPEED_COLOR[i % SPEED_COLOR.length] : '#9ca3af');
const fmtV = (v: number, unit: string) => (unit === '$' ? `$${v.toFixed(2)}` : unit === '%' ? `${v.toFixed(1)}%` : unit === 's' ? `${v.toFixed(0)} s` : v.toFixed(1));

/** Interactive charts for a measured benchmark (Bench.tsx renders the tables for readers without JavaScript). Plain SVG, no chart library. */
export function BenchView({ data }: { data: BenchViewData }) {
  const { runs, metrics, techniques, ab, s } = data;
  const tabs: Tab[] = ['cost', 'speed', 'metric', 'tech', ...(ab.length ? (['ab'] as Tab[]) : [])];
  const [tab, setTab] = useState<Tab>('cost');
  const [sel, setSel] = useState<string>(runs[0]?.id ?? '');
  const [metric, setMetric] = useState<string>(metrics[0]?.id ?? '');
  const [hidden, setHidden] = useState<string[]>([]);
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
        {tab === 'speed' && <SpeedChart runs={runs} s={s} hidden={hidden} onToggle={(id) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]))} />}
        {tab === 'metric' && <MetricChart runs={runs} metrics={metrics} metric={metric} onMetric={setMetric} s={s} />}
        {tab === 'tech' && <TechChart techniques={techniques} s={s} />}
        {tab === 'ab' && <AbChart ab={ab} s={s} />}
        {tab === 'cost' && current && (
          <div className="bch__detail" aria-live="polite">
            <strong style={{ color: color(current) }}>{current.label}</strong>{current.pickLabel && <span className="bch__pick">{current.pickLabel}</span>}
            <dl>
              {metrics.map((m) => (
                <div key={m.id}><dt>{m.label}</dt><dd>{current.metrics[m.id] === undefined ? s.notMeasured : fmtV(current.metrics[m.id]!, m.unit)}{m.id === 'grounding' && current.caveat ? ' *' : ''}</dd></div>
              ))}
            </dl>
            {current.caveat && <p className="bch__note">* {s.caveat}</p>}
          </div>
        )}
        <p className="bch__hint">{s.hint}</p>
      </div>
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

function CostChart({ runs, s, sel, onSel }: { runs: BenchViewRun[]; s: BenchViewStrings; sel: string; onSel: (id: string) => void }) {
  const pts = runs.filter((r) => r.metrics.cost !== undefined && r.metrics.recall !== undefined);
  const xMax = Math.max(2, Math.ceil(Math.max(...pts.map((r) => r.metrics.cost!)) * 2) / 2);
  const x = (v: number) => PL + (v / xMax) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / 100) * (H - PT - PB);
  const xt = Array.from({ length: Math.round(xMax / 0.5) + 1 }, (_, i) => i * 0.5).map((v) => ({ v, x: x(v), t: `$${v.toFixed(1)}` }));
  const yt = [0, 25, 50, 75, 100].map((v) => ({ v, y: y(v), t: `${v}%` }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bch__svg" role="img" aria-label={`${s.costY} / ${s.costX}`}>
      {axes(xt, yt, s.costX, s.costY)}
      <text className="bch__better" x={PL + 8} y={PT + 14}>↖ {s.better}</text>
      {pts.map((r) => (
        <g key={r.id} className="bch__pt" data-on={r.id === sel || undefined} tabIndex={0} role="button" aria-label={r.label}
          onMouseEnter={() => onSel(r.id)} onFocus={() => onSel(r.id)} onClick={() => onSel(r.id)}>
          <circle cx={x(r.metrics.cost!)} cy={y(r.metrics.recall!)} r={r.id === sel ? 10 : r.pick ? 8 : 5} fill={color(r)} />
          {(r.pick || r.id === sel) && (() => {
            const left = r.pick === 'balanced' || x(r.metrics.cost!) > W * 0.62;
            return <text x={x(r.metrics.cost!) + (left ? -14 : 14)} y={y(r.metrics.recall!) + (r.pick === 'balanced' ? -10 : 4)} textAnchor={left ? 'end' : 'start'}>{r.pickLabel ?? r.label}</text>;
          })()}
        </g>
      ))}
    </svg>
  );
}

function SpeedChart({ runs, s, hidden, onToggle }: { runs: BenchViewRun[]; s: BenchViewStrings; hidden: string[]; onToggle: (id: string) => void }) {
  const cs = [1, 4, 8, 16] as const;
  const withTok = runs.filter((r) => (r.pick || r.speed) && Object.keys(r.tok).length > 0);
  const extra = withTok.filter((r) => !r.pick).map((r) => r.id);
  const yMax = Math.ceil(Math.max(...withTok.flatMap((r) => Object.values(r.tok) as number[])) / 100) * 100;
  const x = (c: number) => PL + (cs.indexOf(c as (typeof cs)[number]) / (cs.length - 1)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - v / yMax) * (H - PT - PB);
  const xt = cs.map((c) => ({ v: c, x: x(c), t: String(c) }));
  const yt = Array.from({ length: 6 }, (_, i) => Math.round((yMax / 5) * i)).map((v) => ({ v, y: y(v), t: String(v) }));
  return (
    <>
      <div className="bch__legend">
        {withTok.map((r) => (
          <button key={r.id} type="button" aria-pressed={!hidden.includes(r.id)} onClick={() => onToggle(r.id)}><i style={{ background: color(r, extra.indexOf(r.id)) }} />{r.label}</button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="bch__svg" role="img" aria-label={`${s.speedY} / ${s.speedX}`}>
        {axes(xt, yt, s.speedX, s.speedY)}
        {withTok.filter((r) => !hidden.includes(r.id)).map((r) => {
          const col = color(r, extra.indexOf(r.id));
          const p = cs.filter((c) => r.tok[c] !== undefined).map((c) => [x(c), y(r.tok[c]!)] as const);
          return (
            <g key={r.id}>
              <polyline points={p.map((q) => q.join(',')).join(' ')} fill="none" stroke={col} strokeWidth={3} />
              {p.map(([px, py], i) => (<circle key={i} cx={px} cy={py} r={5} fill={col} />))}
              {p.length > 0 && <text className="bch__end" x={p[p.length - 1][0] - 6} y={p[p.length - 1][1] - 10} textAnchor="end" fill={col}>{r.tok[cs.filter((c) => r.tok[c] !== undefined).at(-1)!]}</text>}
            </g>
          );
        })}
      </svg>
    </>
  );
}

function MetricChart({ runs, metrics, metric, onMetric, s }: { runs: BenchViewRun[]; metrics: BenchViewMetric[]; metric: string; onMetric: (id: string) => void; s: BenchViewStrings }) {
  const [all, setAll] = useState(false);
  const m = metrics.find((x) => x.id === metric)!;
  const sorted = runs.map((r) => ({ r, v: r.metrics[m.id] })).filter((x) => x.v !== undefined).sort((a, b) => (m.better === 'up' ? b.v! - a.v! : a.v! - b.v!));
  const rows = all ? sorted : sorted.slice(0, 12);
  const max = Math.max(...rows.map((x) => x.v ?? 0), m.unit === '%' ? 100 : 0) || 1;
  const best = rows.filter((x) => x.v !== undefined).sort((a, b) => (m.better === 'up' ? b.v! - a.v! : a.v! - b.v!))[0]?.r.id;
  return (
    <>
      <div className="bch__legend">
        {metrics.map((x) => (<button key={x.id} type="button" aria-pressed={x.id === metric} onClick={() => onMetric(x.id)}>{x.label}</button>))}
      </div>
      <ul className="bch__bars">
        {rows.map(({ r, v }) => (
          <li key={r.id} data-best={r.id === best || undefined}>
            <span className="bch__blabel">{r.label}{m.id === 'grounding' && r.caveat ? ' *' : ''}</span>
            <span className="bch__btrack">{v !== undefined && <span className="bch__bfill" style={{ width: `${(v / max) * 100}%`, background: color(r) }} />}</span>
            <span className="bch__bval">{v === undefined ? s.notMeasured : fmtV(v, m.unit)}</span>
          </li>
        ))}
      </ul>
      {sorted.length > 12 && <button type="button" className="bch__more" onClick={() => setAll((a) => !a)}>{all ? s.showTop : `${s.showAll} (${sorted.length})`}</button>}
    </>
  );
}

function TechChart({ techniques, s }: { techniques: BenchViewTech[]; s: BenchViewStrings }) {
  return (
    <div className="bch__tech">
      {techniques.map((t) => {
        const max = Math.max(...t.deltas.map((d) => Math.abs(d.value)), 10); // a floor of 10 keeps a +1% change from drawing as a full bar
        return (
          <section key={t.id}>
            <h4>{t.label}</h4>
            <ul className="bch__delta">
              {t.deltas.map((d) => {
                const good = d.value === 0 ? 'zero' : (d.value > 0) === (d.better === 'up') ? 'good' : 'bad';
                return (
                  <li key={d.metric} data-k={good}>
                    <span className="bch__blabel">{d.metric}</span>
                    <span className="bch__dtrack"><span className="bch__dfill" style={{ width: `${(Math.abs(d.value) / max) * 50}%`, [d.value < 0 ? 'right' : 'left']: '50%' }} /></span>
                    <span className="bch__bval">{d.value > 0 ? '+' : ''}{d.value}{d.unit === 'pts' ? ' pts' : d.unit}</span>
                  </li>
                );
              })}
            </ul>
            <p className="bch__verdict"><strong>{s.verdict}:</strong> {t.verdict}</p>
          </section>
        );
      })}
    </div>
  );
}

function AbChart({ ab, s }: { ab: BenchViewAb[]; s: BenchViewStrings }) {
  const max = Math.max(...ab.flatMap((a) => [Math.abs(a.lo), Math.abs(a.hi)]), 1);
  const pos = (v: number) => `${50 + (v / max) * 48}%`;
  return (
    <>
    <p className="bch__note">{s.abNote}</p>
    <ul className="bch__ab">
      {ab.map((a) => (
        <li key={`${a.candidate}-${a.metric}`} data-v={a.verdict}>
          <span className="bch__blabel">{a.candidate} <em>vs {a.baseline}</em><br /><small>{a.metric}</small></span>
          <span className="bch__citrack" aria-label={`${s.ci} ${a.lo} … ${a.hi}`}>
            <span className="bch__ci" style={{ left: pos(Math.min(a.lo, a.hi)), right: `calc(100% - ${pos(Math.max(a.lo, a.hi))})` }} />
            <span className="bch__cidot" style={{ left: pos(a.delta) }} />
          </span>
          <span className="bch__bval">{a.verdict}</span>
        </li>
      ))}
    </ul>
    </>
  );
}
