import type { Localized } from '@/lib/content/types';

/**
 * Measured benchmark data behind `<Bench id="auditpro" />` on the Audit Pro case study. Every figure comes from the
 * auditpro.ai repo's results/index.json (synthetic IFRS reports, one RTX 4090 on Vast.ai at $0.415/h, vLLM 0.34, AIPerf 0.13),
 * relayed from the project's own session on 2026-11-23 (final report). 76 of the 89 variants completed; five are left out
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

/** Requests/s a run serves while meeting the latency SLO (see auditproGoodput). */
export type Goodput = { cap: number; rps: number; tok: number; ttft95?: number; itl?: number; cs: number[] };

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
  goodput?: Record<string, Goodput>;
};

const L = (en: string, es: string): Localized<string> => ({ en, es });

/** Closed-loop AIPerf sweeps (4,000 random tokens in, 600 out, streaming, straight to vLLM) for the runs drawn on the load chart. */
export const auditproCurves: Record<string, CurvePoint[]> = {
  'qwen3-14b-fp8-fp8kv': [{ c: 1, tok: 50.3, user: 55.0, rps: 0.084, ttft: 1025.4, ttft95: 1027.1, itl: 18.18, e2e: 11.9, e2e95: 11.9 }, { c: 2, tok: 91.3, user: 51.6, rps: 0.152, ttft: 1520.4, ttft95: 1998.9, itl: 19.39, e2e: 13.1, e2e95: 13.1 }, { c: 4, tok: 154.3, user: 45.1, rps: 0.257, ttft: 2256.9, ttft95: 2563.6, itl: 22.18, e2e: 15.5, e2e95: 15.6 }, { c: 8, tok: 212.6, user: 34.4, rps: 0.354, ttft: 3038.7, ttft95: 11682.2, itl: 29.03, e2e: 20.2, e2e95: 30.0 }, { c: 16, tok: 216.4, user: 33.9, rps: 0.361, ttft: 23431.6, ttft95: 35241.3, itl: 29.46, e2e: 40.9, e2e95: 53.1 }],
  'qwen3-14b-awq-suffix': [{ c: 1, tok: 74.2, user: 83.6, rps: 0.124, ttft: 946.0, ttft95: 950.8, itl: 11.96, e2e: 8.1, e2e95: 9.0 }, { c: 2, tok: 140.0, user: 81.0, rps: 0.233, ttft: 979.8, ttft95: 982.6, itl: 12.34, e2e: 8.4, e2e95: 10.0 }, { c: 4, tok: 176.9, user: 50.1, rps: 0.295, ttft: 998.9, ttft95: 1952.2, itl: 19.96, e2e: 13.3, e2e95: 16.4 }, { c: 8, tok: 216.1, user: 28.5, rps: 0.360, ttft: 1094.2, ttft95: 3849.4, itl: 35.07, e2e: 22.2, e2e95: 27.5 }, { c: 16, tok: 229.8, user: 18.6, rps: 0.383, ttft: 8033.9, ttft95: 15784.6, itl: 53.76, e2e: 40.8, e2e95: 51.1 }],
  'qwen3-14b-awq-eagle3': [{ c: 1, tok: 66.7, user: 74.8, rps: 0.111, ttft: 960.3, ttft95: 963.6, itl: 13.37, e2e: 9.0, e2e95: 9.7 }, { c: 2, tok: 118.8, user: 66.8, rps: 0.198, ttft: 1008.5, ttft95: 1915.0, itl: 14.98, e2e: 10.1, e2e95: 10.8 }, { c: 4, tok: 163.5, user: 44.8, rps: 0.273, ttft: 1017.0, ttft95: 2003.0, itl: 22.34, e2e: 14.4, e2e95: 15.9 }, { c: 8, tok: 223.8, user: 29.9, rps: 0.373, ttft: 1056.8, ttft95: 3977.7, itl: 33.47, e2e: 21.2, e2e95: 24.6 }, { c: 16, tok: 223.5, user: 22.8, rps: 0.373, ttft: 14542.8, ttft95: 25314.8, itl: 43.83, e2e: 42.7, e2e95: 53.4 }],
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

/** Goodput derived from the closed-loop sweeps: the highest tested concurrency whose TTFT p95 <= 2 s and ITL p50 <= 50 ms, with the
 * requests/s and output tokens/s at that point (cs = concurrencies tested). cap 0 = no tested point met the SLO. */
export const auditproGoodput: Record<string, Goodput> = {
  'deepseek-r1-distill-14b-awq': { cap: 2, rps: 0.204, tok: 122.1, ttft95: 1892, itl: 14.05, cs: [1, 2, 4, 8, 16] },
  'gpt-oss-20b-ctx16k': { cap: 4, rps: 0.762, tok: 393.6, ttft95: 91, itl: 8.72, cs: [1, 4] },
  'gpt-oss-20b-mxfp4': { cap: 4, rps: 0.766, tok: 393.3, ttft95: 88, itl: 8.7, cs: [1, 4] },
  'granite-3.1-1b-a400m': { cap: 4, rps: 1.503, tok: 867.0, ttft95: 73, itl: 4.34, cs: [1, 4] },
  'granite-3.1-3b-a800m': { cap: 4, rps: 0.882, tok: 528.3, ttft95: 68, itl: 7.45, cs: [1, 4] },
  'granite-4.0-h-tiny': { cap: 4, rps: 0.744, tok: 443.2, ttft95: 171, itl: 8.73, cs: [1, 4] },
  'lfm2-8b-a1b': { cap: 4, rps: 0.754, tok: 451.5, ttft95: 92, itl: 8.67, cs: [1, 4] },
  'llama3.1-8b-awq': { cap: 4, rps: 0.542, tok: 322.6, ttft95: 1778, itl: 10.22, cs: [1, 2, 4, 8, 16] },
  'phi-4-fp8': { cap: 4, rps: 0.238, tok: 141.7, ttft95: 1572, itl: 25.95, cs: [1, 2, 4, 8, 16] },
  'phi-4-fp8-fp8kv': { cap: 4, rps: 0.259, tok: 153.9, ttft95: 1561, itl: 23.67, cs: [1, 2, 4, 8, 16] },
  'phi-4-fp8-ngram': { cap: 4, rps: 0.181, tok: 108.1, ttft95: 1804, itl: 35.75, cs: [1, 2, 4, 8, 16] },
  'phi-4-fp8-noprefix': { cap: 4, rps: 0.24, tok: 142.9, ttft95: 1865, itl: 25.85, cs: [1, 2, 4, 8, 16] },
  'qwen1.5-moe-a2.7b-gptq': { cap: 4, rps: 0.717, tok: 157.7, ttft95: 653, itl: 28.52, cs: [1, 4] },
  'qwen2.5-14b-awq': { cap: 1, rps: 0.118, tok: 46.3, ttft95: 970, itl: 13.1, cs: [1, 4] },
  'qwen2.5-14b-awq-fp8kv': { cap: 1, rps: 0.126, tok: 49.0, ttft95: 977, itl: 11.8, cs: [1, 4] },
  'qwen2.5-14b-awq-ngram': { cap: 4, rps: 0.246, tok: 107.0, ttft95: 1991, itl: 32.89, cs: [1, 4] },
  'qwen2.5-14b-awq-noprefix': { cap: 1, rps: 0.118, tok: 46.3, ttft95: 969, itl: 13.1, cs: [1, 4] },
  'qwen2.5-14b-fp8': { cap: 4, rps: 0.227, tok: 116.5, ttft95: 1653, itl: 29.01, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-14b-fp8-fp8kv': { cap: 4, rps: 0.244, tok: 129.3, ttft95: 1645, itl: 27.61, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-awq': { cap: 8, rps: 1.09, tok: 646.2, ttft95: 1942, itl: 11.64, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-awq-ngram': { cap: 8, rps: 0.665, tok: 394.2, ttft95: 554, itl: 20.15, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-awq-noprefix': { cap: 8, rps: 0.908, tok: 538.6, ttft95: 1953, itl: 12.06, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-bf16': { cap: 8, rps: 0.543, tok: 323.9, ttft95: 1894, itl: 22.81, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-bf16-ngram': { cap: 8, rps: 0.419, tok: 249.8, ttft95: 1886, itl: 30.9, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-bf16-noprefix': { cap: 8, rps: 0.543, tok: 324.0, ttft95: 1888, itl: 22.81, cs: [1, 2, 4, 8, 16] },
  'qwen2.5-7b-fp8': { cap: 8, rps: 0.824, tok: 491.3, ttft95: 1300, itl: 16.11, cs: [1, 2, 4, 8, 16] },
  'qwen3-14b-awq': { cap: 1, rps: 0.124, tok: 73.9, ttft95: 958, itl: 11.94, cs: [1, 4] },
  'qwen3-14b-awq-ctx32k': { cap: 1, rps: 0.124, tok: 74.3, ttft95: 947, itl: 11.89, cs: [1, 4] },
  'qwen3-14b-awq-ctx8k': { cap: 2, rps: 0.213, tok: 127.5, ttft95: 1853, itl: 13.36, cs: [1, 2, 4, 8, 16] },
  'qwen3-14b-awq-draft': { cap: 2, rps: 0.179, tok: 107.1, ttft95: 1089, itl: 16.96, cs: [1, 2, 4, 8, 16] },
  'qwen3-14b-awq-eagle3': { cap: 2, rps: 0.198, tok: 118.8, ttft95: 1915, itl: 14.98, cs: [1, 2, 4, 8, 16] },
  'qwen3-14b-awq-fp8kv': { cap: 1, rps: 0.13, tok: 78.2, ttft95: 952, itl: 11.2, cs: [1, 4] },
  'qwen3-14b-awq-fp8kv-ctx32k': { cap: 1, rps: 0.13, tok: 78.2, ttft95: 956, itl: 11.2, cs: [1, 4] },
  'qwen3-14b-awq-fp8kv-ngram': { cap: 1, rps: 0.127, tok: 76.3, ttft95: 960, itl: 11.75, cs: [1, 4] },
  'qwen3-14b-awq-ngram': { cap: 4, rps: 0.223, tok: 134.0, ttft95: 1951, itl: 28.36, cs: [1, 4] },
  'qwen3-14b-awq-noprefix': { cap: 1, rps: 0.124, tok: 74.2, ttft95: 947, itl: 11.91, cs: [1, 4] },
  'qwen3-14b-awq-suffix': { cap: 4, rps: 0.295, tok: 176.9, ttft95: 1952, itl: 19.96, cs: [1, 2, 4, 8, 16] },
  'qwen3-14b-fp8-fp8kv': { cap: 2, rps: 0.152, tok: 91.3, ttft95: 1999, itl: 19.39, cs: [1, 2, 4, 8, 16] },
  'qwen3-30b-a3b-2507-awq-cpatonn': { cap: 4, rps: 0.554, tok: 332.3, ttft95: 1122, itl: 10.71, cs: [1, 4] },
  'qwen3-30b-a3b-2507-awq-stelterlab': { cap: 4, rps: 0.569, tok: 341.2, ttft95: 1114, itl: 10.4, cs: [1, 4] },
  'qwen3-30b-a3b-awq-cogcomp': { cap: 4, rps: 0.559, tok: 335.1, ttft95: 1126, itl: 10.64, cs: [1, 4] },
  'qwen3-30b-a3b-gptq': { cap: 4, rps: 0.571, tok: 342.6, ttft95: 1196, itl: 10.31, cs: [1, 4] },
  'qwen3-30b-a3b-gptq-ctx16k': { cap: 4, rps: 0.639, tok: 383.3, ttft95: 1243, itl: 9.11, cs: [1, 4] },
  'qwen3-30b-a3b-gptq-fp8kv': { cap: 4, rps: 0.639, tok: 383.4, ttft95: 1243, itl: 9.12, cs: [1, 4] },
  'qwen3-30b-a3b-gptq-ngram': { cap: 4, rps: 0.365, tok: 218.9, ttft95: 705, itl: 17.78, cs: [1, 4] },
  'qwen3-30b-a3b-gptq-noprefix': { cap: 4, rps: 0.571, tok: 342.8, ttft95: 1112, itl: 10.35, cs: [1, 4] },
  'qwen3-30b-a3b-thinking-2507-awq': { cap: 4, rps: 0.55, tok: 330.3, ttft95: 1132, itl: 10.77, cs: [1, 4] },
  'qwen3-4b-awq': { cap: 4, rps: 0.707, tok: 424.2, ttft95: 1188, itl: 8.14, cs: [1, 4] },
  'qwen3-4b-awq-fp8kv': { cap: 4, rps: 1.108, tok: 665.0, ttft95: 86, itl: 5.9, cs: [1, 4] },
  'qwen3-4b-awq-ngram': { cap: 4, rps: 0.534, tok: 320.4, ttft95: 654, itl: 11.87, cs: [1, 4] },
  'qwen3-4b-awq-noprefix': { cap: 4, rps: 0.706, tok: 424.0, ttft95: 1212, itl: 8.13, cs: [1, 4] },
  'qwen3-8b-awq': { cap: 4, rps: 0.503, tok: 301.8, ttft95: 1785, itl: 11.1, cs: [1, 2, 4, 8, 16] },
  'qwen3-8b-awq-fp8kv': { cap: 4, rps: 0.785, tok: 471.1, ttft95: 93, itl: 8.38, cs: [1, 4] },
  'qwen3-8b-awq-ngram': { cap: 4, rps: 0.41, tok: 246.0, ttft95: 1091, itl: 15.34, cs: [1, 4] },
  'qwen3-8b-awq-noprefix': { cap: 4, rps: 0.503, tok: 301.8, ttft95: 1786, itl: 11.1, cs: [1, 4] },
};

export const auditproBench: BenchData = {
  counts: { total: 89, completed: 76, skipped: 0, failed: 13 },
  curves: auditproCurves,
  goodput: auditproGoodput,
  runs: [
    { id: 'qwen3-14b-fp8-fp8kv', label: 'Qwen3-14B FP8, FP8 KV', params: '14.8', quant: 'FP8', quality: 70.8, recall: 72, precision: 58.4, numeric: 70, page: 90.6, grounding: 66.2, cost: 1.83, auditS: 60.8, tok: { 1: 50, 2: 91, 4: 154, 8: 213, 16: 216 }, vram: 20.5, pick: 'quality', docs: 30 },
    { id: 'qwen3-14b-fp8-ngram', label: 'Qwen3-14B FP8, n-gram', params: '14.8', quant: 'FP8', quality: 70.2, recall: 70.7, precision: 60.3, numeric: 70, page: 87.4, grounding: 65.3, cost: 1.47, auditS: 49.2, tok: { 1: 40, 4: 107, 8: 107, 16: 107 }, vram: 20.5, docs: 30 },
    { id: 'qwen3-14b-fp8-noprefix', label: 'Qwen3-14B FP8, no prefix cache', params: '14.8', quant: 'FP8', quality: 69.2, recall: 70.7, precision: 59.4, numeric: 70, page: 85.3, grounding: 62.2, cost: 2.12, auditS: 70.2, tok: { 1: 49, 4: 145, 8: 139, 16: 140 }, vram: 20.5, docs: 30 },
    { id: 'qwen3-14b-awq-ngram-d8', label: 'Qwen3-14B AWQ, n-gram depth 8', params: '14.8', quant: 'AWQ', quality: 69.1, recall: 70.7, precision: 55.6, numeric: 60, page: 92.7, grounding: 72.4, cost: 1.37, auditS: 46.4, tok: { 1: 54, 4: 122, 8: 148, 16: 154 }, vram: 20.3, docs: 30 },
    { id: 'qwen3-14b-awq-plainkernel', label: 'Qwen3-14B AWQ, plain AWQ kernel', params: '14.8', quant: 'AWQ', quality: 69.1, recall: 70.7, precision: 55.6, numeric: 60, page: 92.7, grounding: 72.4, cost: 1.32, auditS: 44.6, tok: { 1: 74, 4: 198, 8: 272, 16: 309 }, vram: 21.3, docs: 30 },
    { id: 'qwen3-14b-awq-seqs64', label: 'Qwen3-14B AWQ, max 64 sequences', params: '14.8', quant: 'AWQ', quality: 69.1, recall: 70.7, precision: 56.1, numeric: 60, page: 93.5, grounding: 71.3, cost: 1.36, auditS: 46, tok: { 1: 74, 4: 198, 8: 272, 16: 306 }, vram: 20.5, docs: 30 },
    { id: 'qwen3-14b-awq-mbt8192', label: 'Qwen3-14B AWQ, prefill chunk 8192', params: '14.8', quant: 'AWQ', quality: 69, recall: 70.7, precision: 55.6, numeric: 60, page: 92.7, grounding: 71.6, cost: 1.34, auditS: 45, tok: { 1: 74, 4: 198, 8: 273, 16: 308 }, vram: 21.8, docs: 30 },
    { id: 'qwen3-14b-fp8', label: 'Qwen3-14B FP8', params: '14.8', quant: 'FP8', quality: 69, recall: 70.7, precision: 58.9, numeric: 70, page: 84, grounding: 63, cost: 2.01, auditS: 67.4, tok: { 1: 49, 4: 145, 8: 169, 16: 172 }, vram: 21.3, docs: 30 },
    { id: 'qwen3-14b-awq-eager', label: 'Qwen3-14B AWQ, eager (no CUDA graphs)', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.3, numeric: 60, page: 92.7, grounding: 72.1, cost: 3.41, auditS: 114.1, tok: { 1: 27, 4: 96, 8: 167, 16: 244 }, vram: 21.1, docs: 30 },
    { id: 'qwen3-14b-awq-eagle3', label: 'Qwen3-14B AWQ, EAGLE-3', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.3, numeric: 60, page: 92.7, grounding: 72.1, cost: 0.88, auditS: 29.9, tok: { 1: 67, 2: 119, 4: 164, 8: 224, 16: 224 }, vram: 20.4, docs: 30 },
    { id: 'qwen3-14b-awq-mbt1024', label: 'Qwen3-14B AWQ, prefill chunk 1024', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.7, numeric: 60, page: 93.4, grounding: 70.9, cost: 1.36, auditS: 45.8, tok: { 1: 74, 4: 198, 8: 271, 16: 303 }, vram: 20.3, docs: 30 },
    { id: 'qwen3-14b-awq-ngram-d2', label: 'Qwen3-14B AWQ, n-gram depth 2', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.3, numeric: 60, page: 92.7, grounding: 72.1, cost: 1.22, auditS: 41.3, tok: { 1: 55, 4: 137, 8: 188, 16: 197 }, vram: 20.3, docs: 30 },
    { id: 'qwen3-14b-awq-suffix', label: 'Qwen3-14B AWQ, suffix decoding', params: '14.8', quant: 'AWQ', quality: 68.6, recall: 69.3, precision: 55.3, numeric: 60, page: 92.7, grounding: 72.1, cost: 0.69, auditS: 23.5, tok: { 1: 74, 2: 140, 4: 177, 8: 216, 16: 230 }, vram: 20.4, pick: 'cost', docs: 30 },
    { id: 'qwen3-4b-bf16-noprefix', label: 'Qwen3-4B BF16, no prefix cache', params: '4.0', quant: 'BF16', quality: 53.3, recall: 50.7, precision: 26.4, numeric: 50, page: 66.9, grounding: 85.3, cost: 1.25, auditS: 42.6, tok: { 1: 88, 4: 260, 8: 399, 16: 540 }, vram: 21.1, docs: 30 },
    { id: 'qwen3-4b-bf16', label: 'Qwen3-4B BF16', params: '4.0', quant: 'BF16', quality: 52.3, recall: 48, precision: 25.3, numeric: 53.3, page: 64.6, grounding: 82.9, cost: 1.28, auditS: 42.2, tok: { 1: 88, 4: 260, 8: 400, 16: 541 }, vram: 21.3, docs: 30 },
    { id: 'qwen3-4b-bf16-ngram', label: 'Qwen3-4B BF16, n-gram', params: '4.0', quant: 'BF16', quality: 51.5, recall: 49.3, precision: 25.3, numeric: 48.3, page: 60.5, grounding: 85.7, cost: 0.88, auditS: 29.1, tok: { 1: 63, 4: 226, 8: 310, 16: 380 }, vram: 20.7, docs: 30 },
    { id: 'qwen3-4b-bf16-fp8kv', label: 'Qwen3-4B BF16, FP8 KV', params: '4.0', quant: 'BF16', quality: 46.5, recall: 46.7, precision: 25.1, numeric: 43.3, page: 53.2, grounding: 71.9, cost: 1.14, auditS: 37.4, tok: { 1: 93, 4: 287, 8: 465, 16: 674 }, vram: 21.1, docs: 30 },
    { id: 'qwen3-8b-bf16-fp8kv', label: 'Qwen3-8B BF16, FP8 KV', params: '8.2', quant: 'BF16', quality: 39.8, recall: 24, precision: 47.8, numeric: 20, page: 91.3, grounding: 35.3, cost: 3.32, auditS: 105.8, tok: { 1: 54, 4: 176, 8: 294, 16: 333 }, vram: 20.7, docs: 30 },
    { id: 'qwen3-8b-bf16-ngram', label: 'Qwen3-8B BF16, n-gram', params: '8.2', quant: 'BF16', quality: 37.9, recall: 25.3, precision: 35.4, numeric: 25, page: 75.4, grounding: 46.4, cost: 2.11, auditS: 68.8, tok: { 1: 42, 4: 147, 8: 168, 16: 171 }, vram: 20.7, docs: 30 },
    { id: 'qwen3-14b-awq-ctx8k', label: 'Qwen3-14B AWQ, 8k', params: '14.8', quant: 'AWQ', quality: 69.1, recall: 70.7, precision: 56.1, numeric: 60, page: 93.5, grounding: 71.3, cost: 1.36, auditS: 45.9, tok: { 1: 74, 2: 128, 4: 198, 8: 272, 16: 301 }, weights: 9.3, loadS: 86, vram: 20.5, docs: 30 },
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
    { id: 'qwen3-14b-awq-ctx32k', label: 'Qwen3-14B AWQ, 32k', params: '14.8', quant: 'AWQ', quality: 68.8, recall: 70.3, precision: 61.1, numeric: 56.7, page: 92.6, grounding: 68.4, cost: 1.43, auditS: 44.1, tok: { 1: 74, 4: 198, 8: 272, 16: 309 }, weights: 9.3, loadS: 84, vram: 20.5 },
    { id: 'qwen3-14b-awq', label: 'Qwen3-14B AWQ', params: '14.8', quant: 'AWQ', quality: 68.5, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 67.6, cost: 1.41, auditS: 44, tok: { 1: 74, 4: 198, 8: 271, 16: 308 }, weights: 9.3, loadS: 84, vram: 20.5 },
    { id: 'qwen3-14b-awq-ngram', label: 'Qwen3-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.21, auditS: 38.5, tok: { 1: 55, 4: 134, 8: 176, 16: 176 }, weights: 9.3, loadS: 136, vram: 20.5 },
    { id: 'qwen3-14b-awq-noprefix', label: 'Qwen3-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 68.2, recall: 70.3, precision: 60.4, numeric: 56.7, page: 92.5, grounding: 65.8, cost: 1.49, auditS: 46, tok: { 1: 74, 4: 198, 8: 272, 16: 301 }, weights: 9.3, loadS: 46, vram: 21.3 },
    { id: 'qwen3-14b-awq-fp8kv', label: 'Qwen3-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 66.8, recall: 70.3, precision: 58.9, numeric: 56.7, page: 87.5, grounding: 63.4, cost: 1.4, auditS: 44.1, tok: { 1: 78, 4: 216, 8: 306, 16: 383 }, weights: 9.3, loadS: 82, vram: 20.5 },
    { id: 'qwen3-14b-awq-fp8kv-ngram', label: 'Qwen3-14B AWQ, FP8 KV, n-gram', params: '14.8', quant: 'AWQ', quality: 66.6, recall: 70.3, precision: 58.2, numeric: 56.7, page: 85.5, grounding: 65, cost: 0.97, auditS: 32.4, tok: { 1: 76, 4: 199, 8: 260, 16: 286 }, weights: 9.3, loadS: 110, vram: 20.5 },
    { id: 'qwen3-14b-awq-fp8kv-ctx32k', label: 'Qwen3-14B AWQ, FP8 KV, 32k', params: '14.8', quant: 'AWQ', quality: 65.5, recall: 67.6, precision: 54.2, numeric: 56.7, page: 84.7, grounding: 69, cost: 1.31, auditS: 41.3, tok: { 1: 78, 4: 216, 8: 306, 16: 383 }, weights: 9.3, loadS: 92, vram: 20.5 },
    { id: 'qwen3-30b-a3b-gptq-ngram', label: 'Qwen3-30B-A3B GPTQ, n-gram', params: '30.5', quant: 'GPTQ', quality: 65, recall: 81.1, precision: 58.7, numeric: 73.3, page: 76, grounding: 19, cost: 1.45, auditS: 48.3, tok: { 1: 72, 4: 219, 8: 260, 16: 269 }, weights: 15.8, loadS: 160, vram: 21.1, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-noprefix', label: 'Qwen3-30B-A3B GPTQ, no prefix cache', params: '30.5', quant: 'GPTQ', quality: 65, recall: 83.8, precision: 52.1, numeric: 73.3, page: 74.5, grounding: 23.9, cost: 1.37, auditS: 44.3, tok: { 1: 151, 4: 343, 8: 484, 16: 471 }, weights: 15.8, loadS: 72, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq', label: 'Qwen3-30B-A3B GPTQ', params: '30.5', quant: 'GPTQ', quality: 64.3, recall: 83.8, precision: 51.1, numeric: 73.3, page: 73.9, grounding: 21.4, cost: 1.57, auditS: 49.9, tok: { 1: 151, 4: 343, 8: 483, 16: 480 }, weights: 15.8, loadS: 112, vram: 21.7, groundingCaveat: true, pick: 'recall' },
    { id: 'deepseek-r1-distill-14b-awq', label: 'DeepSeek-R1-Distill-14B AWQ', params: '14.8', quant: 'AWQ', quality: 63.5, recall: 70.7, precision: 59.4, numeric: 86.7, page: 71.1, grounding: 16.4, cost: 1.48, auditS: 46.8, tok: { 1: 72, 2: 122, 4: 189, 8: 257, 16: 265 }, weights: 9.3, loadS: 98, vram: 20.4, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-thinking-2507-awq', label: 'Qwen3-30B-A3B Thinking 2507 AWQ', params: '30.5', quant: 'AWQ', quality: 62.3, recall: 59.5, precision: 81.1, numeric: 60, page: 86.5, grounding: 21.6, cost: 1.78, auditS: 58.7, tok: { 1: 147, 4: 330, 8: 413, 16: 415 }, weights: 16.9, loadS: 98, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-ctx16k', label: 'Qwen3-30B-A3B GPTQ, FP8 KV, 16k', params: '30.5', quant: 'GPTQ', quality: 60.6, recall: 78.4, precision: 48.5, numeric: 66.7, page: 74.7, grounding: 19.2, cost: 1.15, auditS: 39, tok: { 1: 169, 4: 383, 8: 557, 16: 735 }, weights: 15.8, loadS: 126, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-30b-a3b-gptq-fp8kv', label: 'Qwen3-30B-A3B GPTQ, FP8 KV', params: '30.5', quant: 'GPTQ', quality: 56.7, recall: 73, precision: 43.7, numeric: 66.7, page: 65.5, grounding: 19.1, cost: 1.19, auditS: 37.9, tok: { 1: 169, 4: 383, 8: 555, 16: 733 }, weights: 15.8, loadS: 114, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq', label: 'Qwen3-8B AWQ', params: '8.2', quant: 'AWQ', quality: 56.3, recall: 30.6, precision: 64.3, numeric: 62.9, page: 82.7, grounding: 61.8, auditS: 35.2, tok: { 1: 113, 2: 194, 4: 302, 8: 413, 16: 500 }, weights: 5.7, loadS: 51, vram: 21.3 },
    { id: 'qwen3-30b-a3b-awq-cogcomp', label: 'Qwen3-30B-A3B AWQ (cognitivecomputations)', params: '30.5', quant: 'AWQ', quality: 53.9, recall: 62.2, precision: 40.3, numeric: 60, page: 71.4, grounding: 30, cost: 1.46, auditS: 47.9, tok: { 1: 150, 4: 335, 8: 470, 16: 463 }, weights: 15.7, loadS: 112, vram: 21.7 },
    { id: 'qwen3-30b-a3b-2507-awq-cpatonn', label: 'Qwen3-30B-A3B 2507 AWQ (cpatonn)', params: '30.5', quant: 'AWQ', quality: 52.6, recall: 59.5, precision: 49.1, numeric: 56.7, page: 73.6, grounding: 17, cost: 2.08, auditS: 67.6, tok: { 1: 147, 4: 332, 8: 415, 16: 418 }, weights: 16.9, loadS: 102, vram: 21.7, groundingCaveat: true },
    { id: 'qwen3-8b-awq-noprefix', label: 'Qwen3-8B AWQ, no prefix cache', params: '8.2', quant: 'AWQ', quality: 49.9, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 43.8, cost: 1.76, auditS: 54, tok: { 1: 113, 4: 302, 8: 414, 16: 500 }, weights: 5.7, loadS: 48, vram: 21.3 },
    { id: 'qwen3-8b-awq-ngram', label: 'Qwen3-8B AWQ, n-gram', params: '8.2', quant: 'AWQ', quality: 49.8, recall: 45.9, precision: 46.3, numeric: 46.7, page: 73.2, grounding: 42.9, cost: 1.25, auditS: 38.5, tok: { 1: 76, 4: 246, 8: 297, 16: 320 }, weights: 5.7, loadS: 98, vram: 20.7 },
    { id: 'qwen3-4b-awq-noprefix', label: 'Qwen3-4B AWQ, no prefix cache', params: '4.0', quant: 'AWQ', quality: 42.2, recall: 43.2, precision: 42, numeric: 33.3, page: 66, grounding: 28.6, cost: 0.67, auditS: 21.5, tok: { 1: 167, 4: 424, 8: 564, 16: 664 }, weights: 2.5, loadS: 82, vram: 21.1 },
    { id: 'qwen3-4b-awq', label: 'Qwen3-4B AWQ', params: '4.0', quant: 'AWQ', quality: 41.6, recall: 43.2, precision: 40.4, numeric: 33.3, page: 63.5, grounding: 29, cost: 0.62, auditS: 20, tok: { 1: 167, 4: 424, 8: 564, 16: 664 }, weights: 2.5, loadS: 40, vram: 21.3 },
    { id: 'qwen3-8b-awq-fp8kv', label: 'Qwen3-8B AWQ, FP8 KV', params: '8.2', quant: 'AWQ', quality: 41.5, recall: 35.1, precision: 44.1, numeric: 40, page: 67.6, grounding: 26.7, cost: 1.49, auditS: 48.5, tok: { 1: 122, 4: 471, 8: 484, 16: 610 }, weights: 5.7, loadS: 118, vram: 20.7 },
    { id: 'qwen3-4b-awq-ngram', label: 'Qwen3-4B AWQ, n-gram', params: '4.0', quant: 'AWQ', quality: 41.5, recall: 43.2, precision: 41.2, numeric: 33.3, page: 62.7, grounding: 27.9, cost: 0.55, auditS: 17.9, tok: { 1: 100, 4: 320, 8: 378, 16: 404 }, weights: 2.5, loadS: 92, vram: 20.8 },
    { id: 'llama3.1-8b-awq', label: 'Llama 3.1 8B AWQ', params: '8.0', quant: 'AWQ', quality: 39.6, recall: 40, precision: 50.8, numeric: 30, page: 65.1, grounding: 11, cost: 1.77, auditS: 58.2, tok: { 1: 122, 2: 210, 4: 323, 8: 438, 16: 528 }, weights: 5.3, loadS: 82, vram: 20.9 },
    { id: 'granite-4.0-h-tiny', label: 'Granite 4.0 H Tiny BF16', params: '6.9', quant: 'BF16', quality: 36.3, recall: 51.4, precision: 16, numeric: 13.3, page: 64.1, grounding: 36.2, cost: 1.78, auditS: 56.4, tok: { 1: 185, 4: 443, 8: 614, 16: 965 }, weights: 12.9, loadS: 180, vram: 21.2 },
    { id: 'qwen3-4b-awq-fp8kv', label: 'Qwen3-4B AWQ, FP8 KV', params: '4.0', quant: 'AWQ', quality: 35.4, recall: 35.1, precision: 34.1, numeric: 26.7, page: 59.1, grounding: 25.8, cost: 0.6, auditS: 19.1, tok: { 1: 185, 4: 665, 8: 706, 16: 875 }, weights: 2.5, loadS: 80, vram: 21.1 },
    { id: 'qwen3-30b-a3b-2507-awq-stelterlab', label: 'Qwen3-30B-A3B 2507 AWQ (stelterlab)', params: '30.5', quant: 'AWQ', quality: 27.3, recall: 16.2, precision: 37, numeric: 10, page: 70.4, grounding: 16.4, cost: 2.72, auditS: 83.8, tok: { 1: 150, 4: 341, 8: 482, 16: 474 }, weights: 15.6, loadS: 100, vram: 21.7, groundingCaveat: true },
    { id: 'qwen2.5-7b-awq-noprefix', label: 'Qwen2.5-7B AWQ, no prefix cache', params: '7.6', quant: 'AWQ', quality: 25.6, recall: 11.4, precision: 34.9, numeric: 10, page: 71.5, grounding: 16.5, cost: 0.91, auditS: 28.8, tok: { 1: 132, 2: 229, 4: 376, 8: 539, 16: 671 }, weights: 5.2, loadS: 52, vram: 21.1 },
    { id: 'granite-3.1-3b-a800m', label: 'Granite 3.1 3B-A800M BF16', params: '3.3', quant: 'BF16', quality: 25.5, recall: 32.4, precision: 22.7, numeric: 3.3, page: 69.2, grounding: 1, cost: 1.63, auditS: 52.1, tok: { 1: 240, 4: 528, 8: 729, 16: 1024 }, weights: 6.1, loadS: 94, vram: 21.4 },
    { id: 'gpt-oss-20b-ctx16k', label: 'gpt-oss-20b MXFP4, 16k', params: '21', quant: 'MXFP4', quality: 22.6, recall: 5.4, precision: 22.2, numeric: 6.7, page: 66.7, grounding: 35, cost: 4.3, auditS: 140.6, tok: { 1: 146, 4: 394, 8: 460, 16: 679 }, weights: 38.5, loadS: 74, vram: 20.8 },
    { id: 'gpt-oss-20b-mxfp4', label: 'gpt-oss-20b MXFP4', params: '21', quant: 'MXFP4', quality: 22.5, recall: 5.4, precision: 16.7, numeric: 6.7, page: 58.3, grounding: 50, cost: 4.12, auditS: 134.5, tok: { 1: 136, 4: 393, 8: 466, 16: 688 }, weights: 38.5, loadS: 82, vram: 20.8 },
    { id: 'qwen1.5-moe-a2.7b-gptq', label: 'Qwen1.5-MoE-A2.7B GPTQ', params: '14.3', quant: 'GPTQ', quality: 19.4, recall: 5.4, precision: 42.9, numeric: 3.3, page: 57.1, grounding: 0, cost: 2.53, auditS: 82.9, tok: { 1: 55, 4: 158, 8: 218, 16: 264 }, weights: 7.8, loadS: 86, vram: 21.2 },
    { id: 'lfm2-8b-a1b', label: 'LFM2-8B-A1B BF16', params: '8.3', quant: 'BF16', quality: 16.6, recall: 21.6, precision: 16, numeric: 3.3, page: 28.2, grounding: 13.1, cost: 3.35, auditS: 112.1, tok: { 1: 219, 4: 452, 8: 611, 16: 964 }, weights: 15.5, loadS: 88, vram: 22 },
    { id: 'qwen2.5-14b-awq-fp8kv', label: 'Qwen2.5-14B AWQ, FP8 KV', params: '14.8', quant: 'AWQ', quality: 14, recall: 5.4, precision: 25, numeric: 3.3, page: 33.3, grounding: 11.4, cost: 2.79, auditS: 87.5, tok: { 1: 49, 4: 113, 8: 173, 16: 206 }, weights: 9.3, loadS: 110, vram: 20.4 },
    { id: 'qwen2.5-14b-awq-noprefix', label: 'Qwen2.5-14B AWQ, no prefix cache', params: '14.8', quant: 'AWQ', quality: 5.8, recall: 2.7, precision: 7.7, numeric: 0, page: 7.7, grounding: 15.4, cost: 2.74, auditS: 83, tok: { 1: 46, 4: 121, 8: 176, 16: 182 }, weights: 9.3, loadS: 100, vram: 20.5 },
    { id: 'qwen2.5-14b-awq', label: 'Qwen2.5-14B AWQ', params: '14.8', quant: 'AWQ', quality: 5.7, recall: 2.7, precision: 7.1, numeric: 0, page: 7.1, grounding: 15.7, cost: 2.65, auditS: 79.7, tok: { 1: 46, 4: 121, 8: 177, 16: 181 }, weights: 9.3, loadS: 50, vram: 21.3 },
    { id: 'qwen2.5-14b-awq-ngram', label: 'Qwen2.5-14B AWQ, n-gram', params: '14.8', quant: 'AWQ', quality: 5.6, recall: 2.7, precision: 6.7, numeric: 0, page: 6.7, grounding: 16.7, cost: 1.9, auditS: 60.3, tok: { 1: 45, 4: 107, 8: 128, 16: 137 }, weights: 9.3, loadS: 98, vram: 20.4 },
    { id: 'granite-3.1-1b-a400m', label: 'Granite 3.1 1B-A400M BF16', params: '1.3', quant: 'BF16', quality: 0, recall: 0, precision: 0, numeric: 0, page: 0, grounding: 0, cost: 1.73, auditS: 56.8, tok: { 1: 384, 4: 867, 8: 1184, 16: 1728 }, weights: 2.5, loadS: 84, vram: 21.4 },
  ],
  techniques: [
    {
      id: 'spec',
      label: L('Speculative decoding on the real audits: time per report against plain Qwen3-14B AWQ (44.0 s)', 'Decodificación especulativa en las auditorías reales: tiempo por informe frente a Qwen3-14B AWQ sin más (44,0 s)'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-suffix',
      deltas: [
        { metric: L('Suffix decoding, depth 8', 'Decodificación por sufijos, profundidad 8'), value: -46.6, unit: '%', better: 'down' },
        { metric: L('EAGLE-3 head, depth 3', 'Cabeza EAGLE-3, profundidad 3'), value: -32, unit: '%', better: 'down' },
        { metric: L('Draft model Qwen3-0.6B, depth 5', 'Modelo borrador Qwen3-0.6B, profundidad 5'), value: -23.9, unit: '%', better: 'down' },
        { metric: L('n-gram, depth 4', 'n-gram, profundidad 4'), value: -12.5, unit: '%', better: 'down' },
        { metric: L('n-gram, depth 2', 'n-gram, profundidad 2'), value: -6.1, unit: '%', better: 'down' },
        { metric: L('n-gram, depth 8', 'n-gram, profundidad 8'), value: 5.5, unit: '%', better: 'down' },
      ],
      verdict: L('Suffix decoding nearly halves an audit (23.5 s, $0.69 per 1,000) with the same answers; drafting deeper than 4 n-gram tokens stops helping. In the random-token load test the same methods look 25–50% slower, so speculative decoding has to be measured on real prompts.', 'La decodificación por sufijos casi reduce a la mitad una auditoría (23,5 s, 0,69 $ por 1.000) con las mismas respuestas; proponer más de 4 tokens n-gram deja de ayudar. En la prueba de carga con tokens aleatorios los mismos métodos parecen un 25–50 % más lentos, así que la decodificación especulativa hay que medirla con prompts reales.'),
    },
    {
      id: 'quant-acc',
      label: L('What 4-bit costs: Qwen3-14B AWQ against FP8 (paired A/B, 15 reports)', 'Lo que cuestan los 4 bits: Qwen3-14B AWQ frente a FP8 (A/B emparejado, 15 informes)'),
      base: 'qwen3-14b-fp8',
      cand: 'qwen3-14b-awq',
      deltas: [
        { metric: L('Numeric accuracy (A/B, rejected)', 'Exactitud numérica (A/B, rechazado)'), value: -21.1, unit: 'pts', better: 'up' },
        { metric: L('Recall (not significant)', 'Recall (no significativo)'), value: -7.8, unit: 'pts', better: 'up' },
        { metric: L('Time per report', 'Tiempo por informe'), value: -34.7, unit: '%', better: 'down' },
        { metric: L('Cost per 1,000 audits', 'Coste por 1.000 auditorías'), value: -29.9, unit: '%', better: 'down' },
      ],
      verdict: L('AWQ is faster and cheaper and finds as many errors, but it gets more figures wrong: the A/B test rejected it on numeric accuracy (−21 points, CI −40 to −6). A throughput benchmark alone would never show this, and it is why production serves FP8.', 'AWQ es más rápido y barato y encuentra los mismos errores, pero falla más cifras: la prueba A/B lo rechazó por exactitud numérica (−21 puntos, IC de −40 a −6). Un benchmark de rendimiento por sí solo nunca lo mostraría, y por eso producción sirve FP8.'),
    },
    {
      id: 'engine',
      label: L('Engine settings on Qwen3-14B AWQ: time per report', 'Ajustes del motor en Qwen3-14B AWQ: tiempo por informe'),
      base: 'qwen3-14b-awq',
      cand: 'qwen3-14b-awq-eager',
      deltas: [
        { metric: L('Eager mode, no CUDA graphs', 'Modo eager, sin CUDA graphs'), value: 159.3, unit: '%', better: 'down' },
        { metric: L('Prefill chunk 1024 tokens', 'Fragmento de prefill de 1024 tokens'), value: 4.1, unit: '%', better: 'down' },
        { metric: L('Prefill chunk 8192 tokens', 'Fragmento de prefill de 8192 tokens'), value: 2.3, unit: '%', better: 'down' },
        { metric: L('Max 64 sequences', 'Máximo de 64 secuencias'), value: 4.5, unit: '%', better: 'down' },
        { metric: L('Plain AWQ kernel instead of Marlin', 'Kernel AWQ simple en lugar de Marlin'), value: 1.4, unit: '%', better: 'down' },
      ],
      verdict: L('CUDA graphs matter: without them an audit takes 2.6 times as long (114 s). Chunked prefill, the sequence cap and the context length change nothing measurable at this load.', 'Los CUDA graphs importan: sin ellos una auditoría tarda 2,6 veces más (114 s). El prefill por fragmentos, el límite de secuencias y la longitud de contexto no cambian nada medible con esta carga.'),
    },
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
      verdict: L('A quarter faster per report and 31% cheaper, recall unchanged, 1.9 quality points lower; suffix decoding later went further.', 'Un cuarto más rápido por informe y un 31 % más barato, mismo recall y 1,9 puntos menos de calidad; la decodificación por sufijos fue después más lejos.'),
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
  /** 53 paired comparisons ran (5 REJECT, 48 INCONCLUSIVE, 0 ACCEPT; Holm across the family); the three whose runs are left out are dropped here. AWQ vs FP8 shows its numeric-accuracy row, the metric it was rejected on. */
  ab: [
    { candidate: 'Qwen3-30B-A3B 2507 AWQ (stelterlab)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -70, lo: -86.1, hi: -51.1, unit: 'pts', p: 0.154, n: 15, reps: [2, 2], prec: [-22.1, -49.6, 7.2] },
    { candidate: 'Qwen3-30B-A3B 2507 AWQ (cpatonn)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -25, lo: -48.9, hi: -2.8, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-4.4, -27.3, 16.7] },
    { candidate: 'Qwen3-30B-A3B Thinking 2507 AWQ', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -24.4, lo: -41.1, hi: -9.4, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [25.5, 11.6, 39.2] },
    { candidate: 'Qwen3-30B-A3B AWQ (cognitivecomputations)', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'REJECT', metric: L('Recall', 'Recall'), delta: -23.3, lo: -41.1, hi: -6.7, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-15.2, -30.4, -1] },
    { candidate: 'Qwen3-14B AWQ', baseline: 'Qwen3-14B FP8', verdict: 'REJECT', metric: L('Numeric accuracy', 'Exactitud numérica'), delta: -21.1, lo: -40, hi: -5.6, unit: 'pts', p: 1, n: 15, reps: [2, 1], prec: [-5.4, -23.3, 6.6] },
    { candidate: 'Qwen3-8B AWQ, FP8 KV', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -10, lo: -20, hi: -0.6, unit: 'pts', p: 1, n: 15, reps: [2, 3], prec: [-2.6, -17.1, 13.6] },
    { candidate: 'Qwen3-30B-A3B GPTQ, FP8 KV', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -8.9, lo: -21.1, hi: 2.2, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-9.6, -20.1, 0.7] },
    { candidate: 'Qwen3-4B BF16, FP8 KV', baseline: 'Qwen3-4B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 6.7, lo: -7.8, hi: 23.1, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [0.7, -6.9, 8] },
    { candidate: 'Qwen2.5-14B FP8, FP8 KV', baseline: 'Qwen2.5-14B FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -5, lo: -15, hi: 5.6, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [4.9, -2.3, 12.9] },
    { candidate: 'Qwen3-30B-A3B GPTQ, FP8 KV, 16k', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -4.4, lo: -11.7, hi: 2.8, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-0.1, -14.4, 14.7] },
    { candidate: 'Qwen3-30B-A3B GPTQ, no prefix cache', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -3.3, lo: -20, hi: 11.1, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-4.2, -18, 8.4] },
    { candidate: 'Qwen3-30B-A3B GPTQ, n-gram', baseline: 'Qwen3-30B-A3B GPTQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.8, lo: -11.1, hi: 3.3, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [5.6, -10.6, 19.9] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV, 32k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -2.2, lo: -6.7, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-5.2, -14.7, 1.8] },
    { candidate: 'Qwen2.5-14B AWQ, FP8 KV', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: 0, hi: 6.7, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [19.4, 0, 52.8] },
    { candidate: 'Qwen2.5-7B AWQ, no prefix cache', baseline: 'Qwen2.5-7B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: -3.3, hi: 10, unit: 'pts', p: 1, n: 30, reps: [2, 1], prec: [5.3, -5.3, 18.4] },
    { candidate: 'Qwen2.5-7B AWQ, n-gram', baseline: 'Qwen2.5-7B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: -3.3, hi: 10, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [1.8, -12.3, 16.7] },
    { candidate: 'Qwen3-4B BF16, no prefix cache', baseline: 'Qwen3-4B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 2.2, lo: -3.3, hi: 10, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [0.6, -2.1, 3.6] },
    { candidate: 'Qwen3-4B AWQ, FP8 KV', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -1.7, lo: -15, hi: 15.6, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-5.8, -19.2, 6] },
    { candidate: 'Phi-4 FP8, FP8 KV', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -1.7, lo: -5, hi: 0, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [7.9, 0.9, 15.2] },
    { candidate: 'Phi-4 FP8, no prefix cache', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.7, lo: 0, hi: 5, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-0.1, -6.2, 5.2] },
    { candidate: 'Phi-4 FP8, n-gram', baseline: 'Phi-4 FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.1, lo: 0, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [2.8, -4.7, 10.4] },
    { candidate: 'Qwen3-14B FP8, FP8 KV', baseline: 'Qwen3-14B FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.1, lo: 0, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [3.8, -2.8, 11] },
    { candidate: 'Qwen3-4B BF16, n-gram', baseline: 'Qwen3-4B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 1.1, lo: -5.6, hi: 10, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-1.2, -4.3, 1.9] },
    { candidate: 'Qwen2.5-7B BF16, n-gram', baseline: 'Qwen2.5-7B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -0.6, lo: -5, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-10.6, -21.1, 0.6] },
    { candidate: 'Qwen2.5-7B BF16, no prefix cache', baseline: 'Qwen2.5-7B BF16', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: -0.6, lo: -5, hi: 3.3, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [-5.2, -14.6, 4.2] },
    { candidate: 'Qwen3-8B AWQ, no prefix cache', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 3], prec: [0, 0, 0] },
    { candidate: 'Qwen3-8B AWQ, n-gram', baseline: 'Qwen3-8B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 3], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV, n-gram', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-1.9, -7.1, 3.2] },
    { candidate: 'Qwen3-14B AWQ, 32k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0.4, 0, 1.2] },
    { candidate: 'Qwen3-14B AWQ, n-gram', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, FP8 KV', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-0.6, -3.9, 2.6] },
    { candidate: 'Qwen3-14B AWQ, no prefix cache', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0, 0, 0] },
    { candidate: 'gpt-oss-20b MXFP4, 16k', baseline: 'gpt-oss-20b MXFP4', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [18.8, 0, 56.2] },
    { candidate: 'Qwen3-4B AWQ, no prefix cache', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-4B AWQ, n-gram', baseline: 'Qwen3-4B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [-0.9, -2.7, 0] },
    { candidate: 'Qwen2.5-14B AWQ, no prefix cache', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen2.5-14B AWQ, n-gram', baseline: 'Qwen2.5-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [2, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, 8k', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, draft model', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, eager (no CUDA graphs)', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, EAGLE-3', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, prefill chunk 1024', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, prefill chunk 8192', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, n-gram depth 2', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, n-gram depth 8', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, plain AWQ kernel', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, max 64 sequences', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B AWQ, suffix decoding', baseline: 'Qwen3-14B AWQ', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 15, reps: [1, 2], prec: [0, 0, 0] },
    { candidate: 'Qwen3-14B FP8, n-gram', baseline: 'Qwen3-14B FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [4, -0, 9.2] },
    { candidate: 'Qwen3-14B FP8, no prefix cache', baseline: 'Qwen3-14B FP8', verdict: 'INCONCLUSIVE', metric: L('Recall', 'Recall'), delta: 0, lo: 0, hi: 0, unit: 'pts', p: 1, n: 30, reps: [1, 1], prec: [1.6, -1.5, 6.1] },
  ],
};

export const benchData: Record<string, BenchData> = { auditpro: auditproBench };
