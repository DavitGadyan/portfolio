import { describe, expect, it } from 'vitest';
import { materials } from '@/data/materials';

describe('materials', () => {
  it('every technique is bilingual, uniquely identified and typed', () => {
    expect(materials.length).toBeGreaterThan(0);
    for (const m of materials) {
      expect(m.tagline.en && m.tagline.es).toBeTruthy();
      const ids = m.techniques.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const t of m.techniques) {
        for (const field of [t.title, t.short, t.when, t.action, t.why]) { expect(field.en.trim()).not.toBe(''); expect(field.es.trim()).not.toBe(''); }
        expect(['code', 'api']).toContain(t.group);
        if (t.saving) { expect(['official', 'estimate']).toContain(t.saving.kind); expect(t.saving.label.en && t.saving.label.es).toBeTruthy(); }
      }
    }
  });
  it('Claude has twelve techniques, seven for Claude Code and five for the API', () => {
    const c = materials.find((m) => m.id === 'claude')!;
    expect(c.techniques).toHaveLength(12);
    expect(c.techniques.filter((t) => t.group === 'code')).toHaveLength(7);
    expect(c.techniques.filter((t) => t.group === 'api')).toHaveLength(5);
  });
});
