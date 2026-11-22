import type { Localized } from '@/lib/content/types';

/**
 * Measured benchmark data behind `<Bench id="auditpro" />` on the Audit Pro case study. Every figure comes from the
 * auditpro.ai repo's results/index.json (synthetic IFRS reports, one RTX 4090 on Vast.ai at $0.415/h, vLLM 0.34, AIPerf 0.13),
 * relayed from the project's own session on 2026-11-22 (index synced 08:59 UTC). 57 of the 89 variants completed; five are left out
 * because their scores are artefacts: qwen2.5-7b-awq-fp8kv and qwen2.5-7b-bf16-fp8kv (FP8 KV breaks their JSON), phi-4-mini and both
 * OLMoE runs (0% recall). Runs marked docs: 30 used 30 synthetic reports, the rest 15. Blank = not measured; never fill a gap with an estimate.
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
  /** GiB of weights on disk and engine cold start in seconds */
  weights?: number;
  loadS?: number;
  /** synthetic reports scored (15 unless set) */
  docs?: number;
  pick?: 'quality' | 'balanced' | 'throughput' | 'cost' | 'recall' | 'numeric';
  /** grounding under 25% on the 30B-A3B MoE and DeepSeek runs looks like a measurement issue (not yet investigated) */
  groundingCaveat?: boolean;
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

/** One closed-loop load point: c concurrent requests of 4,000 random tokens in, 600 out. ms for ttft/itl, s for e2e. */
export type CurvePoint = { c: 1 | 2 | 4 | 8 | 16; tok: number; user: number; rps: number; ttft: number; ttft95: number; itl: number; e2e: number; e2e95: number };

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
  /** documents present in both runs, runs per arm, and the precision change on the same pairs */
  n?: number;
  reps?: [number, number];
  prec?: [number, number, number];
};

export type BenchData = {
  runs: BenchRun[];
  techniques: Technique[];
  ab: AbTest[];
  counts?: { total: number; completed: number; skipped: number; failed: number };
  curves?: Record<string, CurvePoint[]>;
};

const L = (en: string, es: string): Localized<string> => ({ en, es });

/** Closed-loop AIPerf sweeps (4,000 random tokens in, 600 out, streaming, straight to vLLM) for the runs drawn on the load chart. */
export const auditproCurves: Record<string, CurvePoint[]> = {
  'qwen3-14b-awq-ctx8k': [{ c: 1, tok: 74.2, user: 84.0, rps: 0.124, ttft: 945.8, ttft95: 947.7, itl: 11.91, e2e: 8.1, e2e95: 8.1 }, { c: 2, tok: 127.5, user: 74.8, rps: 0.213, ttft: 1405.7, ttft95: 1852.7, itl: 13.36, e2e: 9.4, e2e95: 9.4 }, { c: 4, tok: 198.3, user: 60.0, rps: 0.330, ttft: 2101.7, ttft95: 2802.8, itl: 16.67, e2e: 12.1, e2e95: 12.5 }, { c: 8, tok: 272.1, user: 39.4, rps: 0.453, ttft: 2401.1, ttft95: 3849.7, itl: 25.41, e2e: 17.6, e2e95: 19.0 }, { c: 16, tok: 300.6, user: 23.9, rps: 0.501, ttft: 4430.3, ttft95: 17594.0, itl: 41.87, e2e: 29.6, e2e95: 43.3 }],
  'phi-4-fp8': [{ c: 1, tok: 44.8, user: 47.0, rps: 0.075, ttft: 634.6, ttft95: 635.8, itl: 21.26, e2e: 13.3, e2e95: 13.3 }, { c: 2, tok: 82.2, user: 43.8, rps: 0.138, ttft: 934.9, ttft95: 1221.9, itl: 22.81, e2e: 14.5, e2e95: 14.5 }, { c: 4, tok: 141.7, user: 38.5, rps: 0.238, ttft: 1396.5, ttft95: 1571.9, itl: 25.95, e2e: 16.8, e2e95: 16.8 }, { c: 8, tok: 166.6, user: 32.8, rps: 0.280, ttft: 4153.9, ttft95: 18633.0, itl: 30.46, e2e: 26.4, e2e95: 37.2 }, { c: 16, tok: 166.5, user: 32.8, rps: 0.280, ttft: 39132.3, ttft95: 39444.2, itl: 30.46, e2e: 57.2, e2e95: 57.7 }],
  'deepseek-r1-distill-14b-awq': [{ c: 1, tok: 71.5, user: 80.8, rps: 0.119, ttft: 966.4, ttft95: 971.9, itl: 12.38, e2e: 8.4, e2e95: 8.4 }, { c: 2, tok: 122.1, user: 71.2, rps: 0.204, ttft: 1439.5, ttft95: 1892.3, itl: 14.05, e2e: 9.8, e2e95: 9.8 }, { c: 4, tok: 188.8, user: 56.7, rps: 0.315, ttft: 2157.5, ttft95: 2449.5, itl: 17.64, e2e: 12.7, e2e95: 12.7 }, { c: 8, tok: 256.9, user: 37.0, rps: 0.428, ttft: 2466.1, ttft95: 3938.2, itl: 27.03, e2e: 18.7, e2e95: 20.1 }, { c: 16, tok: 264.9, user: 26.2, rps: 0.442, ttft: 7022.4, ttft95: 21626.4, itl: 38.17, e2e: 31.6, e2e95: 45.1 }],
  'qwen3-8b-awq': [{ c: 1, tok: 112.9, user: 125.5, rps: 0.188, ttft: 533.4, ttft95: 536.7, itl: 7.97, e2e: 5.3, e2e95: 5.3 }, { c: 2, tok: 194.1, user: 111.2, rps: 0.323, ttft: 783.3, ttft95: 1033.2, itl: 9.00, e2e: 6.2, e2e95: 6.2 }, { c: 4, tok: 301.8, user: 90.1, rps: 0.503, ttft: 1289.6, ttft95: 1785.1, itl: 11.10, e2e: 7.9, e2e95: 8.0 }, { c: 8, tok: 413.3, user: 59.8, rps: 0.689, ttft: 1578.3, ttft95: 2134.0, itl: 16.72, e2e: 11.6, e2e95: 12.1 }, { c: 16, tok: 500.3, user: 33.7, rps: 0.834, ttft: 1387.9, ttft95: 4257.4, itl: 29.69, e2e: 19.2, e2e95: 22.0 }],
  'llama3.1-8b-awq': [{ c: 1, tok: 122.3, user: 137.6, rps: 0.205, ttft: 528.5, ttft95: 530.1, itl: 7.27, e2e: 4.9, e2e95: 4.9 }, { c: 2, tok: 209.8, user: 121.7, rps: 0.352, ttft: 776.8, ttft95: 1024.3, itl: 8.22, e2e: 5.7, e2e95: 5.7 }, { c: 4, tok: 322.6, user: 97.9, rps: 0.542, ttft: 1277.4, ttft95: 1777.5, itl: 10.22, e2e: 7.4, e2e95: 7.6 }, { c: 8, tok: 438.5, user: 63.9, rps: 0.737, ttft: 1557.1, ttft95: 2106.5, itl: 15.65, e2e: 10.8, e2e95: 11.4 }, { c: 16, tok: 527.6, user: 35.7, rps: 0.885, ttft: 1365.3, ttft95: 4200.9, itl: 28.02, e2e: 18.1, e2e95: 20.8 }],
  'qwen2.5-7b-awq': [{ c: 1, tok: 132.3, user: 148.1, rps: 0.223, ttft: 490.8, ttft95: 493.5, itl: 6.75, e2e: 4.5, e2e95: 4.5 }, { c: 2, tok: 281.1, user: 142.1, rps: 0.474, ttft: 47.3, ttft95: 53.4, itl: 7.04, e2e: 4.2, e2e95: 4.2 }, { c: 4, tok: 530.6, user: 134.5, rps: 0.895, ttft: 59.3, ttft95: 74.2, itl: 7.43, e2e: 4.5, e2e95: 4.5 }, { c: 8, tok: 646.2, user: 85.9, rps: 1.090, ttft: 981.8, ttft95: 1941.8, itl: 11.64, e2e: 8.8, e2e95: 9.1 }, { c: 16, tok: 671.1, user: 46.9, rps: 1.133, ttft: 1491.5, ttft95: 3900.4, itl: 21.31, e2e: 14.1, e2e95: 16.5 }],
  'qwen2.5-7b-fp8': [{ c: 1, tok: 80.7, user: 84.5, rps: 0.135, ttft: 339.3, ttft95: 341.8, itl: 11.83, e2e: 7.4, e2e95: 7.4 }, { c: 2, tok: 163.8, user: 82.3, rps: 0.275, ttft: 47.9, ttft95: 51.7, itl: 12.15, e2e: 7.3, e2e95: 7.3 }, { c: 4, tok: 314.3, user: 79.3, rps: 0.530, ttft: 58.4, ttft95: 76.8, itl: 12.61, e2e: 7.5, e2e95: 7.6 }, { c: 8, tok: 491.3, user: 62.1, rps: 0.824, ttft: 673.2, ttft95: 1299.9, itl: 16.11, e2e: 10.5, e2e95: 10.9 }, { c: 16, tok: 653.2, user: 43.4, rps: 1.097, ttft: 861.0, ttft95: 2636.0, itl: 23.06, e2e: 14.6, e2e95: 16.3 }],
  'qwen2.5-7b-bf16-noprefix': [{ c: 1, tok: 57.1, user: 59.7, rps: 0.096, ttft: 472.8, ttft95: 474.4, itl: 16.74, e2e: 10.4, e2e95: 10.4 }, { c: 2, tok: 106.1, user: 56.0, rps: 0.179, ttft: 688.8, ttft95: 899.8, itl: 17.86, e2e: 11.2, e2e95: 11.2 }, { c: 4, tok: 193.1, user: 52.6, rps: 0.324, ttft: 1037.8, ttft95: 1155.3, itl: 19.02, e2e: 12.3, e2e95: 12.3 }, { c: 8, tok: 324.0, user: 43.8, rps: 0.543, ttft: 1167.4, ttft95: 1888.2, itl: 22.81, e2e: 14.7, e2e95: 15.4 }, { c: 16, tok: 483.8, user: 32.2, rps: 0.812, ttft: 1208.9, ttft95: 3757.9, itl: 31.06, e2e: 19.7, e2e95: 22.1 }],
  'qwen3-14b-awq-draft': [{ c: 1, tok: 64.9, user: 71.9, rps: 0.108, ttft: 982.0, ttft95: 1001.2, itl: 13.90, e2e: 9.3, e2e95: 10.1 }, { c: 2, tok: 107.1, user: 59.0, rps: 0.179, ttft: 1066.6, ttft95: 1089.2, itl: 16.96, e2e: 11.3, e2e95: 12.3 }, { c: 4, tok: 149.7, user: 40.7, rps: 0.250, ttft: 1104.8, ttft95: 2213.3, itl: 24.58, e2e: 16.0, e2e95: 17.8 }, { c: 8, tok: 165.6, user: 32.8, rps: 0.276, ttft: 7540.0, ttft95: 16460.0, itl: 30.52, e2e: 28.0, e2e95: 34.3 }, { c: 16, tok: 167.8, user: 33.3, rps: 0.280, ttft: 38799.3, ttft95: 40764.8, itl: 30.02, e2e: 56.5, e2e95: 60.6 }],
};

export const auditproBench: BenchData = {
  counts: { total: 89, completed: 57, skipped: 0, failed: 32 },
  curves: auditproCurves,
  runs: [
    { id: 'qwen3-14b-awq-ctx8k', label: 'Qwen3-14B AWQ, 8k', params: '14.8', quant: 'AWQ', quality: 69.1, recall: 70.7, precision: 56.1, numeric: 60, page: 93.5, grounding: 71.3, cost: 1.36, auditS: 45.9, tok: { 1: 74, 2: 128, 4: 198, 8: 272, 16: 301 }, weights: 9.3, loadS: 86, vram: 20.5, pick: 'quality', docs: 30 },
    { id: 'qwen3-14b-awq-draft', label: 'Qwen3-14B AWQ, draft model', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.3, numeric: 60, page: 92.7, grounding: 72.1, cost: 0.99, auditS: 33.5, tok: { 1: 65, 2: 107, 4: 150, 8: 166, 16: 168 }, weights: 9.3, loadS: 160, vram: 20.4, docs: 30 },
    { id: 'phi-4-fp8-ngram', label: 'Phi-4 FP8, n-gram', params: '14.7', quant: 'FP8', quality: 68.7, recall: 72, precision: 65.1, numeric: 88.3, page: 84.5, grounding: 24.6, cost: 2.63, auditS: 88.3, tok: { 1: 38, 2: 72, 4: 108, 8: 126, 16: 129 }, weights: 14.6, loadS: 138, vram: 20.9, groundingCaveat: true, docs: 30 },
    { id: 'phi-4-fp8-fp8kv', label: 'Phi-4 FP8, FP8 KV', params: '14.7', quant: 'FP8', quality: 68.5, recall: 69.3, precision: 70.4, numeric: 86.7, page: 90.4, grounding: 18.2, cost: 3.94, auditS: 132.1, tok: { 1: 47, 2: 87, 4: 154, 8: 252, 16: 249 }, weights: 14.6, loadS: 104, vram: 20.9, groundingCaveat: true, docs: 30 },
    { id: 'phi-4-fp8', label: 'Phi-4 FP8', params: '14.7', quant: 'FP8', quality: 68.5, recall: 70.7, precision: 64.3, numeric: 88.3, page: 85.7, grounding: 26.3, cost: 4.53, auditS: 152.8, tok: { 1: 45, 2: 82, 4: 142, 8: 167, 16: 166 }, weights: 14.6, loadS: 42, vram: 21.5, groundingCaveat: true, pick: 'numeric', docs: 30 },
    { id: 'phi-4-fp8-noprefix', label: 'Phi-4 FP8, no prefix cache', params: '14.7', quant: 'FP8', quality: 68.4, recall: 72, precision: 64.3, numeric: 88.3, page: 84.1, grounding: 24.2, cost: 4.58, auditS: 154.9, tok: { 1: 45, 2: 83, 4: 143, 8: 157, 16: 158 }, weights: 14.6, loadS: 92, vram: 20.9, groundingCaveat: true, docs: 30 },
    { id: 'qwen2.5-7b-bf16-noprefix', label: 'Qwen2.5-7B BF16, no prefix cache', params: '7.6', quant: 'BF16', quality: 48.7, recall: 40, precision: 67.3, numeric: 40, page: 81.6, grounding: 20.2, cost: 1.56, auditS: 52.7, tok: { 1: 57, 2: 106, 4: 193, 8: 324, 16: 484 }, weights: 14.2, loadS: 62, vram: 20.9, pick: 'throughput', docs: 30 },
    { id: 'qwen2.5-7b-bf16', label: 'Qwen2.5-7B BF16', params: '7.6', quant: 'BF16', quality: 48, recall: 40, precision: 62.3, numeric: 38.3, page: 81.1, grounding: 24.7, cost: 1.53, auditS: 51.1, tok: { 1: 57, 2: 106, 4: 193, 8: 324, 16: 483 }, weights: 14.2, loadS: 40, vram: 21.3, docs: 30 },
    { id: 'qwen2.5-7b-bf16-ngram', label: 'Qwen2.5-7B BF16, n-gram', params: '7.6', quant: 'BF16', quality: 46.6, recall: 40, precision: 57.6, numeric: 38.3, page: 74.6, grounding: 28.3, cost: 1.06, auditS: 34.9, tok: { 1: 49, 2: 93, 4: 166, 8: 250, 16: 341 }, weights: 14.2, loadS: 80, vram: 20.8, docs: 30 },
    { id: 'qwen2.5-7b-fp8', label: 'Qwen2.5-7B FP8', params: '7.6', quant: 'FP8', quality: 41.3, recall: 37.3, precision: 51.7, numeric: 28.3, page: 65, grounding: 28.7, cost: 1.41, auditS: 43.8, tok: { 1: 81, 2: 164, 4: 314, 8: 491, 16: 653 }, weights: 8.1, loadS: 78, vram: 20.8, docs: 30 },
    { id: 'qwen2.5-14b-fp8', label: 'Qwen2.5-14B FP8', params: '14.8', quant: 'FP8', quality: 29.3, recall: 26.7, precision: 35.3, numeric: 11.7, page: 57.4, grounding: 22, cost: 3.82, auditS: 127.3, tok: { 1: 35, 2: 63, 4: 116, 8: 124, 16: 121 }, weights: 15.2, loadS: 44, vram: 21.4, docs: 30 },
    { id: 'qwen2.5-14b-fp8-fp8kv', label: 'Qwen2.5-14B FP8, FP8 KV', params: '14.8', quant: 'FP8', quality: 27.7, recall: 21.3, precision: 34, numeric: 10, page: 62.3, grounding: 21, cost: 3.95, auditS: 132.8, tok: { 1: 39, 2: 72, 4: 129, 8: 147, 16: 149 }, weights: 15.2, loadS: 118, vram: 20.4, docs: 30 },
    { id: 'qwen2.5-7b-awq', label: 'Qwen2.5-7B AWQ', params: '7.6', quant: 'AWQ', quality: 23.3, recall: 12, precision: 32.1, numeric: 10, page: 60.7, grounding: 14.4, cost: 0.88, auditS: 27.1, tok: { 1: 132, 2: 281, 4: 531, 8: 646, 16: 671 }, weights: 5.2, loadS: 40, vram: 21.3, docs: 30 },
    { id: 'qwen2.5-7b-awq-ngram', label: 'Qwen2.5-7B AWQ, n-gram', params: '7.6', quant: 'AWQ', quality: 23, recall: 12, precision: 29, numeric: 10, page: 61.3, grounding: 16.1, cost: 0.73, auditS: 23.6, tok: { 1: 96, 2: 202, 4: 373, 8: 394, 16: 379 }, weights: 5.2, loadS: 70, vram: 20.9, docs: 30 },
    { id: 'qwen3-14b-awq-ctx32k', label: 'Qwen3-14B AWQ, 32k', params: '14.8', quant: 'AWQ', quality: 68.8, recall: 70.3, precision: 61.1, numeric: 56.7, page: 92.6, grounding: 68.4, cost: 1.43, auditS: 44.1, tok: { 1: 74, 4: 198 }, weights: 9.3, loadS: 84, vram: 20.5 },
    { id: 'qwen3-14b-awq', label: 'Qwen3-14B AWQ', params: '14.8', quant: 'AWQ', quality: 68.5, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 67.6, cost: 1.41, auditS: 44, tok: { 1: 74, 4: 198 }, weights: 9.3, loadS: 84, vram: 20.5 },
    { id: 'qwen3-14b-awq-ngram', label: 'Qwen3-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.21, auditS: 38.5, tok: { 1: 55, 4: 134 }, weights: 9.3, loadS: 136, vram: 20.5 },
    { id: 'qwen3-14b-awq-noprefix', label: 'Qwen3-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.49, auditS: 46, tok: { 1: 74, 4: 198 }, weights: 9.3, loadS: 46, vram: 21.3 },
    { id: 'qwen3-14b-awq-fp8kv', label: 'Qwen3-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 66.8, recall: 70.3, precision: 58.9, numeric: 56.7, page: 87.5, grounding: 63.4, cost: 1.4, auditS: 44.1, tok: { 1: 78, 4: 216 }, weights: 9.3, loadS: 82, vram: 20.5 },
    { id: 'qwen3-14b-awq-fp8kv-ngram', label: 'Qwen3-14B AWQ, FP8 KV, n-gram', params: '14.8', quant: 'AWQ', quality: 66.6, recall: 70.3, precision: 58.2, numeric: 56.7, page: 85.5, grounding: 65, cost: 0.97, auditS: 32.4, tok: { 1: 76, 4: 199 }, weights: 9.3, loadS: 110, vram: 20.5, pick: 'cost' },
    { id: 'qwen3-14b-awq-fp8kv-ctx32k', label: 'Qwen3-14B AWQ, FP8 KV, 32k', params: '14.8', quant: 'AWQ', quality: 65.5, recall: 67.6, precision: 54.2, numeric: 56.7, page: 84.7, grounding: 69, cost: 1.31, auditS: 41.3, tok: { 1: 78, 4: 216 }, weights: 9.3, loadS: 92, vram: 20.5 },
    { id: 'qwen3-30b-a3b-gptq-ngram', label: 'Qwen3-30B-A3B GPTQ, n-gram', params: '30.5', quant: 'GPTQ', quality: 65, recall: 81.1, precision: 58.7, numeric: 73.3, page: 76, grounding: 19, cost: 1.45, auditS: 48.3, tok: { 1: 72, 4: 219 }, weights: 15.8, loadS: 160, vram: 21.1, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-noprefix', label: 'Qwen3-30B-A3B GPTQ, no prefix cache', params: '30.5', quant: 'GPTQ', quality: 65, recall: 83.8, precision: 52.1, numeric: 73.3, page: 74.5, grounding: 23.9, cost: 1.37, auditS: 44.3, tok: { 1: 151, 4: 343 }, weights: 15.8, loadS: 72, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq', label: 'Qwen3-30B-A3B GPTQ', params: '30.5', quant: 'GPTQ', quality: 64.3, recall: 83.8, precision: 51.1, numeric: 73.3, page: 73.9, grounding: 21.4, cost: 1.57, auditS: 49.9, tok: { 1: 151, 4: 343 }, weights: 15.8, loadS: 112, vram: 21.7, groundingCaveat: true, pick: 'recall' },
    { id: 'deepseek-r1-distill-14b-awq', label: 'DeepSeek-R1-Distill-14B AWQ', params: '14.8', quant: 'AWQ', quality: 63.5, recall: 70.7, precision: 59.4, numeric: 86.7, page: 71.1, grounding: 16.4, cost: 1.48, auditS: 46.8, tok: { 1: 72, 2: 122, 4: 189, 8: 257, 16: 265 }, weights: 9.3, loadS: 98, vram: 20.4, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-thinking-2507-awq', label: 'Qwen3-30B-A3B Thinking 2507 AWQ', params: '30.5', quant: 'AWQ', quality: 62.3, recall: 59.5, precision: 81.1, numeric: 60, page: 86.5, grounding: 21.6, cost: 1.78, auditS: 58.7, tok: { 1: 147, 4: 330 }, weights: 16.9, loadS: 98, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-ctx16k', label: 'Qwen3-30B-A3B GPTQ, FP8 KV, 16k', params: '30.5', quant: 'GPTQ', quality: 60.6, recall: 78.4, precision: 48.5, numeric: 66.7, page: 74.7, grounding: 19.2, cost: 1.15, auditS: 39, tok: { 1: 169, 4: 383 }, weights: 15.8, loadS: 126, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-fp8kv', label: 'Qwen3-30B-A3B GPTQ, FP8 KV', params: '30.5', quant: 'GPTQ', quality: 56.7, recall: 73, precision: 43.7, numeric: 66.7, page: 65.5, grounding: 19.1, cost: 1.19, auditS: 37.9, tok: { 1: 169, 4: 383 }, weights: 15.8, loadS: 114, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq', label: 'Qwen3-8B AWQ', params: '8.2', quant: 'AWQ', quality: 56.3, recall: 30.6, precision: 64.3, numeric: 62.9, page: 82.7, grounding: 61.8, auditS: 35.2, tok: { 1: 113, 2: 194, 4: 302, 8: 413, 16: 500 }, weights: 5.7, loadS: 51, vram: 21.3 },
    { id: 'qwen3-30b-a3b-awq-cogcomp', label: 'Qwen3-30B-A3B AWQ (cognitivecomputations)', params: '30.5', quant: 'AWQ', quality: 53.9, recall: 62.2, precision: 40.3, numeric: 60, page: 71.4, grounding: 30, cost: 1.46, auditS: 47.9, tok: { 1: 150, 4: 335 }, weights: 15.7, loadS: 112, vram: 21.7 },
    { id: 'qwen3-30b-a3b-2507-awq-cpatonn', label: 'Qwen3-30B-A3B 2507 AWQ (cpatonn)', params: '30.5', quant: 'AWQ', quality: 52.6, recall: 59.5, precision: 49.1, numeric: 56.7, page: 73.6, grounding: 17, cost: 2.08, auditS: 67.6, tok: { 1: 147, 4: 332 }, weights: 16.9, loadS: 102, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq-noprefix', label: 'Qwen3-8B AWQ, no prefix cache', params: '8.2', quant: 'AWQ', quality: 49.9, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 43.8, cost: 1.76, auditS: 54, tok: { 1: 113, 4: 302 }, weights: 5.7, loadS: 48, vram: 21.3 },
    { id: 'qwen3-8b-awq-ngram', label: 'Qwen3-8B AWQ, n-gram', params: '8.2', quant: 'AWQ', quality: 49.8, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 42.9, cost: 1.25, auditS: 38.5, tok: { 1: 76, 4: 246 }, weights: 5.7, loadS: 98, vram: 20.7 },
    { id: 'qwen3-4b-awq-noprefix', label: 'Qwen3-4B AWQ, no prefix cache', params: '4.0', quant: 'AWQ', quality: 42.2, recall: 43.2, precision: 42, numeric: 33.3, page: 66, grounding: 28.6, cost: 0.67, auditS: 21.5, tok: { 1: 167, 4: 424 }, weights: 2.5, loadS: 82, vram: 21.1 },
    { id: 'qwen3-4b-awq', label: 'Qwen3-4B AWQ', params: '4.0', quant: 'AWQ', quality: 41.6, recall: 43.2, precision: 40.4, numeric: 33.3, page: 63.5, grounding: 29, cost: 0.62, auditS: 20, tok: { 1: 167, 4: 424 }, weights: 2.5, loadS: 40, vram: 21.3 },
    { id: 'qwen3-8b-awq-fp8kv', label: 'Qwen3-8B AWQ, FP8 KV', params: '8.2', quant: 'AWQ', quality: 41.5, recall: 35.1, precision: 44.1, numeric: 40, page: 67.6, grounding: 26.7, cost: 1.49, auditS: 48.5, tok: { 1: 122, 4: 471 }, weights: 5.7, loadS: 118, vram: 20.7 },
    { id: 'qwen3-4b-awq-ngram', label: 'Qwen3-4B AWQ, n-gram', params: '4.0', quant: 'AWQ', quality: 41.5, recall: 43.2, precision: 41.2, numeric: 33.3, page: 62.7, grounding: 27.9, cost: 0.55, auditS: 17.9, tok: { 1: 100, 4: 320 }, weights: 2.5, loadS: 92, vram: 20.8 },
    { id: 'llama3.1-8b-awq', label: 'Llama 3.1 8B AWQ', params: '8.0', quant: 'AWQ', quality: 39.6, recall: 40, precision: 50.8, numeric: 30, page: 65.1, grounding: 11, cost: 1.77, auditS: 58.2, tok: { 1: 122, 2: 210, 4: 323, 8: 438, 16: 528 }, weights: 5.3, loadS: 82, vram: 20.9 },
    { id: 'granite-4.0-h-tiny', label: 'Granite 4.0 H Tiny BF16', params: '6.9', quant: 'BF16', quality: 36.3, recall: 51.4, precision: 16, numeric: 13.3, page: 64.1, grounding: 36.2, cost: 1.78, auditS: 56.4, tok: { 1: 185, 4: 443 }, weights: 12.9, loadS: 180, vram: 21.2 },
    { id: 'qwen3-4b-awq-fp8kv', label: 'Qwen3-4B AWQ, FP8 KV', params: '4.0', quant: 'AWQ', quality: 35.4, recall: 35.1, precision: 34.1, numeric: 26.7, page: 59.1, grounding: 25.8, cost: 0.6, auditS: 19.1, tok: { 1: 185, 4: 665 }, weights: 2.5, loadS: 80, vram: 21.1 },
    { id: 'qwen3-30b-a3b-2507-awq-stelterlab', label: 'Qwen3-30B-A3B 2507 AWQ (stelterlab)', params: '30.5', quant: 'AWQ', quality: 27.3, recall: 16.2, precision: 37, numeric: 10, page: 70.4, grounding: 16.4, cost: 2.72, auditS: 83.8, tok: { 1: 150, 4: 341 }, weights: 15.6, loadS: 100, vram: 21.7, groundingCaveat: true },
    { id: 'qwen2.5-7b-awq-noprefix', label: 'Qwen2.5-7B AWQ, no prefix cache', params: '7.6', quant: 'AWQ', quality: 25.6, recall: 11.4, precision: 34.9, numeric: 10, page: 71.5, grounding: 16.5, cost: 0.91, auditS: 28.8, tok: { 1: 132, 2: 229, 4: 376, 8: 539, 16: 671 }, weights: 5.2, loadS: 52, vram: 21.1 },
    { id: 'granite-3.1-3b-a800m', label: 'Granite 3.1 3B-A800M BF16', params: '3.3', quant: 'BF16', quality: 25.5, recall: 32.4, precision: 22.7, numeric: 3.3, page: 69.2, grounding: 1, cost: 1.63, auditS: 52.1, tok: { 1: 240, 4: 528 }, weights: 6.1, loadS: 94, vram: 21.4 },
    { id: 'gpt-oss-20b-ctx16k', label: 'gpt-oss-20b MXFP4, 16k', params: '21', quant: 'MXFP4', quality: 22.6, recall: 5.4, precision: 22.2, numeric: 6.7, page: 66.7, grounding: 35, cost: 4.3, auditS: 140.6, tok: { 1: 146, 4: 394 }, weights: 38.5, loadS: 74, vram: 20.8 },
    { id: 'gpt-oss-20b-mxfp4', label: 'gpt-oss-20b MXFP4', params: '21', quant: 'MXFP4', quality: 22.5, recall: 5.4, precision: 16.7, numeric: 6.7, page: 58.3, grounding: 50, cost: 4.12, auditS: 134.5, tok: { 1: 136, 4: 393 }, weights: 38.5, loadS: 82, vram: 20.8 },
    { id: 'qwen1.5-moe-a2.7b-gptq', label: 'Qwen1.5-MoE-A2.7B GPTQ', params: '14.3', quant: 'GPTQ', quality: 19.4, recall: 5.4, precision: 42.9, numeric: 3.3, page: 57.1, grounding: 0, cost: 2.53, auditS: 82.9, tok: { 1: 55, 4: 158 }, weights: 7.8, loadS: 86, vram: 21.2 },
    { id: 'lfm2-8b-a1b', label: 'LFM2-8B-A1B BF16', params: '8.3', quant: 'BF16', quality: 16.6, recall: 21.6, precision: 16, numeric: 3.3, page: 28.2, grounding: 13.1, cost: 3.35, auditS: 112.1, tok: { 1: 219, 4: 452 }, weights: 15.5, loadS: 88, vram: 22 },
    { id: 'qwen2.5-14b-awq-fp8kv', label: 'Qwen2.5-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 14, recall: 5.4, precision: 25, numeric: 3.3, page: 33.3, grounding: 11.4, cost: 2.79, auditS: 87.5, tok: { 1: 49, 4: 113 }, weights: 9.3, loadS: 110, vram: 20.4 },
    { id: 'qwen2.5-14b-awq-noprefix', label: 'Qwen2.5-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 5.8, recall: 2.7, precision: 7.7, numeric: 0, page: 7.7, grounding: 15.4, cost: 2.74, auditS: 83, tok: { 1: 46, 4: 121 }, weights: 9.3, loadS: 100, vram: 20.5 },
    { id: 'qwen2.5-14b-awq', label: 'Qwen2.5-14B AWQ', params: '14.8', quant: 'AWQ', quality: 5.7, recall: 2.7, precision: 7.1, numeric: 0, page: 7.1, grounding: 15.7, cost: 2.65, auditS: 79.7, tok: { 1: 46, 4: 121 }, weights: 9.3, loadS: 50, vram: 21.3 },
    { id: 'qwen2.5-14b-awq-ngram', label: 'Qwen2.5-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 5.6, recall: 2.7, precision: 6.7, numeric: 0, page: 6.7, grounding: 16.7, cost: 1.9, auditS: 60.3, tok: { 1: 45, 4: 107 }, weights: 9.3, loadS: 98, vram: 20.4 },
    { id: 'granite-3.1-1b-a400m', label: 'Granite 3.1 1B-A400M BF16', params: '1.3', quant: 'BF16', quality: 0, recall: 0, precision: 0, numeric: 0, page: 0, grounding: 0, cost: 1.73, auditS: 56.8, tok: { 1: 384, 4: 867 }, weights: 2.5, loadS: 84, vram: 21.4 },
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
      id: 'draft',
      label: L('Draft-model speculative decoding: Qwen3-0.6B proposes 5 tokens (Qwen3-14B AWQ)', 'Decodificación especulativa con modelo borrador: Qwen3-0.6B propone 5 tokens (Qwen3-14B AWQ)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-draft',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: -23.9, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -29.8, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: 0.1, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 4 users (random prompts)', 'Tokens/s, 4 usuarios (prompts aleatorios)'), value: -24.3, unit: '%', better: 'up' },
      ],
      verdict: L('The second strong speed result: a quarter faster per report at the same quality, $0.99 per 1,000 audits. Like n-gram it is slower on random load-test tokens.', 'El segundo buen resultado de velocidad: un cuarto más rápido por informe con la misma calidad, 0,99 $ por 1.000 auditorías. Como n-gram, es más lento con los tokens aleatorios de la prueba de carga.'),
    },
    {
      id: 'phi-fp8kv',
      label: L('FP8 KV cache on Phi-4 FP8: more room under load', 'Caché KV FP8 en Phi-4 FP8: más margen bajo carga'),
      base: 'phi-4-fp8',
      cand: 'phi-4-fp8-fp8kv',
      deltas: [
        { metric: L('Time per report', 'Tiempo por informe'), value: -13.5, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -13, unit: '%', better: 'down' },
        { metric: L('Quality score', 'Puntuación de calidad'), value: 0, unit: 'pts', better: 'up' },
        { metric: L('Tokens/s, 16 users (random prompts)', 'Tokens/s, 16 usuarios (prompts aleatorios)'), value: 49.4, unit: '%', better: 'up' },
      ],
      verdict: L('Halving the KV cache lets twice as many requests share the card: 49% more throughput at 16 users and half the waiting time, with the same quality.', 'Reducir la caché KV a la mitad deja compartir la tarjeta al doble de peticiones: un 49 % más de rendimiento con 16 usuarios y la mitad de espera, con la misma calidad.'),
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
  /** 37 paired comparisons ran (4 REJECT, 33 INCONCLUSIVE, 0 ACCEPT; Holm over 444 tests); the three whose runs are left out are dropped here. */
  ab: [
    { candidate: 'Qwen3-30B-A3B 2507 AWQ (stelterlab)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -70, lo: -86.1, hi: -51.1, unit: 'pts', p: 0.107, n: 15, reps: [1, 1], prec: [-22.1, -49.6, 7.2] },
    { candidate: 'Qwen3-30B-A3B 2507 AWQ (cpatonn)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -25, lo: -48.9, hi: -2.8, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-4.4, -27.3, 16.7] },
    { candidate: 'Qwen3-30B-A3B Thinking 2507 AWQ', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -24.4, lo: -41.1, hi: -9.4, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [25.5, 11.6, 39.2] },
    { candidate: 'Qwen3-30B-A3B AWQ (cognitivecomputations)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -23.3, lo: -41.1, hi: -6.7, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-15.2, -30.4, -1] },
    { candidate: 'Qwen3-8B AWQ, FP8 KV', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -10, lo: -20, hi: -0.6, unit: 'pts', p: 1, n: 15, reps: [1, 3], prec: [-2.6, -17.1, 13.6] },
    { candidate: 'Qwen3-30B-A3B GPTQ, FP8 KV', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -8.9, lo: -21.1, hi: 2.2, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-9.6, -20.1, 0.7] },
    { candidate: 'Qwen2.5-14B FP8, FP8 KV', baseline: 'Qwen2.5-14B FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -5, lo: -15, hi: 5.6, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [4.9, -2.3, 12.9] },
    { candidate: 'Qwen3-30B-A3B GPTQ, FP8 KV, 16k', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -4.4, lo: -11.7, hi: 2.8, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-0.1, -14.4, 14.7] },
    { candidate: 'Qwen3-30B-A3B GPTQ, no prefix cache', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -3.3, lo: -20, hi: 11.1, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-4.2, -18, 8.4] },
    { candidate: 'Qwen3-30B-A3B GPTQ, n-gram', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.8, lo: -11.1, hi: 3.3, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [5.6, -10.6, 19.9] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV, 32k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.2, lo: -6.7, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-5.2, -14.7, 1.8] },
    { candidate: 'Qwen2.5-14B AWQ, FP8 KV', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: 0, hi: 6.7, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [19.4, 0, 52.8] },
    { candidate: 'Qwen2.5-7B AWQ, no prefix cache', baseline: 'Qwen2.5-7B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: -3.3, hi: 10, unit: 'pts', p: 1, n: 30, reps: [2, 1], prec: [5.3, -5.3, 18.4] },
    { candidate: 'Qwen2.5-7B AWQ, n-gram', baseline: 'Qwen2.5-7B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: -3.3, hi: 10, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [1.8, -12.3, 16.7] },
    { candidate: 'Qwen3-4B AWQ, FP8 KV', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -1.7, lo: -15, hi: 15.6, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-5.8, -19.2, 6] },
    { candidate: 'Phi-4 FP8, FP8 KV', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -1.7, lo: -5, hi: 0, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [7.9, 0.9, 15.2] },
    { candidate: 'Phi-4 FP8, no prefix cache', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.7, lo: 0, hi: 5, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-0.1, -6.2, 5.2] },
    { candidate: 'Phi-4 FP8, n-gram', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.1, lo: 0, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [2.8, -4.7, 10.4] },
    { candidate: 'Qwen2.5-7B BF16, n-gram', baseline: 'Qwen2.5-7B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -0.6, lo: -5, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-10.6, -21.1, 0.6] },
    { candidate: 'Qwen2.5-7B BF16, no prefix cache', baseline: 'Qwen2.5-7B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -0.6, lo: -5, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-5.2, -14.6, 4.2] },
    { candidate: 'Qwen3-8B AWQ, no prefix cache', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 3], prec: [0, 0, 0] },
    { candidate: 'Qwen3-8B AWQ, n-gram', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 3], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV, n-gram', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-1.9, -7.1, 3.2] },
    { candidate: 'Qwen3-14B AWQ, 32k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0.4, 0, 1.2] },
    { candidate: 'Qwen3-14B AWQ, n-gram', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-0.6, -3.9, 2.6] },
    { candidate: 'Qwen3-14B AWQ, no prefix cache', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'gpt-oss-20b MXFP4, 16k', baseline: 'gpt-oss-20b MXFP4', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [18.8, 0, 56.2] },
    { candidate: 'Qwen3-4B AWQ, no prefix cache', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'Qwen3-4B AWQ, n-gram', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [-0.9, -2.7, 0] },
    { candidate: 'Qwen2.5-14B AWQ, no prefix cache', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'Qwen2.5-14B AWQ, n-gram', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, 8k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, draft model', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 1], prec: [0, 0, 0] },
  ],
};

export const benchData: Record<string, BenchData> = { auditpro: auditproBench };
