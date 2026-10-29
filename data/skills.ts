import type { Skill } from '@/lib/content/types';

/** Short labels on purpose: the tools behind each skill are shown in the stack graph (Value Proposition & Stack). */
export const skills: Skill[] = [
  { label: { en: 'AI Integration & Agentic Systems', es: 'Integración de IA y sistemas agénticos' }, pct: 95 },
  { label: { en: 'Generative AI & LLMs', es: 'IA generativa y LLM' }, pct: 95 },
  { label: { en: 'Data Science & Machine Learning', es: 'Ciencia de datos y machine learning' }, pct: 95 },
  { label: { en: 'Full-Stack Development', es: 'Desarrollo full-stack' }, pct: 90 },
  { label: { en: 'Web Scraping & Data Pipelines', es: 'Web scraping y pipelines de datos' }, pct: 90 },
  { label: { en: 'Databases & Data Engineering', es: 'Bases de datos e ingeniería de datos' }, pct: 85 },
  { label: { en: 'AI Marketing & Analytics', es: 'Marketing con IA y analítica' }, pct: 85 },
  { label: { en: 'UI/UX & Interactive Dashboards', es: 'UI/UX y dashboards interactivos' }, pct: 80 },
  { label: { en: 'Deep Learning & Computer Vision', es: 'Deep learning y visión artificial' }, pct: 80 },
  { label: { en: 'Cloud, Deployment & DevOps', es: 'Cloud, despliegue y DevOps' }, pct: 80 },
  { label: { en: 'AIOps & LLMOps', es: 'AIOps y LLMOps' }, pct: 75 },
  { label: { en: 'Security & Compliance', es: 'Seguridad y cumplimiento' }, pct: 70 },
];
