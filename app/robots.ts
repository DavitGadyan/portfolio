import type { MetadataRoute } from 'next';
import { absUrl } from '@/lib/site';

export const dynamic = 'force-static';

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/thank-you/', '/es/thank-you/', '/not-found-page/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: absUrl('/sitemap.xml'),
    host: absUrl('/').replace(/\/$/, ''),
  };
}
