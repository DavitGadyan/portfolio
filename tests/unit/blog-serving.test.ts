import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SLUG = 'model-serving-vllm-tensorrt-llm-sglang-triton-llm-d';
const FIGS = ['serving-stack', 'serving-decision', 'serving-llmd-helm'];

describe('model serving post (vLLM, TensorRT-LLM, SGLang, Triton, llm-d)', () => {
  for (const locale of ['en', 'es'] as const) {
    it(`${locale}: seven tables, three figures, bash and yaml blocks, sources`, () => {
      const body = readFileSync(join('content', locale, 'blog', `${SLUG}.mdx`), 'utf8');
      expect((body.match(/^\| --- /gm) ?? []).length).toBe(7);
      expect([...body.matchAll(/<Figure src="([a-z-]+)\.(en|es)\.svg"/g)].map((m) => m[1])).toEqual(FIGS);
      for (const f of FIGS) expect(existsSync(join('content/diagrams', `${f}.${locale}.svg`))).toBe(true);
      expect([...body.matchAll(/^```([a-z]+)$/gm)].map((m) => m[1])).toEqual(['bash', 'yaml']);
      expect(body).toContain(locale === 'en' ? '## Sources' : '## Fuentes');
      expect(body).toMatch(locale === 'en' ? /19 November 2026/ : /19 de noviembre de 2026/);
    });
  }
});
