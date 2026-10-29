import { readRaw } from './loader';
import { toISODate } from './loader';
import type { PolicyPage } from './types';
import type { Locale } from '@/lib/i18n/config';

export function getPolicyPage(locale: Locale, slug: PolicyPage['slug']): PolicyPage {
  const doc = readRaw('pages', locale, slug);
  if (!doc) throw new Error(`[content] missing content/${locale}/pages/${slug}.mdx`);
  const d = doc.data;
  return {
    slug,
    locale,
    title: String(d.title ?? slug),
    description: String(d.description ?? ''),
    lastmod: toISODate(d.lastmod) || toISODate(d.date),
    body: doc.content,
  };
}
