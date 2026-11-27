import { describe, expect, it } from 'vitest';
import { pipelinesByMap } from '@/data/mindmaps/pipelines';
import { NH, NW, pipeLayout } from '@/components/materials/PipelineLab';

/** Step-through training pipelines under a mind map: consistent references, bilingual text, and connectors that never cross a card. */
const all = Object.values(pipelinesByMap).flat();

/** Points along an SVG path made of an M plus L segments (a polyline) or one C segment (what route() emits). */
function sample(d: string): { x: number; y: number }[] {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  if (d.includes('L')) {
    const out: { x: number; y: number }[] = [];
    for (let k = 2; k < n.length; k += 2) for (let i = 0; i <= 20; i++) out.push({ x: n[k - 2] + (n[k] - n[k - 2]) * i / 20, y: n[k - 1] + (n[k + 1] - n[k - 1]) * i / 20 });
    return out;
  }
  const [x0, y0, x1, y1, x2, y2, x3, y3] = n;
  return Array.from({ length: 41 }, (_, i) => {
    const t = i / 40, u = 1 - t;
    return { x: u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3, y: u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3 };
  });
}

describe('training pipelines', () => {
  it('exist for the post-training map', () => expect(pipelinesByMap.posttrain.map((p) => p.id)).toEqual(['sft', 'rm', 'rlhf', 'rlvr', 'grpo']));
  for (const p of all) {
    it(`${p.id}: references, bilingual text, one card per cell`, () => {
      const ids = new Set(p.nodes.map((n) => n.id));
      expect(ids.size).toBe(p.nodes.length);
      expect(new Set(p.nodes.map((n) => `${n.col},${n.row}`)).size).toBe(p.nodes.length);
      for (const e of p.edges) { expect(ids.has(e.from), e.from).toBe(true); expect(ids.has(e.to), e.to).toBe(true); }
      for (const s of p.steps) {
        expect(s.nodes.length).toBeGreaterThan(0);
        for (const id of s.nodes) expect(ids.has(id), id).toBe(true);
        expect(s.title.en.trim()).not.toBe(''); expect(s.title.es.trim()).not.toBe('');
        expect(s.calc.length).toBeGreaterThan(0);
      }
      for (const n of p.nodes) for (const f of [n.label, n.note]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); }
    });
    it(`${p.id}: no connector passes through a card`, () => {
      const { pos, paths } = pipeLayout(p.nodes, p.edges);
      for (const [k, e] of p.edges.entries()) {
        const pts = sample(paths[k].d);
        for (const n of p.nodes) {
          if (n.id === e.from || n.id === e.to) continue;
          const b = pos.get(n.id)!;
          const hit = pts.some((q) => q.x > b.x + 2 && q.x < b.x + NW - 2 && q.y > b.y + 2 && q.y < b.y + NH - 2);
          expect(hit, `${e.from} → ${e.to} crosses ${n.id}`).toBe(false);
        }
      }
    });
  }
});
