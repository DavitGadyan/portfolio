import type { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'David Gadyan — EXPERT-VETTED AI Engineer | Data Scientist | AI Agent | Generative AI | SaaS',
    short_name: 'David Gadyan',
    description: 'Expert-Vetted AI Engineer and Data Scientist in Barcelona: AI agents, generative AI, full-stack SaaS, DevOps, security and AI marketing.',
    start_url: withBasePath('/'),
    display: 'browser',
    background_color: '#2b2c2f',
    theme_color: '#1a1a1a',
    lang: 'en',
    icons: [{ src: withBasePath('/icon.png'), sizes: '435x436', type: 'image/png' }, { src: withBasePath('/apple-icon.png'), sizes: '180x180', type: 'image/png' }],
  };
}
