import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { stackDiagrams } from '@/data/blog/stacks';
import { capabilityStages } from '@/data/capabilityMap';
import { logos, type LogoId } from '@/data/skillLogos';
import { techLogo } from '@/lib/content/techLogos';

/** The two model posts of 2026-11-06 and the marks they brought to the skills map. */
const POSTS = [
  { slug: 'which-llm-to-choose-2026', stacks: ['llm-routes'], figures: ['llm-model-types', 'llm-decision'], tables: 12, fences: ['python'] },
  { slug: 'microsoft-decision-1-decision-model-use-cases', stacks: ['decision-flows'], figures: ['decision-vs-llm', 'decision-agent-loop', 'decision-guide'], tables: 7, fences: ['json', 'json'] },
] as const;

describe('model posts (which LLM, Microsoft Decision-1)', () => {
  it('the two interactive diagrams: three variants each, every variant starting at the entry layer', () => {
    expect(stackDiagrams['llm-routes'].variants.map((v) => v.id)).toEqual(['api', 'selfhost', 'multi']);
    expect(stackDiagrams['decision-flows'].variants.map((v) => v.id)).toEqual(['triage', 'agent', 'judge']);
    for (const v of stackDiagrams['llm-routes'].variants.slice(0, 2)) expect(v.layers.map((l) => l.id).slice(0, 2)).toEqual(['app', 'orchestration']);
    // every stack that routes names the decision model at least once
    const names = (id: string) => stackDiagrams[id].variants.flatMap((v) => v.layers.flatMap((l) => l.items.map((i) => i.name)));
    expect(names('llm-routes').filter((n) => n === 'Microsoft Decision-1')).toHaveLength(2);
    expect(names('decision-flows').filter((n) => n === 'Microsoft Decision-1').length).toBeGreaterThanOrEqual(5);
  });

  it('both posts in both languages embed their diagram, their figures, their tables and their code blocks', () => {
    for (const p of POSTS) for (const locale of ['en', 'es'] as const) {
      const file = join('content', locale, 'blog', `${p.slug}.mdx`);
      expect(existsSync(file), file).toBe(true);
      const body = readFileSync(file, 'utf8');
      expect([...body.matchAll(/<Stacks id="([a-z-]+)"/g)].map((m) => m[1])).toEqual(p.stacks);
      const figs = [...body.matchAll(/<Figure src="([a-z-]+)\.(en|es)\.svg"/g)];
      expect(figs.map((m) => m[1])).toEqual(p.figures);
      for (const m of figs) { expect(m[2]).toBe(locale); expect(existsSync(join('content/diagrams', `${m[1]}.${locale}.svg`))).toBe(true); }
      expect((body.match(/^\| --- /gm) ?? []).length, `${file} tables`).toBe(p.tables);
      expect([...body.matchAll(/^```([a-z]+)$/gm)].map((m) => m[1])).toEqual(p.fences);
      // the two posts link to each other, in the right language
      const other = POSTS.find((o) => o !== p)!;
      expect(body).toContain(`${locale === 'es' ? '/es' : ''}/blog/${other.slug}/`);
      // freshness and sourcing, as the AEO/GEO maps ask
      expect(body).toMatch(locale === 'en' ? /6 November 2026/ : /6 de noviembre de 2026/);
      expect(body).toContain(locale === 'en' ? '## Sources' : '## Fuentes');
    }
  });

  it('the Decision-1 facts are the same in every place they appear', () => {
    for (const locale of ['en', 'es'] as const) {
      const body = readFileSync(join('content', locale, 'blog', 'microsoft-decision-1-decision-model-use-cases.mdx'), 'utf8');
      expect(body).toContain('Qwen3.5-9B');
      expect(body.match(/0[.,]042/g)!.length).toBeGreaterThanOrEqual(4);
      expect(body).toMatch(/32[.,]768/);
      expect(body).not.toMatch(/85 ms/); // a third-party figure, kept out on purpose
    }
  });

  it('the new marks exist on disk and sit in the right skills-map nodes', () => {
    const ids: LogoId[] = ['fabric', 'foundry', 'aisearch', 'datafactory', 'docintel', 'decision1', 'qwen', 'deepseek', 'llama', 'ollama', 'nvidia', 'cohere'];
    for (const id of ids) expect(existsSync(join('public/logos', logos[id][0])), id).toBe(true);
    const ai = capabilityStages.find((s) => s.id === 'ai')!, data = capabilityStages.find((s) => s.id === 'data')!;
    expect(ai.skills).toHaveLength(21);
    expect(ai.skills).toEqual(expect.arrayContaining(['mistral', 'llama', 'qwen', 'deepseek', 'decision1', 'foundry']));
    expect(data.skills).toHaveLength(24);
    expect(data.skills).toEqual(expect.arrayContaining(['fabric', 'datafactory', 'foundry', 'aisearch', 'docintel']));
    for (const s of capabilityStages) expect(new Set(s.skills).size).toBe(s.skills.length);
  });

  it('project stack chips resolve the Microsoft services and the LLM vendors', () => {
    expect(techLogo('Azure AI Document Intelligence (optional), PyMuPDF, Claude vision OCR')?.label).toBe('Azure AI Document Intelligence');
    expect(techLogo('Ollama alternative (qwen2.5, bge-m3 / nomic-embed-text)')?.label).toBe('Ollama');
    expect(techLogo('Microsoft Fabric')?.label).toBe('Microsoft Fabric');
    expect(techLogo('Microsoft Foundry Agent Service')?.label).toBe('Microsoft Foundry');
    expect(techLogo('Azure AI Search')?.label).toBe('Azure AI Search');
    expect(techLogo('Azure Data Factory')?.label).toBe('Azure Data Factory');
    expect(techLogo('Meta Llama 4')?.label).toBe('Meta Llama');
    expect(techLogo('Qwen3.8-27B on vLLM')?.label).toBe('Qwen (Alibaba)');
    expect(techLogo('DeepSeek-V4-Flash')?.label).toBe('DeepSeek');
    expect(techLogo('Mistral Medium 3.5')?.label).toBe('Mistral AI');
    expect(techLogo('Microsoft Decision-1')?.label).toBe('Microsoft Decision-1');
    expect(techLogo('Azure OpenAI')?.label).toBe('OpenAI'); // unchanged: the OpenAI alias still comes first
    expect(techLogo('Azure AI Services')?.label).toBe('Azure AI'); // unchanged
  });
});
