import { describe, expect, it } from 'vitest';
import { materials } from '@/data/materials';
import { ICONS } from '@/components/materials/icons';
import { citationRates } from '@/data/materials/citation-rates';
import { visibilityTools } from '@/data/materials/visibility-tools';
import { seoVsAi } from '@/data/materials/seo-vs-ai';

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
    expect(materials.map((m) => m.id)).toEqual(['claude', 'aeo', 'geo', 'kpis', 'seo']);
  });
  it('the citation-rate table sits under AEO and GEO, sorted from the table (4.2×) down to the prose baseline (1.0×)', () => {
    expect(materials.filter((m) => m.tables?.some((t) => t.id === citationRates.id)).map((m) => m.id)).toEqual(['aeo', 'geo']);
    const rates = citationRates.rows.map((r) => r.bar!);
    expect(rates).toEqual([...rates].sort((a, b) => b - a));
    expect(rates[0]).toBe(4.2);
    expect(rates.at(-1)).toBe(1);
    expect(citationRates.rows.at(-1)!.muted).toBe(true);
  });
  it('every table is bilingual and rectangular', () => {
    for (const t of materials.flatMap((m) => m.tables ?? [])) {
      for (const f of [t.heading, t.intro, t.caption, ...t.columns]) expect(f.en && f.es).toBeTruthy();
      for (const r of t.rows) { expect(r.cells).toHaveLength(t.columns.length); for (const c of r.cells) expect(c.en && c.es).toBeTruthy(); }
    }
  });
  it('KPIs has twelve techniques in four groups and the twelve-tool table', () => {
    const k = materials.find((m) => m.id === 'kpis')!;
    expect(k.techniques).toHaveLength(12);
    expect(Object.keys(k.groups)).toEqual(['metrics', 'setup', 'revenue', 'diagnose']);
    expect(k.techniques.filter((t) => t.group === 'metrics')).toHaveLength(6);
    for (const t of k.techniques) expect(t.icon && t.example).toBeTruthy();
    expect(k.tables).toEqual([visibilityTools]);
    expect(visibilityTools.rows).toHaveLength(12);
    expect(visibilityTools.columns).toHaveLength(4);
    expect(visibilityTools.rows.some((r) => r.bar !== undefined)).toBe(false);
  });
  it('SEO has twelve techniques in four groups, no figures, and the SEO vs AI search table', () => {
    const s = materials.find((m) => m.id === 'seo')!;
    expect(s.techniques).toHaveLength(12);
    expect(Object.keys(s.groups)).toEqual(['structure', 'onpage', 'architecture', 'technical']);
    for (const t of s.techniques) { expect(t.icon && t.example).toBeTruthy(); expect(t.impact).toBeUndefined(); }
    expect(s.tables).toEqual([seoVsAi]);
    expect(seoVsAi.rows).toHaveLength(4);
    expect(seoVsAi.columns).toHaveLength(3);
  });
});
