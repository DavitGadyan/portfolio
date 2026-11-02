import type { Localized } from '@/lib/content/types';

/**
 * "How do LLMs rank content?": relative citation rate by content format, as reported in KIME's "How to Structure
 * Content for LLM Extraction: A GEO Guide for 2026" (Apr 2026) from a 2025 analysis of 10,000 AI citations. An
 * unstructured prose paragraph is the 1.0× baseline. Shown under the AEO and GEO maps; rows are sorted by rate.
 */
export const citationRates = {
  heading: { en: 'How do LLMs rank content?', es: '¿Cómo clasifican el contenido los LLM?' } as Localized<string>,
  intro: {
    en: 'Large language models cite some formats far more than others. Relative citation rate by content format, from the 2025 analysis of 10,000 AI citations reported in KIME\'s 2026 GEO guide; an unstructured prose paragraph is the 1.0× baseline.',
    es: 'Los grandes modelos de lenguaje citan algunos formatos mucho más que otros. Tasa de cita relativa por formato de contenido, según el análisis de 2025 sobre 10.000 citas de IA que recoge la guía de GEO de KIME de 2026; un párrafo de prosa sin estructura es la referencia de 1,0×.',
  } as Localized<string>,
  columns: {
    format: { en: 'Content format', es: 'Formato de contenido' },
    rate: { en: 'Relative citation rate', es: 'Tasa de cita relativa' },
    bestFor: { en: 'Best for', es: 'Ideal para' },
  } as Record<'format' | 'rate' | 'bestFor', Localized<string>>,
  baseline: { en: 'baseline', es: 'referencia' } as Localized<string>,
  caption: {
    en: 'Source: KIME, "How to Structure Content for LLM Extraction: A GEO Guide for 2026" (Apr 2026), reporting a 2025 citation-pattern analysis. Multipliers are relative to unstructured prose on the same data.',
    es: 'Fuente: KIME, «How to Structure Content for LLM Extraction: A GEO Guide for 2026» (abr. 2026), que recoge un análisis de patrones de cita de 2025. Los multiplicadores son relativos a la prosa sin estructura con los mismos datos.',
  } as Localized<string>,
  rows: [
    { id: 'table', rate: 4.2, format: { en: 'Table', es: 'Tabla' }, bestFor: { en: 'Multi-attribute comparisons, pricing, feature matrices', es: 'Comparativas de varios atributos, precios, matrices de funcionalidades' } },
    { id: 'answer-first', rate: 3.1, format: { en: 'Answer-first paragraph', es: 'Párrafo que responde primero' }, bestFor: { en: 'Definitional and conceptual questions', es: 'Preguntas de definición y conceptuales' } },
    { id: 'numbered-list', rate: 2.7, format: { en: 'Numbered list', es: 'Lista numerada' }, bestFor: { en: 'Step-by-step processes, ranked recommendations', es: 'Procesos paso a paso, recomendaciones ordenadas' } },
    { id: 'bullet-list', rate: 1.8, format: { en: 'Bullet list', es: 'Lista con viñetas' }, bestFor: { en: 'Feature enumeration, unordered options', es: 'Enumeración de funcionalidades, opciones sin orden' } },
    { id: 'prose', rate: 1.0, format: { en: 'Prose paragraph (unstructured)', es: 'Párrafo de prosa (sin estructura)' }, bestFor: { en: 'Narrative or editorial framing', es: 'Narrativa o enfoque editorial' } },
  ] as { id: string; rate: number; format: Localized<string>; bestFor: Localized<string> }[],
};
