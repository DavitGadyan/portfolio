import type { TableBlock } from './types';

/** "Content structure for SEO vs AI search": Victoria Olsina's comparison (Oct 2026), shown under the SEO map. */
export const seoVsAi: TableBlock = {
  id: 'seo-vs-ai',
  heading: { en: 'Content structure for SEO vs AI search', es: 'Estructura de contenido para SEO frente a búsqueda con IA' },
  intro: {
    en: 'Traditional SEO and AI search overlap but reward different outcomes: SEO asks whether a page can be found, AI search asks whether a section can be lifted out and trusted on its own. One page has to serve both.',
    es: 'El SEO tradicional y la búsqueda con IA se solapan, pero premian resultados distintos: el SEO pregunta si una página se puede encontrar; la búsqueda con IA, si una sección se puede extraer y resulta fiable por sí sola. Una misma página tiene que servir a ambos.',
  },
  columns: [{ en: 'Priority', es: 'Prioridad' }, { en: 'Traditional SEO', es: 'SEO tradicional' }, { en: 'AI search', es: 'Búsqueda con IA' }],
  rows: [
    { id: 'signal', cells: [{ en: 'Main signal', es: 'Señal principal' }, { en: 'Crawlability and relevance', es: 'Rastreabilidad y relevancia' }, { en: 'Extractability and clarity', es: 'Extraibilidad y claridad' }] },
    { id: 'rewards', cells: [{ en: 'Rewards', es: 'Premia' }, { en: 'Depth and coverage', es: 'Profundidad y cobertura' }, { en: 'Precision and self-contained blocks', es: 'Precisión y bloques autónomos' }] },
    { id: 'behaviour', cells: [{ en: 'User behaviour', es: 'Comportamiento del usuario' }, { en: 'Visits the page', es: 'Visita la página' }, { en: 'Often gets the answer without a click', es: 'A menudo obtiene la respuesta sin un clic' }] },
    { id: 'job', cells: [{ en: 'Structure job', es: 'Tarea de la estructura' }, { en: 'Hierarchy and keyword clarity', es: 'Jerarquía y claridad de palabras clave' }, { en: 'Quotable, standalone sections', es: 'Secciones citables y autónomas' }] },
  ],
  caption: {
    en: 'Source: Victoria Olsina, "Content Structure for SEO and LLMs (2026): How to Get Cited" (updated Oct 2026). Modern structure must support both: readable and well organised, and explicit enough to stand alone when reused by AI.',
    es: 'Fuente: Victoria Olsina, «Content Structure for SEO and LLMs (2026): How to Get Cited» (act. oct. 2026). La estructura moderna debe servir a ambos: legible y bien organizada, y lo bastante explícita para sostenerse sola cuando la IA la reutiliza.',
  },
};
