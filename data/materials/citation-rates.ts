import type { TableBlock } from './types';

/**
 * "How do LLMs rank content?": relative citation rate by content format, as reported in KIME's "How to Structure
 * Content for LLM Extraction: A GEO Guide for 2026" (Apr 2026) from a 2025 analysis of 10,000 AI citations. An
 * unstructured prose paragraph is the 1.0× baseline. Shown under the AEO and GEO maps; rows are sorted by rate.
 */
export const citationRates: TableBlock = {
  id: 'citation-rates',
  heading: { en: 'How do LLMs rank content?', es: '¿Cómo clasifican el contenido los LLM?' },
  intro: {
    en: 'Large language models cite some formats far more than others. Relative citation rate by content format, from the 2025 analysis of 10,000 AI citations reported in KIME\'s 2026 GEO guide; an unstructured prose paragraph is the 1.0× baseline.',
    es: 'Los grandes modelos de lenguaje citan algunos formatos mucho más que otros. Tasa de cita relativa por formato de contenido, según el análisis de 2025 sobre 10.000 citas de IA que recoge la guía de GEO de KIME de 2026; un párrafo de prosa sin estructura es la referencia de 1,0×.',
  },
  columns: [{ en: 'Content format', es: 'Formato de contenido' }, { en: 'Relative citation rate', es: 'Tasa de cita relativa' }, { en: 'Best for', es: 'Ideal para' }],
  rows: [
    { id: 'table', bar: 4.2, cells: [{ en: 'Table', es: 'Tabla' }, { en: '4.2×', es: '4,2×' }, { en: 'Multi-attribute comparisons, pricing, feature matrices', es: 'Comparativas de varios atributos, precios, matrices de funcionalidades' }] },
    { id: 'answer-first', bar: 3.1, cells: [{ en: 'Answer-first paragraph', es: 'Párrafo que responde primero' }, { en: '3.1×', es: '3,1×' }, { en: 'Definitional and conceptual questions', es: 'Preguntas de definición y conceptuales' }] },
    { id: 'numbered-list', bar: 2.7, cells: [{ en: 'Numbered list', es: 'Lista numerada' }, { en: '2.7×', es: '2,7×' }, { en: 'Step-by-step processes, ranked recommendations', es: 'Procesos paso a paso, recomendaciones ordenadas' }] },
    { id: 'bullet-list', bar: 1.8, cells: [{ en: 'Bullet list', es: 'Lista con viñetas' }, { en: '1.8×', es: '1,8×' }, { en: 'Feature enumeration, unordered options', es: 'Enumeración de funcionalidades, opciones sin orden' }] },
    { id: 'prose', bar: 1, muted: true, note: { en: 'baseline', es: 'referencia' }, cells: [{ en: 'Prose paragraph (unstructured)', es: 'Párrafo de prosa (sin estructura)' }, { en: '1.0×', es: '1,0×' }, { en: 'Narrative or editorial framing', es: 'Narrativa o enfoque editorial' }] },
  ],
  caption: {
    en: 'Source: KIME, "How to Structure Content for LLM Extraction: A GEO Guide for 2026" (Apr 2026), reporting a 2025 citation-pattern analysis. Multipliers are relative to unstructured prose on the same data.',
    es: 'Fuente: KIME, «How to Structure Content for LLM Extraction: A GEO Guide for 2026» (abr. 2026), que recoge un análisis de patrones de cita de 2025. Los multiplicadores son relativos a la prosa sin estructura con los mismos datos.',
  },
};
