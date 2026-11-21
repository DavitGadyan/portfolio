import type { Localized } from '@/lib/content/types';

/**
 * Measured benchmark data behind `<Bench id="auditpro" />` on the Audit Pro case study. Every figure comes from the
 * auditpro.ai repo's results/index.json (synthetic IFRS reports, one RTX 4090 on Vast.ai at $0.415/h, vLLM 0.34, AIPerf 0.13),
 * relayed from the project's own session on 2026-11-21 (index rebuilt about 18:00 UTC). 41 of the 89 variants completed; three runs are
 * left out because their scores are artefacts (qwen2.5-7b-awq-fp8kv: 0% schema-valid; both OLMoE runs: 0% recall with a vacuous 100% grounding).
 * Every row is a single run (qwen3-8b-awq: 3 replicates). Blank = not measured; never fill a gap with an estimate.
 */
export type Quant = 'AWQ' | 'GPTQ' | 'FP8' | 'BF16' | 'MXFP4';
export type BenchRun = {
  id: string;
  label: string;
  params: string;
  quant: Quant;
  /** techniques on top of the base weights (FP8 KV cache, n-gram speculative decoding, 32k context …) */
  tech?: string;
  quality?: number;
  recall?: number;
  precision?: number;
  numeric?: number;
  page?: number;
  grounding?: number;
  /** USD per 1,000 full audits (GPU rental only) */
  cost?: number;
  /** seconds per whole report, four audits at a time */
  auditS?: number;
  /** output tokens per second in the load test, by concurrency */
  tok: Partial<Record<1 | 2 | 4 | 8 | 16, number>>;
  vram?: number;
  pick?: 'quality' | 'balanced' | 'throughput' | 'cost' | 'recall';
  /** grounding under 25% on the 30B-A3B MoE and DeepSeek runs looks like a measurement issue (not yet investigated) */
  groundingCaveat?: boolean;
  /** also drawn on the throughput chart (it has the 8- and 16-user points) */
  speed?: boolean;
};

export type Technique = {
  id: string;
  label: Localized<string>;
  /** what changed, against which reference run */
  base: string;
  cand: string;
  /** signed change, in the metric's own unit; positive = higher */
  deltas: { metric: Localized<string>; value: number; unit: '%' | 'pts' | 's' | '$'; better: 'up' | 'down' }[];
  verdict: Localized<string>;
};

export type AbTest = {
  candidate: string;
  baseline: string;
  verdict: 'ACCEPT' | 'REJECT' | 'NO BENEFIT' | 'INCONCLUSIVE';
  metric: Localized<string>;
  delta: number;
  lo: number;
  hi: number;
  unit: '%' | 'pts';
  p?: number;
};

export type BenchData = {
  runs: BenchRun[];
  techniques: Technique[];
  ab: AbTest[];
  counts?: { total: number; completed: number; skipped: number; failed: number };
};

const L = (en: string, es: string): Localized<string> => ({ en, es });

export const auditproBench: BenchData = {
  counts: { total: 89, completed: 41, skipped: 0, failed: 48 },
  runs: [
    { id: 'qwen3-14b-awq-ctx32k', label: 'Qwen3-14B AWQ, 32k', params: '14.8', quant: 'AWQ', quality: 68.8, recall: 70.3, precision: 61.1, numeric: 56.7, page: 92.6, grounding: 68.4, cost: 1.43, auditS: 44.1, tok: { 1: 74, 4: 198 }, vram: 20.5, pick: 'quality' },
    { id: 'qwen3-14b-awq', label: 'Qwen3-14B AWQ', params: '14.8', quant: 'AWQ', quality: 68.5, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 67.6, cost: 1.41, auditS: 44, tok: { 1: 74, 4: 198 }, vram: 20.5 },
    { id: 'qwen3-14b-awq-ngram', label: 'Qwen3-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.21, auditS: 38.5, tok: { 1: 55, 4: 134 }, vram: 20.5 },
    { id: 'qwen3-14b-awq-noprefix', label: 'Qwen3-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.49, auditS: 46, tok: { 1: 74, 4: 198 }, vram: 21.3 },
    { id: 'qwen3-14b-awq-fp8kv', label: 'Qwen3-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 66.8, recall: 70.3, precision: 58.9, numeric: 56.7, page: 87.5, grounding: 63.4, cost: 1.4, auditS: 44.1, tok: { 1: 78, 4: 216 }, vram: 20.5 },
    { id: 'qwen3-14b-awq-fp8kv-ngram', label: 'Qwen3-14B AWQ, FP8 KV, n-gram', params: '14.8', quant: 'AWQ', quality: 66.6, recall: 70.3, precision: 58.2, numeric: 56.7, page: 85.5, grounding: 65, cost: 0.97, auditS: 32.4, tok: { 1: 76, 4: 199 }, vram: 20.5, pick: 'balanced' },
    { id: 'qwen3-14b-awq-fp8kv-ctx32k', label: 'Qwen3-14B AWQ, FP8 KV, 32k', params: '14.8', quant: 'AWQ', quality: 65.5, recall: 67.6, precision: 54.2, numeric: 56.7, page: 84.7, grounding: 69, cost: 1.31, auditS: 41.3, tok: { 1: 78, 4: 216 }, vram: 20.5 },
    { id: 'qwen3-30b-a3b-gptq-ngram', label: 'Qwen3-30B-A3B GPTQ, n-gram', params: '30.5', quant: 'GPTQ', quality: 65, recall: 81.1, precision: 58.7, numeric: 73.3, page: 76, grounding: 19, cost: 1.45, auditS: 48.3, tok: { 1: 72, 4: 219 }, vram: 21.1, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-noprefix', label: 'Qwen3-30B-A3B GPTQ, no prefix cache', params: '30.5', quant: 'GPTQ', quality: 65, recall: 83.8, precision: 52.1, numeric: 73.3, page: 74.5, grounding: 23.9, cost: 1.37, auditS: 44.3, tok: { 1: 151, 4: 343 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq', label: 'Qwen3-30B-A3B GPTQ', params: '30.5', quant: 'GPTQ', quality: 64.3, recall: 83.8, precision: 51.1, numeric: 73.3, page: 73.9, grounding: 21.4, cost: 1.57, auditS: 49.9, tok: { 1: 151, 4: 343 }, vram: 21.7, groundingCaveat: true, pick: 'recall' },
    { id: 'deepseek-r1-distill-14b-awq', label: 'DeepSeek-R1-Distill-14B AWQ', params: '14.8', quant: 'AWQ', quality: 63.5, recall: 70.7, precision: 59.4, numeric: 86.7, page: 71.1, grounding: 16.4, cost: 1.48, auditS: 46.8, tok: { 1: 72, 4: 189, 8: 257, 16: 265 }, vram: 20.4, groundingCaveat: true, speed: true },
    { id: 'qwen3-30b-a3b-thinking-2507-awq', label: 'Qwen3-30B-A3B Thinking 2507 AWQ', params: '30.5', quant: 'AWQ', quality: 62.3, recall: 59.5, precision: 81.1, numeric: 60, page: 86.5, grounding: 21.6, cost: 1.78, auditS: 58.7, tok: { 1: 147, 4: 330 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-ctx16k', label: 'Qwen3-30B-A3B GPTQ, FP8 KV, 16k', params: '30.5', quant: 'GPTQ', quality: 60.6, recall: 78.4, precision: 48.5, numeric: 66.7, page: 74.7, grounding: 19.2, cost: 1.15, auditS: 39, tok: { 1: 169, 4: 383 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-fp8kv', label: 'Qwen3-30B-A3B GPTQ, FP8 KV', params: '30.5', quant: 'GPTQ', quality: 56.7, recall: 73, precision: 43.7, numeric: 66.7, page: 65.5, grounding: 19.1, cost: 1.19, auditS: 37.9, tok: { 1: 169, 4: 383 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq', label: 'Qwen3-8B AWQ', params: '8.2', quant: 'AWQ', quality: 56.3, recall: 30.6, precision: 64.3, numeric: 62.9, page: 82.7, grounding: 61.8, auditS: 35.2, tok: { 1: 113, 4: 302, 8: 413, 16: 500 }, vram: 21.3, pick: 'throughput' },
    { id: 'qwen3-30b-a3b-awq-cogcomp', label: 'Qwen3-30B-A3B AWQ (cognitivecomputations)', params: '30.5', quant: 'AWQ', quality: 53.9, recall: 62.2, precision: 40.3, numeric: 60, page: 71.4, grounding: 30, cost: 1.46, auditS: 47.9, tok: { 1: 150, 4: 335 }, vram: 21.7 },
    { id: 'qwen3-30b-a3b-2507-awq-cpatonn', label: 'Qwen3-30B-A3B 2507 AWQ (cpatonn)', params: '30.5', quant: 'AWQ', quality: 52.6, recall: 59.5, precision: 49.1, numeric: 56.7, page: 73.6, grounding: 17, cost: 2.08, auditS: 67.6, tok: { 1: 147, 4: 332 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq-noprefix', label: 'Qwen3-8B AWQ, no prefix cache', params: '8.2', quant: 'AWQ', quality: 49.9, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 43.8, cost: 1.76, auditS: 54, tok: { 1: 113, 4: 302 }, vram: 21.3 },
    { id: 'qwen3-8b-awq-ngram', label: 'Qwen3-8B AWQ, n-gram', params: '8.2', quant: 'AWQ', quality: 49.8, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 42.9, cost: 1.25, auditS: 38.5, tok: { 1: 76, 4: 246 }, vram: 20.7 },
    { id: 'qwen3-4b-awq-noprefix', label: 'Qwen3-4B AWQ, no prefix cache', params: '4.0', quant: 'AWQ', quality: 42.2, recall: 43.2, precision: 42, numeric: 33.3, page: 66, grounding: 28.6, cost: 0.67, auditS: 21.5, tok: { 1: 167, 4: 424 }, vram: 21.1, pick: 'cost' },
    { id: 'qwen3-4b-awq', label: 'Qwen3-4B AWQ', params: '4.0', quant: 'AWQ', quality: 41.6, recall: 43.2, precision: 40.4, numeric: 33.3, page: 63.5, grounding: 29, cost: 0.62, auditS: 20, tok: { 1: 167, 4: 424 }, vram: 21.3 },
    { id: 'qwen3-8b-awq-fp8kv', label: 'Qwen3-8B AWQ, FP8 KV', params: '8.2', quant: 'AWQ', quality: 41.5, recall: 35.1, precision: 44.1, numeric: 40, page: 67.6, grounding: 26.7, cost: 1.49, auditS: 48.5, tok: { 1: 122, 4: 471 }, vram: 20.7 },
    { id: 'qwen3-4b-awq-ngram', label: 'Qwen3-4B AWQ, n-gram', params: '4.0', quant: 'AWQ', quality: 41.5, recall: 43.2, precision: 41.2, numeric: 33.3, page: 62.7, grounding: 27.9, cost: 0.55, auditS: 17.9, tok: { 1: 100, 4: 320 }, vram: 20.8 },
    { id: 'llama3.1-8b-awq', label: 'Llama 3.1 8B AWQ', params: '8.0', quant: 'AWQ', quality: 39.6, recall: 40, precision: 50.8, numeric: 30, page: 65.1, grounding: 11, cost: 1.77, auditS: 58.2, tok: { 1: 122, 4: 323, 8: 438, 16: 528 }, vram: 20.9, speed: true },
    { id: 'granite-4.0-h-tiny', label: 'Granite 4.0 H Tiny BF16', params: '6.9', quant: 'BF16', quality: 36.3, recall: 51.4, precision: 16, numeric: 13.3, page: 64.1, grounding: 36.2, cost: 1.78, auditS: 56.4, tok: { 1: 185, 4: 443 }, vram: 21.2 },
    { id: 'qwen3-4b-awq-fp8kv', label: 'Qwen3-4B AWQ, FP8 KV', params: '4.0', quant: 'AWQ', quality: 35.4, recall: 35.1, precision: 34.1, numeric: 26.7, page: 59.1, grounding: 25.8, cost: 0.6, auditS: 19.1, tok: { 1: 185, 4: 665 }, vram: 21.1 },
    { id: 'qwen3-30b-a3b-2507-awq-stelterlab', label: 'Qwen3-30B-A3B 2507 AWQ (stelterlab)', params: '30.5', quant: 'AWQ', quality: 27.3, recall: 16.2, precision: 37, numeric: 10, page: 70.4, grounding: 16.4, cost: 2.72, auditS: 83.8, tok: { 1: 150, 4: 341 }, vram: 21.7, groundingCaveat: true },
    { id: 'qwen2.5-7b-awq-noprefix', label: 'Qwen2.5-7B AWQ, no prefix cache', params: '7.6', quant: 'AWQ', quality: 25.6, recall: 10.8, precision: 35.3, numeric: 10, page: 70.6, grounding: 17.9, cost: 0.86, auditS: 29, tok: { 1: 132, 4: 376 }, vram: 20.9 },
    { id: 'granite-3.1-3b-a800m', label: 'Granite 3.1 3B-A800M BF16', params: '3.3', quant: 'BF16', quality: 25.5, recall: 32.4, precision: 22.7, numeric: 3.3, page: 69.2, grounding: 1, cost: 1.63, auditS: 52.1, tok: { 1: 240, 4: 528 }, vram: 21.4 },
    { id: 'gpt-oss-20b-ctx16k', label: 'gpt-oss-20b MXFP4, 16k', params: '21', quant: 'MXFP4', quality: 22.6, recall: 5.4, precision: 22.2, numeric: 6.7, page: 66.7, grounding: 35, cost: 4.3, auditS: 140.6, tok: { 1: 146, 4: 394 }, vram: 20.8 },
    { id: 'gpt-oss-20b-mxfp4', label: 'gpt-oss-20b MXFP4', params: '21', quant: 'MXFP4', quality: 22.5, recall: 5.4, precision: 16.7, numeric: 6.7, page: 58.3, grounding: 50, cost: 4.12, auditS: 134.5, tok: { 1: 136, 4: 393 }, vram: 20.8 },
    { id: 'qwen1.5-moe-a2.7b-gptq', label: 'Qwen1.5-MoE-A2.7B GPTQ', params: '14.3', quant: 'GPTQ', quality: 19.4, recall: 5.4, precision: 42.9, numeric: 3.3, page: 57.1, grounding: 0, cost: 2.53, auditS: 82.9, tok: { 1: 55, 4: 158 }, vram: 21.2 },
    { id: 'lfm2-8b-a1b', label: 'LFM2-8B-A1B BF16', params: '8.3', quant: 'BF16', quality: 16.6, recall: 21.6, precision: 16, numeric: 3.3, page: 28.2, grounding: 13.1, cost: 3.35, auditS: 112.1, tok: { 1: 219, 4: 452 }, vram: 22 },
    { id: 'qwen2.5-14b-awq-fp8kv', label: 'Qwen2.5-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 14, recall: 5.4, precision: 25, numeric: 3.3, page: 33.3, grounding: 11.4, cost: 2.79, auditS: 87.5, tok: { 1: 49, 4: 113 }, vram: 20.4 },
    { id: 'qwen2.5-14b-awq-noprefix', label: 'Qwen2.5-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 5.8, recall: 2.7, precision: 7.7, numeric: 0, page: 7.7, grounding: 15.4, cost: 2.74, auditS: 83, tok: { 1: 46, 4: 121 }, vram: 20.5 },
    { id: 'qwen2.5-14b-awq', label: 'Qwen2.5-14B AWQ', params: '14.8', quant: 'AWQ', quality: 5.7, recall: 2.7, precision: 7.1, numeric: 0, page: 7.1, grounding: 15.7, cost: 2.65, auditS: 79.7, tok: { 1: 46, 4: 121 }, vram: 21.3 },
    { id: 'qwen2.5-14b-awq-ngram', label: 'Qwen2.5-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 5.6, recall: 2.7, precision: 6.7, numeric: 0, page: 6.7, grounding: 16.7, cost: 1.9, auditS: 60.3, tok: { 1: 45, 4: 107 }, vram: 20.4 },
    { id: 'granite-3.1-1b-a400m', label: 'Granite 3.1 1B-A400M BF16', params: '1.3', quant: 'BF16', quality: 0, recall: 0, precision: 0, numeric: 0, page: 0, grounding: 0, cost: 1.73, auditS: 56.8, tok: { 1: 384, 4: 867 }, vram: 21.4 },
  ],
  techniques: [
    {
      id: 'fp8kv-ngram',
      label: L('FP8 KV cache + n-gram speculative decoding (Qwen3-14B AWQ)', 'Caché KV FP8 + decodificación especulativa n-gram (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-fp8kv-ngram',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: -26.4, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -31.2, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: -1.9, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: 0.7, unit: '%', better: 'up' },
      ],
      verdict: L('The best speed and cost result: a quarter faster per report and 31% cheaper, recall unchanged, 1.9 quality points lower.', 'El mejor resultado de velocidad y coste: un cuarto más rápido por informe y un 31 % más barato, mismo recall y 1,9 puntos menos de calidad.'),
    },
    {
      id: 'ngram',
      label: L('n-gram speculative decoding, depth 4 (Qwen3-14B AWQ)', 'Decodificación especulativa n-gram, profundidad 4 (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-ngram',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: -12.5, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -14.2, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: -0.3, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: -32.2, unit: '%', better: 'up' },
      ],
      verdict: L('Faster on real audits, slower in the load test: audit pages repeat figures and labels that n-gram can guess, random load-test tokens do not.', 'Más rápido en auditorías reales y más lento en la prueba de carga: los informes repiten cifras y etiquetas que n-gram puede adivinar, los tokens aleatorios no.'),
    },
    {
      id: 'fp8kv',
      label: L('FP8 KV cache (Qwen3-14B AWQ)', 'Caché KV FP8 (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-fp8kv',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: 0.2, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -0.7, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: -1.7, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: 9.3, unit: '%', better: 'up' },
      ],
      verdict: L('9% more throughput under load and room for more concurrent users; on its own it does not shorten an audit.', 'Un 9 % más de rendimiento bajo carga y sitio para más usuarios a la vez; por sí sola no acorta una auditoría.'),
    },
    {
      id: 'noprefix',
      label: L('Prefix cache switched off (Qwen3-14B AWQ)', 'Caché de prefijos desactivada (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-noprefix',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: 4.5, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: 5.7, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: -0.3, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: 0.3, unit: '%', better: 'up' },
      ],
      verdict: L('Keep it on: the agents share long system prompts, so turning the cache off makes each audit about 5% slower.', 'Mejor activada: los agentes comparten prompts de sistema largos, así que sin caché cada auditoría tarda un 5 % más.'),
    },
    {
      id: 'ctx32k',
      label: L('32k instead of 16k context (Qwen3-14B AWQ)', 'Contexto de 32k en lugar de 16k (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-ctx32k',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: 0.2, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: 1.4, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: 0.3, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: 0.3, unit: '%', better: 'up' },
      ],
      verdict: L('No measurable difference on these reports; the longer window costs nothing here.', 'Sin diferencia medible en estos informes; la ventana más larga no cuesta nada aquí.'),
    },
    {
      id: 'quantizer',
      label: L('Who quantized it: 4-bit AWQ builds of Qwen3-30B-A3B against the GPTQ build (recall)', 'Quién lo cuantizó: versiones AWQ de 4 bits de Qwen3-30B-A3B frente a la GPTQ (recall)'),
      base: 'qwen3-30b-a3b-gptq',
      cand: '',
      deltas: [
        { metric: L('AWQ, cognitivecomputations', 'AWQ, cognitivecomputations'), value: -21.6, unit: 'pts', better: 'up' },
        { metric: L('AWQ, Thinking 2507 (cpatonn)', 'AWQ, Thinking 2507 (cpatonn)'), value: -24.3, unit: 'pts', better: 'up' },
        { metric: L('AWQ, Instruct 2507 (cpatonn)', 'AWQ, Instruct 2507 (cpatonn)'), value: -24.3, unit: 'pts', better: 'up' },
        { metric: L('AWQ, Instruct 2507 (stelterlab)', 'AWQ, Instruct 2507 (stelterlab)'), value: -67.6, unit: 'pts', better: 'up' },
      ],
      verdict: L('Same model family, same 4 bits, 16% to 62% recall instead of 84%: the quantizer and its calibration data matter as much as the model.', 'Misma familia de modelos, mismos 4 bits, del 16 % al 62 % de recall en lugar del 84 %: el cuantizador y sus datos de calibración importan tanto como el modelo.'),
    },
  ],
  /** 25 paired comparisons ran; 4 REJECT, 21 INCONCLUSIVE (about 15 documents and 1 replicate per run), 0 ACCEPT. Holm p over a family of 300 tests. */
  ab: [
    { candidate: '30B-A3B AWQ 2507 (stelterlab)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -70.0, lo: -86.1, hi: -51.1, unit: 'pts', p: 0.073 },
    { candidate: '30B-A3B AWQ 2507 (cpatonn)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -25.0, lo: -48.9, hi: -2.8, unit: 'pts', p: 1.0 },
    { candidate: '30B-A3B AWQ Thinking 2507', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -24.4, lo: -41.1, hi: -9.4, unit: 'pts', p: 1.0 },
    { candidate: '30B-A3B AWQ (cognitivecomputations)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -23.3, lo: -41.1, hi: -6.7, unit: 'pts', p: 1.0 },
    { candidate: '14B AWQ + FP8 KV + n-gram', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0.0, lo: 0.0, hi: 0.0, unit: 'pts' },
    { candidate: '14B AWQ + FP8 KV, 32k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.2, lo: -6.7, hi: 0.0, unit: 'pts' },
    { candidate: '30B-A3B GPTQ + FP8 KV', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -8.9, lo: -21.1, hi: 2.2, unit: 'pts' },
    { candidate: '30B-A3B GPTQ, 16k', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -4.4, lo: -11.7, hi: 2.8, unit: 'pts' },
    { candidate: '30B-A3B GPTQ + n-gram', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.8, lo: -11.1, hi: 3.3, unit: 'pts' },
    { candidate: '30B-A3B GPTQ, no prefix cache', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -3.3, lo: -20.0, hi: 11.1, unit: 'pts' },
    { candidate: '8B AWQ + FP8 KV', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -10.0, lo: -20.0, hi: -0.6, unit: 'pts' },
    { candidate: '4B AWQ + FP8 KV', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -1.7, lo: -15.0, hi: 15.6, unit: 'pts' },
  ],
};

export const benchData: Record<string, BenchData> = { auditpro: auditproBench };
