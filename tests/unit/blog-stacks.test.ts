import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { stackDiagrams } from '@/data/blog/azure-stacks';
import { logos } from '@/data/skillLogos';

const SLUG = 'azure-fabric-databricks-foundry-which-to-choose';

describe('blog stack diagrams (data/blog/azure-stacks.ts)', () => {
  it('two diagrams, every string in both languages, every layer with items, every brand mark on disk', () => {
    expect(Object.keys(stackDiagrams)).toEqual(['clouds', 'stacks']);
    for (const d of Object.values(stackDiagrams)) {
      expect(d.title.en.trim()).not.toBe('');
      expect(d.title.es.trim()).not.toBe('');
      expect(new Set(d.variants.map((v) => v.id)).size).toBe(d.variants.length);
      for (const v of d.variants) {
        for (const s of [v.summary, v.useCase]) { expect(s.en.trim()).not.toBe(''); expect(s.es.trim()).not.toBe(''); expect(s.en).not.toBe(s.es); }
        expect(v.layers.length).toBeGreaterThanOrEqual(4);
        expect(new Set(v.layers.map((l) => l.id)).size).toBe(v.layers.length);
        if (v.logo) expect(existsSync(join('public/logos', logos[v.logo][0]))).toBe(true);
        for (const l of v.layers) {
          expect(l.items.length).toBeGreaterThanOrEqual(1);
          expect(l.note.en.trim()).not.toBe(''); expect(l.note.es.trim()).not.toBe('');
          for (const it of l.items) {
            expect(it.name.trim()).not.toBe('');
            expect(Boolean(it.logo) || Boolean(it.icon)).toBe(true);
            if (it.logo) expect(existsSync(join('public/logos', logos[it.logo][0]))).toBe(true);
          }
        }
      }
    }
    // the clouds diagram: Azure, AWS and Google Cloud with the same four layers in the same order
    const clouds = stackDiagrams.clouds.variants;
    expect(clouds.map((v) => v.id)).toEqual(['azure', 'aws', 'gcp']);
    for (const v of clouds) expect(v.layers.map((l) => l.id)).toEqual(['apps', 'data', 'storage', 'infra']);
    expect(clouds[0].layers[0].items[0].name).toBe('Microsoft Foundry');
    expect(clouds[2].layers[0].items[0].name).toBe('Gemini Enterprise Agent Platform');
    // the reference stacks: five, each starting with its cloud
    const stacks = stackDiagrams.stacks.variants;
    expect(stacks.map((v) => v.id)).toEqual(['ms', 'dbx', 'hybrid', 'aws', 'gcp']);
    for (const v of stacks) expect(v.layers[0].id).toBe('cloud');
    expect(stacks[1].layers.map((l) => l.id)).toContain('vectors');
  });

  it('both posts embed the two diagrams, the three figures and the same number of tables', () => {
    for (const locale of ['en', 'es'] as const) {
      const body = readFileSync(join('content', locale, 'blog', `${SLUG}.mdx`), 'utf8');
      const ids = [...body.matchAll(/<Stacks id="([a-z]+)"/g)].map((m) => m[1]);
      expect(ids).toEqual(['clouds', 'stacks']);
      const figs = [...body.matchAll(/<Figure src="([a-z-]+)\.(en|es)\.svg"/g)];
      expect(figs.map((m) => m[1])).toEqual(['azure-ms-products', 'azure-rag-pipeline', 'azure-decision']);
      for (const m of figs) { expect(m[2]).toBe(locale); expect(existsSync(join('content/diagrams', `${m[1]}.${locale}.svg`))).toBe(true); }
      expect((body.match(/^\| --- /gm) ?? []).length).toBe(13); // header separators: one per GFM table
    }
  });
});
