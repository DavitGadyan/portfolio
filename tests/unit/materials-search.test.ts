import { describe, expect, it } from 'vitest';
import { buildSearchIndex } from '@/lib/materials-search';
import { materials } from '@/data/materials';
import { tracks } from '@/data/quizzes';
import { videos } from '@/data/videos';
import { mindmaps } from '@/data/mindmaps';

describe('materials search index', () => {
  it('lists every card, pattern, video and concept once, in both languages, each with a deep link to its page', () => {
    const expected = materials.reduce((s, m) => s + m.techniques.length, 0) + tracks.reduce((s, t) => s + t.nodes.length, 0) + videos.length + mindmaps.reduce((s, x) => s + x.nodes.length, 0);
    for (const locale of ['en', 'es'] as const) {
      const idx = buildSearchIndex(locale);
      expect(idx).toHaveLength(expected);
      expect(new Set(idx.map((e) => e.id)).size).toBe(idx.length);
      for (const e of idx) {
        expect(e.title.trim()).not.toBe('');
        expect(e.text.trim()).not.toBe('');
        expect(e.text.length).toBeLessThanOrEqual(220);
        expect(e.href.startsWith(locale === 'es' ? '/es/materials/' : '/materials/')).toBe(true);
        if (e.kind !== 'video') expect(e.href).toMatch(/#c-[a-z0-9-]+$/);
      }
      expect(idx.filter((e) => e.kind === 'video')).toHaveLength(5);
      expect(idx.filter((e) => e.kind === 'mindmap')).toHaveLength(73 + 88 + 94); // Snowflake + Databricks + LLM concepts
    }
    const en = buildSearchIndex('en');
    expect(en.find((e) => e.id === 'snowflake:feat-time-travel')?.href).toBe('/materials/mindmaps/snowflake/#c-feat-time-travel');
    expect(en.find((e) => e.id === 'databricks:plat-photon')?.href).toBe('/materials/mindmaps/databricks/#c-plat-photon');
    expect(en.find((e) => e.id === 'databricks:nb-dbutils-notebook')?.title).toBe('dbutils.notebook'); // the text is clipped to 220 chars, so the title carries the search hit
    expect(en.find((e) => e.id === 'claude:compact')?.title).toBe('/compact at checkpoints');
    expect(buildSearchIndex('es').find((e) => e.id === 'snowflake:feat-time-travel')?.href).toBe('/es/materials/mindmaps/snowflake/#c-feat-time-travel');
  });
});
