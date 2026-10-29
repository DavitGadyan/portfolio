import type { MetadataRoute } from 'next';
import { absUrl } from '@/lib/site';
import { locales } from '@/lib/i18n/config';
import { localizePath } from '@/lib/locale-path';
import { getProjects } from '@/lib/content/projects';
import { getPosts } from '@/lib/content/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: string, priority = 0.7): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: absUrl(localizePath(path, locale)),
      lastModified: lastModified ? new Date(`${lastModified}T00:00:00Z`) : undefined,
      priority,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      alternates: { languages: { en: absUrl(localizePath(path, 'en')), es: absUrl(localizePath(path, 'es')), 'x-default': absUrl(localizePath(path, 'en')) } },
    }));
  return [
    ...entry('/', undefined, 1),
    ...entry('/portfolio/', undefined, 0.8),
    ...entry('/blog/', undefined, 0.8),
    ...getProjects('en').flatMap((p) => entry(`/portfolio/${p.slug}/`, p.lastmod ?? p.date)),
    ...getPosts('en').flatMap((p) => entry(`/blog/${p.slug}/`, p.lastmod ?? p.date, 0.6)),
    ...entry('/cookies/', undefined, 0.2),
    ...entry('/privacy/', undefined, 0.2),
  ];
}
