import type { MindMap, MindMapGroup } from './types';
import { L } from './types';
import { snowflake } from './snowflake';
import { databricks } from './databricks';
import { llms } from './llms';
import { gateway } from './gateway';
import { gpu } from './gpu';
import { serving } from './serving';
import { llmops } from './llmops';

export type { MindMap, MindNode, NodeKind, MapSection, MindMapGroup } from './types';
export { NODE_KINDS } from './types';
export const MINDMAPS_PATH = '/materials/mindmaps/';
export const mapPath = (id: string) => `${MINDMAPS_PATH}${id}/`;

/**
 * The sections of /materials/mindmaps/, in study order: the three LLM deployment topics first (foundations and hardware,
 * serving, operations), then the data platforms. Every map belongs to exactly one section (tests/unit/mindmaps.test.ts).
 */
export const mindmapGroups: MindMapGroup[] = [
  { id: 'foundations', icon: 'microchip',
    title: L('LLM foundations and hardware', 'Fundamentos de LLM y hardware'),
    intro: L('Which model to run and what it needs: frontier APIs against open weights, VRAM sizing, then the GPU itself, attention, the KV cache and the links between GPUs.', 'Qué modelo ejecutar y qué necesita: API frontier frente a pesos abiertos, dimensionado de VRAM y después la propia GPU, la atención, la caché KV y los enlaces entre GPU.'),
    maps: ['llms', 'gpu'] },
  { id: 'serving', icon: 'rocket',
    title: L('LLM serving and inference', 'Servir LLM e inferencia'),
    intro: L('How a model answers fast and cheaply: serving engines, batching, KV cache memory, quantization, speculative decoding with EAGLE-3, parallelism, prefill and decode split, and the metrics that prove it.', 'Cómo responde un modelo rápido y barato: motores de inferencia, batching, memoria de la caché KV, cuantización, decodificación especulativa con EAGLE-3, paralelismo, separación de prefill y decode, y las métricas que lo demuestran.'),
    maps: ['serving'] },
  { id: 'ops', icon: 'shield-check',
    title: L('LLMOps and AI gateways', 'LLMOps y gateways de IA'),
    intro: L('How an LLM application stays reliable in production: evaluation, observability, guardrails, releases, cost control and governance, then the gateway that puts keys, limits and routing in one place.', 'Cómo se mantiene fiable una aplicación con LLM en producción: evaluación, observabilidad, guardrails, despliegues, control de costes y gobernanza, y después el gateway que reúne claves, límites y enrutamiento.'),
    maps: ['llmops', 'gateway'] },
  { id: 'data', icon: 'database',
    title: L('Data and ML platforms', 'Plataformas de datos y ML'),
    intro: L('Where the data behind the models lives: Snowflake and Databricks, from architecture to pipelines, AI functions and machine learning.', 'Dónde viven los datos detrás de los modelos: Snowflake y Databricks, desde la arquitectura hasta los pipelines, las funciones de IA y el machine learning.'),
    maps: ['snowflake', 'databricks'] },
];

const all: MindMap[] = [snowflake, databricks, llms, gateway, gpu, serving, llmops];
/** Every map, in section order (= order of the tiles and of the map switcher). */
export const mindmaps: MindMap[] = mindmapGroups.flatMap((g) => g.maps.map((id) => all.find((m) => m.id === id)!));
/** Maps that exist but sit in no section (must stay empty; the unit test checks it). */
export const ungroupedMaps = all.filter((m) => !mindmaps.includes(m)).map((m) => m.id);
export const groupOf = (id: string) => mindmapGroups.find((g) => g.maps.includes(id));
