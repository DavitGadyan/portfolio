import type { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'David Gadyan — Full-Stack AI Engineer',
    short_name: 'David Gadyan',
    description: 'Full-Stack AI Engineer in Barcelona: AI integration, AI ERP/SaaS, databases, DevOps, security and AI marketing.',
    start_url: withBasePath('/'),
    display: 'browser',
    background_color: '#2b2c2f',
    theme_color: '#1a1a1a',
    lang: 'en',
    icons: [{ src: withBasePath('/icon.png'), sizes: '435x436', type: 'image/png' }, { src: withBasePath('/apple-icon.png'), sizes: '180x180', type: 'image/png' }],
  };
}
