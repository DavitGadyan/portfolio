import type { Localized } from '@/lib/content/types';

/** Roles typed out under the name in the hero (see components/home/Typewriter.tsx). The first one is server-rendered. */
export const occupations: Localized<string[]> = {
  en: [
    'Data Scientist',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Computer Vision',
    'Full Stack',
    'UX/UI Designer',
    'Database Management',
    'DevOps + MLOps + AIOps + LLMOps',
    'Algorithmic Trading',
    'Security & Compliance',
    'Marketing',
  ],
  es: [
    'Científico de datos',
    'Machine Learning',
    'Deep Learning',
    'IA generativa',
    'Visión artificial',
    'Full Stack',
    'Diseñador UX/UI',
    'Gestión de bases de datos',
    'DevOps + MLOps + AIOps + LLMOps',
    'Trading algorítmico',
    'Seguridad y cumplimiento',
    'Marketing',
  ],
};
