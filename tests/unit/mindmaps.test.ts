import { describe, expect, it } from 'vitest';
import { mindmaps, mindmapGroups, ungroupedMaps, groupOf, NODE_KINDS } from '@/data/mindmaps';
import { ICONS } from '@/components/materials/icons';
import { logos } from '@/data/skillLogos';
import { childrenOf, layoutTree, NODE_H, NODE_W, ROOT_W } from '@/lib/mindmap/layout';

describe('mind maps', () => {
  it('sections: every map sits in exactly one section, in study order, with an icon and both languages', () => {
    expect(mindmapGroups.map((g) => g.id)).toEqual(['foundations', 'serving', 'ops', 'data']);
    expect(mindmapGroups.map((g) => g.maps)).toEqual([['llms', 'gpu'], ['serving'], ['llmops', 'gateway'], ['snowflake', 'databricks']]);
    expect(ungroupedMaps).toEqual([]);
    const ids = mindmapGroups.flatMap((g) => g.maps);
    expect(new Set(ids).size).toBe(ids.length);
    expect(mindmaps.map((m) => m.id)).toEqual(ids); // tiles and the switcher follow the sections
    for (const g of mindmapGroups) {
      expect(ICONS[g.icon]).toBeTypeOf('object');
      for (const f of [g.title, g.intro]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); }
      for (const id of g.maps) expect(groupOf(id)).toBe(g);
    }
  });

  it('every concept is bilingual, uniquely identified, hangs off an existing parent and is typed', () => {
    expect(mindmaps.length).toBeGreaterThan(0);
    for (const m of mindmaps) {
      for (const f of [m.tagline, m.title, m.description, m.sources]) expect(f.en && f.es).toBeTruthy();
      const ids = m.nodes.map((n) => n.id);
      expect(new Set(ids).size).toBe(ids.length);
      const set = new Set(ids);
      for (const n of m.nodes) {
        if (n.parent) expect(set.has(n.parent)).toBe(true);
        for (const f of [n.title, n.short, n.what]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); }
        expect(n.useCase?.en.trim() && n.useCase?.es.trim()).toBeTruthy(); // every concept says when it is used
        if (n.ai) expect(n.ai.en && n.ai.es).toBeTruthy();
        expect(NODE_KINDS).toContain(n.kind);
        expect(n.icon || n.logo).toBeTruthy(); // every card has a mark
        if (n.icon) expect(ICONS[n.icon]).toBeTypeOf('object');
        if (n.logo) expect(logos[n.logo]).toBeDefined();
        for (const f of n.facts ?? []) expect(f.text.en && f.text.es && f.at).toBeTruthy();
        for (const c of n.commands ?? []) expect(c.trim()).not.toBe('');
        const seen = new Set<string>(); // no cycles
        for (let cur = n; cur.parent; cur = m.nodes.find((x) => x.id === cur.parent)!) { expect(seen.has(cur.id)).toBe(false); seen.add(cur.id); }
      }
      for (const id of m.openAtStart) expect(set.has(id)).toBe(true);
    }
  });

  it('Snowflake: eight branches, 73 concepts, the Cortex branch open at start with twelve AI concepts', () => {
    const s = mindmaps.find((m) => m.id === 'snowflake')!;
    expect(s.nodes).toHaveLength(73);
    expect(s.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['arch', 'core', 'feat', 'tool', 'de', 'ai', 'ml', 'app']);
    const ai = s.nodes.filter((n) => n.parent === 'ai');
    expect(ai).toHaveLength(12);
    for (const n of ai) { expect(n.kind).toBe('ai'); expect(n.ai).toBeTruthy(); }
    expect(s.openAtStart).toEqual(['ai']);
    expect(s.nodes.filter((n) => n.parent === 'core-warehouse')).toHaveLength(3);
    expect(s.nodes.filter((n) => n.parent === 'de-ingest')).toHaveLength(4);
    expect(s.nodes.filter((n) => n.logo).length).toBeGreaterThanOrEqual(10); // the brand marks the course names
  });

  it('Databricks: eight branches, 88 concepts, the platform branch open at start, every figure tied to a lesson', () => {
    const d = mindmaps.find((m) => m.id === 'databricks')!;
    expect(d.nodes).toHaveLength(88);
    expect(d.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['de', 'spark', 'plat', 'ws', 'arch', 'cluster', 'nb', 'dbfs']);
    expect(d.openAtStart).toEqual(['plat']);
    expect(d.nodes.filter((n) => n.parent === 'plat')).toHaveLength(10);
    expect(d.nodes.filter((n) => n.parent === 'plat-roadmap')).toHaveLength(5); // Autoloader, DLT, Workflows, Repos, capstone
    expect(d.nodes.filter((n) => n.parent === 'nb-magic')).toHaveLength(5);
    expect(d.nodes.filter((n) => n.parent === 'nb-dbutils')).toHaveLength(4);
    expect(d.nodes.filter((n) => n.parent === 'dbfs-mount')).toHaveLength(5); // the five mount steps
    expect(d.nodes.filter((n) => n.kind === 'ml').map((n) => n.id)).toEqual(['spark-ml', 'ws-ml']); // the course only names ML
    expect(d.nodes.filter((n) => n.commands).length).toBeGreaterThanOrEqual(12);
    for (const n of d.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/); // every figure names the lesson it comes from
    expect(d.nodes.filter((n) => n.logo).map((n) => n.logo)).toEqual(['databricks', 'azure', 'github', 'azure', 'azure']);
  });

  it('LLMs: eight branches, 94 concepts, the VRAM branch open at start, every figure tied to its source', () => {
    const l = mindmaps.find((m) => m.id === 'llms')!;
    expect(l.nodes).toHaveLength(94);
    expect(l.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['access', 'arch', 'frontier', 'open', 'vram', 'lic', 'trade', 'safe']);
    expect(l.openAtStart).toEqual(['vram']);
    expect(l.nodes.filter((n) => n.parent === 'vram')).toHaveLength(8);
    expect(l.nodes.filter((n) => n.parent === 'vram-tiers')).toHaveLength(7);
    expect(l.nodes.filter((n) => n.parent === 'open')).toHaveLength(10);
    for (const n of l.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/);
  });

  it('AI gateways: nine branches, 84 concepts, the scenarios open at start, the gateway chooser folded under them', () => {
    const g = mindmaps.find((m) => m.id === 'gateway')!;
    expect(g.nodes).toHaveLength(84);
    expect(g.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['why', 'core', 'oss', 'aws', 'azure', 'gcp', 'saas', 'arch', 'scen']);
    expect(g.openAtStart).toEqual(['scen']);
    expect(g.nodes.filter((n) => n.parent === 'scen')).toHaveLength(9);
    expect(g.nodes.filter((n) => n.parent === 'scen-pick')).toHaveLength(7);
    for (const n of g.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/);
  });

  it('GPU map: eleven branches, 85 concepts, the ladder open at start, four figures and the architecture table backed by files', async () => {
    const g = mindmaps.find((m) => m.id === 'gpu')!;
    expect(g.nodes).toHaveLength(85);
    expect(g.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['cpugpu', 'attn', 'kv', 'mem', 'pcie', 'nvlink', 'net', 'nccl', 'arch', 'k8s', 'ladder']);
    expect(g.openAtStart).toEqual(['ladder']);
    expect(g.nodes.filter((n) => n.parent === 'ladder')).toHaveLength(6);
    expect(g.nodes.filter((n) => n.parent === 'arch')).toHaveLength(7);
    for (const n of g.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/);
    const fs = await import('node:fs');
    const figs = (g.sections ?? []).flatMap((x) => (x.figure ? [x.figure.src] : []));
    expect(figs).toHaveLength(4);
    for (const f of figs) for (const l of ['en', 'es']) expect(fs.existsSync(`content/diagrams/${f}.${l}.svg`), `${f}.${l}.svg`).toBe(true);
    for (const x of g.sections ?? []) if (x.table) {
      for (const l of ['en', 'es'] as const) for (const r of x.table.rows) expect(r[l]).toHaveLength(x.table.head[l].length);
      expect(x.table.rows.length).toBeGreaterThan(0);
    }
    expect(g.sections?.find((x) => x.id === 'sec-arch')?.table?.rows).toHaveLength(6);
  });

  /** Places every card of a map under several fold states and checks that no two visible cards overlap and none sits over the root. */
  function expectCleanLayout(id: string, total: number, branches: number, keepOpen: string) {
    const s = mindmaps.find((m) => m.id === id)!;
    const parents = new Set(s.nodes.flatMap((n) => (n.parent ? [n.parent] : [])));
    expect(childrenOf(s.nodes).get(undefined)).toHaveLength(branches);
    for (const folded of [new Set<string>(), new Set([keepOpen, s.nodes.find((n) => !n.parent)!.id]), new Set([...parents].filter((p) => p !== keepOpen))]) {
      const placed = layoutTree(s.nodes, folded);
      expect(placed).toHaveLength(total); // hidden cards are still placed, just flagged
      const visible = placed.filter((p) => !p.hidden);
      for (const p of visible) {
        expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
        expect(Math.abs(p.x + NODE_W / 2)).toBeGreaterThan(ROOT_W / 2 + NODE_W / 2); // never over the root
      }
      for (let i = 0; i < visible.length; i++) for (let j = i + 1; j < visible.length; j++) {
        const a = visible[i], b = visible[j];
        expect(Math.abs(a.x - b.x) < NODE_W && Math.abs(a.y - b.y) < NODE_H, `${id}: ${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
    return layoutTree(s.nodes, new Set([...parents].filter((p) => p !== keepOpen))).filter((p) => !p.hidden);
  }

  it('the layout never overlaps two visible cards and keeps the root clear, folded or not', () => {
    const snow = expectCleanLayout('snowflake', 73, 8, 'ai');
    expect(snow).toHaveLength(8 + 12);
    expect(snow.filter((p) => p.side === 'right').map((p) => p.id).filter((id) => !id.includes('-'))).toEqual(['arch', 'feat', 'de', 'ml']);
    const dbx = expectCleanLayout('databricks', 88, 8, 'plat');
    expect(dbx).toHaveLength(8 + 10); // the platform branch and its ten direct children; the toolset keeps its five folded
    expect(dbx.filter((p) => p.side === 'right').map((p) => p.id).filter((id) => !id.includes('-'))).toEqual(['de', 'plat', 'arch', 'nb']);
    expect(expectCleanLayout('llms', 94, 8, 'vram')).toHaveLength(8 + 8); // the VRAM branch and its eight children; quantisation and GPU tiers stay folded
    expect(expectCleanLayout('gpu', 85, 11, 'ladder')).toHaveLength(11 + 6); // the ladder branch and its six children
    expect(expectCleanLayout('gateway', 84, 9, 'scen')).toHaveLength(9 + 9); // the scenarios branch and its nine children; the chooser keeps its seven folded
  });
  it('LLM serving: nine branches, 88 concepts, the exam branch open at start, EAGLE-3 explained in five steps', () => {
    const v = mindmaps.find((m) => m.id === 'serving')!;
    expect(v.nodes).toHaveLength(88);
    expect(v.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['eng', 'batch', 'kv', 'quant', 'spec', 'par', 'pd', 'metric', 'exam']);
    expect(v.openAtStart).toEqual(['exam']);
    expect(v.nodes.filter((n) => n.parent === 'exam')).toHaveLength(10);
    expect(v.nodes.filter((n) => n.parent === 'sp-eagle').map((n) => n.id)).toEqual(['e3-reuse', 'e3-head', 'e3-verify', 'e3-steps', 'e3-myth']);
    expect(v.sections?.map((s) => s.id)).toEqual(['sec-engines', 'sec-spec']);
    for (const n of v.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/);
  });

  it('LLMOps: nine branches, 84 concepts, the exam branch open at start, release and evaluation tables', () => {
    const o = mindmaps.find((m) => m.id === 'llmops')!;
    expect(o.nodes).toHaveLength(84);
    expect(o.nodes.filter((n) => !n.parent).map((b) => b.id)).toEqual(['life', 'prompt', 'eval', 'obs', 'guard', 'deploy', 'cost', 'rag', 'exam']);
    expect(o.openAtStart).toEqual(['exam']);
    expect(o.nodes.filter((n) => n.parent === 'exam')).toHaveLength(9);
    expect(o.sections?.map((s) => s.id)).toEqual(['sec-release', 'sec-eval']);
    for (const s of o.sections ?? []) for (const r of s.table!.rows) expect(r.en.length).toBe(r.es.length);
    for (const n of o.nodes) for (const f of n.facts ?? []) expect(f.at).toMatch(/^[A-Z]/);
  });
});
