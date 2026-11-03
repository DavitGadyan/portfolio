import type { CategoryId, Localized } from '@/lib/content/types';
import shortLinks from './short-links.json';

/** A Loom recording shown under /materials/videos/. Titles, durations and dates come from Loom (oEmbed + share page, fetched 2026-11-03). */
export interface Video {
  /** Slug of the page: /materials/videos/<id>/ */
  id: string;
  /** Loom recording id (https://www.loom.com/share/<loomId>); loom.com/embed loads only when the visitor presses play. */
  loomId: string;
  title: Localized<string>;
  /** Meta description of the page; the "area covers" part is the blurb of the mapped portfolio categories. */
  description: Localized<string>;
  /** A still frame of the recording (first clear frame of Loom's animated thumbnail) under public/images. */
  poster: string;
  /** Seconds, from Loom's oEmbed. */
  duration: number;
  /** When the recording was created on Loom (ISO 8601). */
  uploadDate: string;
  /** Portfolio capabilities the video introduces; their blurbs and projects are listed under the player. */
  categories: CategoryId[];
}

export const VIDEOS_PATH = '/materials/videos/';
export const videoPath = (id: string) => `${VIDEOS_PATH}${id}/`;
export const loomShareUrl = (v: Video) => `https://www.loom.com/share/${v.loomId}`;
export const loomEmbedUrl = (v: Video) => `https://www.loom.com/embed/${v.loomId}`;

/** Short path of a video page for proposals ('/GenAI'), from data/short-links.json; scripts/postbuild.mjs writes the redirect page. */
export function shortLink(v: Video): string | undefined {
  const hit = Object.entries(shortLinks.links as Record<string, string>).find(([, to]) => to === videoPath(v.id));
  return hit?.[0].replace(/\/$/, '');
}

/** 143.8 s → '2:24' */
export function fmtDuration(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
/** 143.8 s → 'PT2M24S' (schema.org / <time dateTime>) */
export function isoDuration(seconds: number): string {
  const s = Math.round(seconds);
  return `PT${Math.floor(s / 60)}M${s % 60}S`;
}

export const videos: Video[] = [
  {
    id: 'data-science-ml-dl', loomId: 'd1563886351c496ba76813ed3bd6b8df', duration: 143.77, uploadDate: '2026-10-22T15:10:44Z',
    poster: '/images/materials/videos/data-science-ml-dl.jpg', categories: ['data-science-ml', 'computer-vision'],
    title: { en: 'Data Science, Machine Learning & Deep Learning', es: 'Ciencia de datos, machine learning y deep learning' },
    description: {
      en: 'Data science, machine learning and deep learning: a short video introduction by David Gadyan, recorded for client proposals. The area covers forecasting, classification, recommenders, NLP and statistical analysis shipped as APIs, plus detection, OCR and segmentation.',
      es: 'Ciencia de datos, machine learning y deep learning: breve vídeo de presentación de David Gadyan, grabado para propuestas a clientes. El área abarca predicción, clasificación, recomendadores, PLN y análisis estadístico entregados como APIs, además de detección, OCR y segmentación.',
    },
  },
  {
    id: 'genai', loomId: '92cd7dca2c74443cad0aefc50876b5f6', duration: 169.67, uploadDate: '2026-10-22T16:37:11Z',
    poster: '/images/materials/videos/genai.jpg', categories: ['ai-agents', 'computer-vision'],
    title: { en: 'Generative AI', es: 'IA generativa' },
    description: {
      en: 'Generative AI: a short video introduction by David Gadyan, recorded for client proposals. The area covers LLM integration, RAG, agentic workflows, MCP tools and automations, and generative imagery and video.',
      es: 'IA generativa: breve vídeo de presentación de David Gadyan, grabado para propuestas a clientes. El área abarca integración de LLM, RAG, flujos agénticos, herramientas MCP y automatizaciones, e imágenes y vídeo generativos.',
    },
  },
  {
    id: 'algo-trading', loomId: '4d4a98a5a00b4429bd2757b073ac8264', duration: 100.07, uploadDate: '2026-10-22T17:35:40Z',
    poster: '/images/materials/videos/algo-trading.jpg', categories: ['finance-quant'],
    title: { en: 'Algorithmic Trading', es: 'Trading algorítmico' },
    description: {
      en: 'Algorithmic trading: a short video introduction by David Gadyan, recorded for client proposals. The area covers trading systems, factor analysis and statistical research on market data.',
      es: 'Trading algorítmico: breve vídeo de presentación de David Gadyan, grabado para propuestas a clientes. El área abarca sistemas de trading, análisis factorial e investigación estadística sobre datos de mercado.',
    },
  },
  {
    id: 'ai-marketing', loomId: 'c61ecaf1219e40a7b9dd11c8d1e489b7', duration: 199.27, uploadDate: '2026-10-22T18:45:18Z',
    poster: '/images/materials/videos/ai-marketing.jpg', categories: ['ai-marketing'],
    title: { en: 'AI Marketing & Sales', es: 'Marketing y ventas con IA' },
    description: {
      en: 'AI marketing and sales: a short video introduction by David Gadyan, recorded for client proposals. The area covers GA4/GTM/Ads conversion tracking, technical SEO, GEO/AEO and AI-generated creative.',
      es: 'Marketing y ventas con IA: breve vídeo de presentación de David Gadyan, grabado para propuestas a clientes. El área abarca seguimiento de conversiones con GA4/GTM/Ads, SEO técnico, GEO/AEO y creatividades generadas con IA.',
    },
  },
  {
    id: 'full-stack-saas', loomId: 'ed148683520b46e99ba9be7dddfc98bb', duration: 176.57, uploadDate: '2026-10-22T19:57:26Z',
    poster: '/images/materials/videos/full-stack-saas.jpg', categories: ['fullstack-uiux', 'ai-erp-saas', 'cloud-devops-llmops'],
    title: { en: 'Building Scalable SaaS and AI Systems End to End', es: 'SaaS y sistemas de IA escalables de principio a fin' },
    description: {
      en: 'Building scalable SaaS and AI systems end to end: a short video introduction by David Gadyan, recorded for client proposals. The area covers Next.js/React front ends, FastAPI/Node back ends, multi-tenant platforms with AI inside the workflow, and Docker, Kubernetes, AWS/GCP and CI/CD.',
      es: 'SaaS y sistemas de IA escalables de principio a fin: breve vídeo de presentación de David Gadyan, grabado para propuestas a clientes. El área abarca frontends en Next.js/React, backends en FastAPI/Node, plataformas multiusuario con la IA dentro del flujo de trabajo, y Docker, Kubernetes, AWS/GCP y CI/CD.',
    },
  },
];
