import { describe, expect, it } from 'vitest';
import { QUIZ_SIZE, tracks } from '@/data/quizzes';
import { ICONS } from '@/components/materials/icons';
import { logos } from '@/data/skillLogos';

describe('code quizzes', () => {
  it('three tracks, JavaScript, React and SQL, each with a registered logo and bilingual page copy', () => {
    expect(tracks.map((t) => t.id)).toEqual(['javascript', 'react', 'sql']);
    for (const t of tracks) {
      expect(logos[t.logo]).toBeTruthy();
      for (const f of [t.tagline, t.title, t.description, t.sources]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); expect(f.en).not.toBe(f.es); }
      for (const g of Object.values(t.groups)) expect(g.en && g.es).toBeTruthy();
    }
  });
  it('every card is bilingual, grouped, has its own icon, a syntax block and an example', () => {
    for (const t of tracks) {
      const ids = t.nodes.map((n) => n.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(t.nodes.map((n) => n.icon)).size).toBe(t.nodes.length); // one icon per card within a track
      for (const n of t.nodes) {
        for (const f of [n.title, n.short]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); }
        for (const f of [n.when, n.what, n.gotcha]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); expect(f.en).not.toBe(f.es); }
        expect(Object.keys(t.groups)).toContain(n.group);
        expect(ICONS[n.icon]).toBeTypeOf('object');
        expect(n.syntax.trim()).not.toBe('');
        expect(n.example.trim()).not.toBe('');
      }
    }
  });
  it('JavaScript and React have twelve cards; SQL has thirteen with three window-function cards', () => {
    const [js, react, sql] = tracks;
    expect(js.nodes).toHaveLength(12);
    expect(react.nodes).toHaveLength(12);
    expect(sql.nodes).toHaveLength(13);
    expect(sql.nodes.filter((n) => n.group === 'window').map((n) => n.id)).toEqual(['window-over', 'ranking-qualify', 'running-lag']);
    expect(js.nodes.map((n) => n.id)).toContain('event-loop');
    expect(react.nodes.map((n) => n.id)).toContain('nextjs');
  });
  it('question banks: four distinct bilingual options with the first one correct, every question on a card, every card practised, well over one draw', () => {
    for (const t of tracks) {
      expect(t.questions.length).toBeGreaterThanOrEqual(QUIZ_SIZE + 15);
      const ids = t.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      const cards = new Set(t.nodes.map((n) => n.id));
      for (const q of t.questions) {
        expect(cards.has(q.node)).toBe(true);
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options.map((o) => o.en)).size).toBe(4);
        expect(new Set(q.options.map((o) => o.es)).size).toBe(4);
        for (const f of [q.q, q.why, ...q.options]) { expect(f.en.trim()).not.toBe(''); expect(f.es.trim()).not.toBe(''); }
        expect(q.why.en).not.toBe(q.why.es);
        if (q.code !== undefined) expect(q.code.trim()).not.toBe('');
      }
      for (const n of t.nodes) expect(t.questions.filter((q) => q.node === n.id).length).toBeGreaterThanOrEqual(1);
    }
    expect(QUIZ_SIZE).toBe(20);
  });
});
