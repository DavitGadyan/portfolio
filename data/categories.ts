import type { Category } from '@/lib/content/types';

export const categories: Category[] = [
  { id: 'ai-agents', order: 1, label: { en: 'AI & Agents', es: 'IA y agentes' },
    blurb: { en: 'LLM integration, RAG, agentic workflows, MCP tools and automations.', es: 'Integración de LLM, RAG, flujos agénticos, herramientas MCP y automatizaciones.' } },
  { id: 'fullstack-uiux', order: 2, label: { en: 'Full-Stack & UI/UX', es: 'Full-Stack y UI/UX' },
    blurb: { en: 'Next.js/React front ends, FastAPI/Node back ends, dashboards and interfaces people use.', es: 'Frontends en Next.js/React, backends en FastAPI/Node, dashboards e interfaces que la gente usa.' } },
  { id: 'ai-erp-saas', order: 3, label: { en: 'AI ERP & SaaS', es: 'ERP y SaaS con IA' },
    blurb: { en: 'Multi-tenant platforms with AI inside the workflow: CRM connectors, scoring, reporting.', es: 'Plataformas multiusuario con la IA dentro del flujo de trabajo: conectores CRM, puntuación, informes.' } },
  { id: 'data-science-ml', order: 4, label: { en: 'Data Science & ML', es: 'Ciencia de datos y ML' },
    blurb: { en: 'Forecasting, classification, recommenders, NLP and statistical analysis shipped as APIs.', es: 'Predicción, clasificación, recomendadores, PLN y análisis estadístico entregados como APIs.' } },
  { id: 'computer-vision', order: 5, label: { en: 'Computer Vision & Generative Media', es: 'Visión artificial y medios generativos' },
    blurb: { en: 'Detection, OCR, segmentation and generative imagery and video.', es: 'Detección, OCR, segmentación e imágenes y vídeo generativos.' } },
  { id: 'databases-data-eng', order: 6, label: { en: 'Databases & Data Engineering', es: 'Bases de datos e ingeniería de datos' },
    blurb: { en: 'Schema design, Postgres/MySQL/MongoDB/Supabase/BigQuery, pipelines and large-scale scraping.', es: 'Diseño de esquemas, Postgres/MySQL/MongoDB/Supabase/BigQuery, pipelines y scraping a gran escala.' } },
  { id: 'cloud-devops-llmops', order: 7, label: { en: 'Cloud, DevOps & LLMOps', es: 'Cloud, DevOps y LLMOps' },
    blurb: { en: 'Docker, Kubernetes, AWS/GCP, CI/CD, monitoring and model operations.', es: 'Docker, Kubernetes, AWS/GCP, CI/CD, monitorización y operación de modelos.' } },
  { id: 'security-compliance', order: 8, label: { en: 'Security & Compliance', es: 'Seguridad y cumplimiento' },
    blurb: { en: 'Verification workflows, hardening and GDPR/HIPAA-aware data handling.', es: 'Flujos de verificación, hardening y tratamiento de datos conforme al RGPD/HIPAA.' } },
  { id: 'ai-marketing', order: 9, label: { en: 'AI Marketing & Analytics', es: 'Marketing con IA y analítica' },
    blurb: { en: 'GA4/GTM/Ads conversion tracking, technical SEO, GEO/AEO and AI-generated creative.', es: 'Seguimiento de conversiones con GA4/GTM/Ads, SEO técnico, GEO/AEO y creatividades generadas con IA.' } },
  { id: 'finance-quant', order: 10, label: { en: 'Finance & Quant', es: 'Finanzas y quant' },
    blurb: { en: 'Trading systems, factor analysis and statistical research on market data.', es: 'Sistemas de trading, análisis factorial e investigación estadística sobre datos de mercado.' } },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<Category['id'], Category>;
