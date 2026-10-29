import { listSlugs, readRaw, readingMinutes } from './loader';
import { assertSlug, parsePostInvariant, parsePostLocalized } from './validate';
import type { Post } from './types';
import type { Locale } from '@/lib/i18n/config';

const cache = new Map<string, Post>();

export function getPostSlugs(): string[] {
  return listSlugs('blog', 'en');
}

export function getPost(locale: Locale, slug: string): Post {
  const key = `${locale}/${slug}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const en = readRaw('blog', 'en', slug);
  if (!en) throw new Error(`[content] missing content/en/blog/${slug}.mdx`);
  assertSlug(slug, en.file);
  const invariant = parsePostInvariant(en.data, en.file);
  const loc = locale === 'en' ? en : readRaw('blog', 'es', slug);
  if (!loc) throw new Error(`[content] missing content/es/blog/${slug}.mdx (every EN post needs an ES sibling)`);
  const localized = parsePostLocalized(loc.data, loc.file, locale);
  const post: Post = {
    ...invariant,
    ...localized,
    slug,
    locale,
    body: loc.content,
    readingMinutes: invariant.readingMinutes ?? readingMinutes(loc.content),
  };
  cache.set(key, post);
  return post;
}

export function getPosts(locale: Locale): Post[] {
  return getPostSlugs()
    .map((s) => getPost(locale, s))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
