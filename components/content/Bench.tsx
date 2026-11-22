import { benchData } from '@/data/projects/auditproBench';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { BenchView, type BenchViewData, type BenchViewMetric } from './BenchView';

/**
 * `<Bench id="auditpro" caption="…" />` in a project's MDX: interactive charts of a measured model benchmark (BenchView.tsx, client)
 * plus the same numbers as plain tables for readers without JavaScript (`.bch` / `.bch-nojs` in globals.css).
 */
export function Bench({ id, caption, locale }: { id: string; caption?: string; locale: Locale }) {
  const d = benchData[id];
  if (!d) throw new Error(`[content] benchmark not found: ${id} (data/projects/auditproBench.ts)`);
  const b = getMessages(locale).bench;
  const metrics: BenchViewMetric[] = [
    { id: 'quality', label: b.mQuality, unit: '', better: 'up' },
    { id: 'recall', label: b.mRecall, unit: '%', better: 'up' },
    { id: 'precision', label: b.mPrecision, unit: '%', better: 'up' },
    { id: 'numeric', label: b.mNumeric, unit: '%', better: 'up' },
    { id: 'page', label: b.mPage, unit: '%', better: 'up' },
    { id: 'grounding', label: b.mGrounding, unit: '%', better: 'up' },
    { id: 'auditS', label: b.mTime, unit: 's', better: 'down' },
    { id: 'cost', label: b.mCost, unit: '$', better: 'down' },
  ];
  const picks: Record<string, string> = { quality: b.pickQuality, balanced: b.pickBalanced, recall: b.pickRecall, throughput: b.pickThroughput, cost: b.pickCost, numeric: b.pickNumeric };
  /** load-chart lines: the picks and a few contrasting sizes; the first five are drawn until a reader toggles the rest */
  const CURVE_ORDER = ['qwen3-14b-awq-ctx8k', 'qwen3-14b-awq-draft', 'phi-4-fp8', 'qwen2.5-7b-bf16-noprefix', 'qwen2.5-7b-awq', 'qwen3-8b-awq', 'llama3.1-8b-awq', 'deepseek-r1-distill-14b-awq', 'qwen2.5-7b-fp8'];
  const view: BenchViewData = {
    id,
    metrics,
    runs: d.runs.map((r) => ({
      id: r.id,
      label: r.label,
      quant: r.quant,
      pick: r.pick,
      pickLabel: r.pick ? picks[r.pick] : undefined,
      caveat: r.groundingCaveat,
      tok: r.tok,
      weights: r.weights,
      loadS: r.loadS,
      docs: r.docs ?? 15,
      metrics: { quality: r.quality, recall: r.recall, precision: r.precision, numeric: r.numeric, page: r.page, grounding: r.grounding, auditS: r.auditS, cost: r.cost },
    })),
    curves: CURVE_ORDER.filter((cid) => d.curves?.[cid]).map((cid, i) => {
      const r = d.runs.find((x) => x.id === cid);
      return { id: cid, label: r?.label ?? cid, pick: r?.pick, on: i < 5, pts: d.curves![cid] };
    }),
    techniques: d.techniques.map((t) => ({ id: t.id, base: t.base, cand: t.cand || undefined, label: t.label[locale], verdict: t.verdict[locale], deltas: t.deltas.map((x) => ({ metric: x.metric[locale], value: x.value, unit: x.unit, better: x.better })) })),
    ab: d.ab.map((a) => ({ candidate: a.candidate, baseline: a.baseline, verdict: a.verdict, metric: a.metric[locale], delta: a.delta, lo: a.lo, hi: a.hi, unit: a.unit, p: a.p, n: a.n, reps: a.reps, prec: a.prec })),
    s: {
      tabs: { cost: b.tabCost, speed: b.tabSpeed, metric: b.tabMetric, tech: b.tabTech, ab: b.tabAb },
      costX: b.costX, costY: b.costY, speedX: b.speedX, hint: b.hint,
      load: { tok: b.lTok, user: b.lUser, ttft: b.lTtft, ttft95: b.lTtft95, itl: b.lItl, e2e: b.lE2e },
      loadNote: b.loadNote, users: b.users, weights: b.weights, coldStart: b.coldStart, docs: b.docs, tokAt: b.tokAt, precision: b.mPrecision, paired: b.paired, reps: b.reps, holm: b.holm, better: b.better, notMeasured: b.notMeasured, verdict: b.verdict, ci: b.ci, caveat: b.caveat, showAll: b.showAll, showTop: b.showTop, abNote: b.abNote,
    },
  };
  const cell = (v: number | undefined, unit: string) => (v === undefined ? '–' : unit === '$' ? `$${v.toFixed(2)}` : unit === '%' ? `${v.toFixed(1)}%` : unit === 's' ? `${Math.round(v)} s` : v.toFixed(1));
  return (
    <figure className="fig fig--bench">
      <BenchView data={view} />
      <div className="bch-nojs">
        <div className="tblwrap">
          <table>
            <thead><tr><th scope="col">{b.run}</th>{metrics.map((m) => <th key={m.id} scope="col">{m.label}</th>)}<th scope="col">{b.lTok} (4)</th></tr></thead>
            <tbody>
              {view.runs.map((r) => (
                <tr key={r.id}><th scope="row">{r.label}{r.pickLabel ? ` (${r.pickLabel})` : ''}</th>{metrics.map((m) => <td key={m.id}>{cell(r.metrics[m.id], m.unit)}</td>)}<td>{r.tok[4] ?? '–'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
