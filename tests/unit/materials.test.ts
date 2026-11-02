import { describe, expect, it } from 'vitest';
import { materials } from '@/data/materials';
import { ICONS } from '@/components/materials/icons';

describe('materials', () => {
  it('every technique is bilingual, uniquely identified, grouped and typed', () => {
    expect(materials.length).toBeGreaterThan(0);
    for (const m of materials) {
      for (const field of [m.tagline, m.title, m.description, m.impactLabel, m.sources]) expect(field.en && field.es).toBeTruthy();
      const ids = m.techniques.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const t of m.techniques) {
        for (const field of [t.title, t.short, t.when, t.action, t.why]) { expect(field.en.trim()).not.toBe(''); expect(field.es.trim()).not.toBe(''); }
        expect(Object.keys(m.groups)).toContain(t.group);
        expect(t.example?.en.trim() && t.example?.es.trim()).toBeTruthy(); // every technique shows a concrete case
        if (t.impact) { expect(['official', 'estimate', 'study']).toContain(t.impact.kind); expect(t.impact.label.en && t.impact.label.es).toBeTruthy(); }
        if (t.icon) expect(ICONS[t.icon]).toBeTypeOf('object');
      }
    }
  });
  it('Claude has twelve techniques, seven for Claude Code and five for the API', () => {
    const c = materials.find((m) => m.id === 'claude')!;
    expect(c.techniques).toHaveLength(12);
    expect(c.techniques.filter((t) => t.group === 'code')).toHaveLength(7);
    expect(c.techniques.filter((t) => t.group === 'api')).toHaveLength(5);
  });
  it('AEO has ten techniques and GEO eleven across the three GEO layers, every card with an icon', () => {
    const aeo = materials.find((m) => m.id === 'aeo')!, geo = materials.find((m) => m.id === 'geo')!;
    expect(aeo.techniques).toHaveLength(10);
    expect(geo.techniques).toHaveLength(11);
    expect(Object.keys(geo.groups)).toEqual(['foundation', 'amplification', 'measurement']);
    for (const t of [...aeo.techniques, ...geo.techniques]) expect(t.icon).toBeTruthy();
    expect(new Set([...aeo.techniques, ...geo.techniques].map((t) => t.icon)).size).toBe(21); // every card has its own icon
    expect(aeo.techniques.filter((t) => t.impact?.kind === 'study')).toHaveLength(3);
    expect(materials.map((m) => m.id)).toEqual(['claude', 'aeo', 'geo']);
  });
});
