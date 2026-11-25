import { describe, expect, it } from 'vitest';
import { getProjects } from '@/lib/content/projects';

/** "Outcome" and "By the numbers" on project pages: measured results, before → after where the case study states both. */
describe('project outcomes and metrics', () => {
  const en = getProjects('en'), es = new Map(getProjects('es').map((p) => [p.slug, p]));
  it('Spanish mirrors English: same metrics, same before values, same number of outcomes', () => {
    for (const p of en) {
      const q = es.get(p.slug)!;
      expect(q.outcomes.length, p.slug).toBe(p.outcomes.length);
      expect((q.metrics ?? []).length, p.slug).toBe((p.metrics ?? []).length);
      (p.metrics ?? []).forEach((m, i) => expect(!!q.metrics![i].before, `${p.slug} metric ${i}`).toBe(!!m.before));
    }
  });
  it('metrics stay short enough for the two-column grid and carry no em dashes', () => {
    for (const p of [...en, ...es.values()]) for (const m of p.metrics ?? []) {
      expect(m.label.length, `${p.slug} ${m.label}`).toBeLessThanOrEqual(44);
      expect(m.value.length, `${p.slug} ${m.value}`).toBeLessThanOrEqual(14);
      if (m.before) expect(m.before.length, `${p.slug} ${m.before}`).toBeLessThanOrEqual(14);
      for (const s of [m.label, m.value, m.before ?? '', ...p.outcomes]) expect(s, p.slug).not.toMatch(/—/);
    }
  });
});
