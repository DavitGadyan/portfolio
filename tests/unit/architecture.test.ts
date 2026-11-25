import { describe, expect, it } from 'vitest';
import { getProjects } from '@/lib/content/projects';
import { autoSpec, layoutArch, NW, VNW, type ArchLayout } from '@/lib/content/architecture';
import { flowSpec, flows } from '@/data/architecture';

const NH = 60;
function overlaps(l: ArchLayout, o: 'h' | 'v') {
  const w = o === 'h' ? NW : VNW;
  const bad: string[] = [];
  for (let i = 0; i < l.nodes.length; i++) for (let j = i + 1; j < l.nodes.length; j++) {
    const a = l.nodes[i][o], b = l.nodes[j][o];
    if (a.x < b.x + w && b.x < a.x + w && a.y < b.y + NH && b.y < a.y + NH) bad.push(`${l.nodes[i].id}/${l.nodes[j].id}`);
  }
  return bad;
}

describe('architecture diagrams', () => {
  for (const locale of ['en', 'es'] as const) {
    it(`every ${locale} project gets a diagram whose cards never overlap and stay inside the stage`, () => {
      const projects = getProjects(locale);
      expect(projects.length).toBeGreaterThanOrEqual(50);
      for (const p of projects) {
        const spec = flowSpec(p.slug, locale) ?? autoSpec(p.stack, 'Users');
        const l = layoutArch(spec);
        const ids = new Set(l.nodes.map((n) => n.id));
        expect(ids.size, p.slug).toBe(l.nodes.length);
        for (const e of spec.edges) { expect(ids.has(e.from), `${p.slug} ${e.from}`).toBe(true); expect(ids.has(e.to), `${p.slug} ${e.to}`).toBe(true); }
        expect(overlaps(l, 'h'), p.slug).toEqual([]);
        expect(overlaps(l, 'v'), p.slug).toEqual([]);
        for (const n of l.nodes) {
          expect(n.h.x >= 0 && n.h.x + NW <= l.hw && n.h.y >= 0 && n.h.y + NH <= l.hh, `${p.slug} ${n.id} h`).toBe(true);
          expect(n.v.x >= 0 && n.v.x + VNW <= l.vw && n.v.y >= 0 && n.v.y + NH <= l.vh, `${p.slug} ${n.id} v`).toBe(true);
        }
        expect(l.vw).toBeLessThanOrEqual(340); // fits a 360 px phone with the card padding
        for (const n of l.nodes) expect(n.label.length, `${p.slug} ${n.id}`).toBeGreaterThan(0);
      }
    });
  }

  it('hand-written flows are complete in both languages and only link existing nodes', () => {
    for (const [slug, f] of Object.entries(flows)) {
      for (const n of f.nodes) {
        expect(n.label.en && n.label.es, `${slug} ${n.id}`).toBeTruthy();
        expect(n.label.en.length, `${slug} ${n.id}`).toBeLessThanOrEqual(30);
        expect(n.notes.en.length, `${slug} ${n.id}`).toBe(n.notes.es.length);
        expect(n.notes.en.join(' ')).not.toMatch(/—/);
      }
      for (const e of f.edges) if (e.label) expect(e.label.en && e.label.es, slug).toBeTruthy();
    }
  });

  it('an auto diagram follows the stack: users, front end, back end, then AI and data, lanes for infra and security', () => {
    const spec = autoSpec({ frontend: ['Next.js UI'], backend: ['FastAPI API, workers', 'Celery'], ai: ['vLLM'], data: ['Postgres'], infra: ['Docker'], security: ['OAuth'] }, 'Users');
    const col = (id: string) => spec.nodes.find((n) => n.id === id)!.col;
    expect([col('user'), col('frontend-0'), col('backend-0'), col('ai-0'), col('data-0')]).toEqual([0, 1, 2, 3, 3]);
    expect(col('infra-0')).toBeUndefined();
    expect(spec.nodes.find((n) => n.id === 'backend-0')!.notes).toEqual(['workers']);
    expect(spec.edges).toContainEqual({ from: 'backend-0', to: 'ai-0' });
  });
});
