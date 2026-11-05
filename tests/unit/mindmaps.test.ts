import { describe, expect, it } from 'vitest';
import { mindmaps, NODE_KINDS } from '@/data/mindmaps';
import { ICONS } from '@/components/materials/icons';
import { logos } from '@/data/skillLogos';
import { childrenOf, layoutTree, NODE_H, NODE_W, ROOT_W } from '@/lib/mindmap/layout';

describe('mind maps', () => {
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

  it('the layout never overlaps two visible cards and keeps the root clear, folded or not', () => {
    const s = mindmaps.find((m) => m.id === 'snowflake')!;
    const parents = new Set(s.nodes.flatMap((n) => (n.parent ? [n.parent] : [])));
    expect(childrenOf(s.nodes).get(undefined)).toHaveLength(8);
    for (const folded of [new Set<string>(), new Set(['ai', 'core']), new Set([...parents].filter((id) => id !== 'ai'))]) {
      const placed = layoutTree(s.nodes, folded);
      expect(placed).toHaveLength(73); // hidden cards are still placed, just flagged
      const visible = placed.filter((p) => !p.hidden);
      for (const p of visible) {
        expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
        expect(Math.abs(p.x + NODE_W / 2)).toBeGreaterThan(ROOT_W / 2 + NODE_W / 2); // never over the root
      }
      for (let i = 0; i < visible.length; i++) for (let j = i + 1; j < visible.length; j++) {
        const a = visible[i], b = visible[j];
        expect(Math.abs(a.x - b.x) < NODE_W && Math.abs(a.y - b.y) < NODE_H, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
    const open = layoutTree(s.nodes, new Set([...parents].filter((id) => id !== 'ai'))).filter((p) => !p.hidden);
    expect(open).toHaveLength(8 + 12);
    expect(open.filter((p) => p.side === 'right').map((p) => p.id).filter((id) => !id.includes('-'))).toEqual(['arch', 'feat', 'de', 'ml']);
  });
});
