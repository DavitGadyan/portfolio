import { listSlugs, readRaw, readingMinutes } from './loader';
import { assertSlug, parseProjectInvariant, parseProjectLocalized } from './validate';
import type { CategoryId, Project } from './types';
import type { Locale } from '@/lib/i18n/config';

const cache = new Map<string, Project>();

export function getProjectSlugs(): string[] {
  return listSlugs('projects', 'en');
}

export function getProject(locale: Locale, slug: string): Project {
  const key = `${locale}/${slug}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const en = readRaw('projects', 'en', slug);
  if (!en) throw new Error(`[content] missing content/en/projects/${slug}.mdx`);
  assertSlug(slug, en.file);
  const invariant = parseProjectInvariant(en.data, en.file);
  const loc = locale === 'en' ? en : readRaw('projects', 'es', slug);
  if (!loc) throw new Error(`[content] missing content/es/projects/${slug}.mdx (every EN project needs an ES sibling)`);
  const localized = parseProjectLocalized(loc.data, loc.file, locale);
  const project: Project = { ...invariant, ...localized, slug, locale, body: loc.content, readingMinutes: readingMinutes(loc.content) };
  cache.set(key, project);
  return project;
}

export function getProjects(locale: Locale): Project[] {
  return getProjectSlugs()
    .map((s) => getProject(locale, s))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export function getFeaturedProjects(locale: Locale, n = 6): Project[] {
  const featured = getProjects(locale).filter((p) => p.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return featured.slice(0, n);
}

export function getRelatedProjects(locale: Locale, project: Project, n = 3): Project[] {
  const primary = project.categories[0];
  return getProjects(locale)
    .filter((p) => p.slug !== project.slug)
    .map((p) => ({ p, score: (p.categories.includes(primary) ? 2 : 0) + p.categories.filter((c) => project.categories.includes(c)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p);
}

export function countByCategory(locale: Locale): Record<CategoryId, number> {
  const counts = {} as Record<CategoryId, number>;
  for (const p of getProjects(locale)) for (const c of p.categories) counts[c] = (counts[c] ?? 0) + 1;
  return counts;
}

/** Projects that share vocabulary with a blog post (tags/about vs. project title, categories and stack); featured ones as a fallback. */
export function getRelatedProjectsForPost(locale: Locale, words: string[], n = 3): Project[] {
  const terms = words.map((w) => w.toLowerCase()).filter((w) => w.length > 3);
  const hay = (p: Project) => [p.title, ...p.categories, ...Object.values(p.stack).flat()].join(' ').toLowerCase();
  const scored = getProjects(locale)
    .map((p) => ({ p, score: terms.reduce((s, t) => s + (hay(p).includes(t) ? 1 : 0), 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.p.featured) - Number(a.p.featured) || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p);
  if (scored.length >= n) return scored;
  const seen = new Set(scored.map((p) => p.slug));
  return [...scored, ...getFeaturedProjects(locale, n + scored.length).filter((p) => !seen.has(p.slug))].slice(0, n);
}
