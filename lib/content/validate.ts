import { CATEGORY_IDS, STACK_LAYERS, type CategoryId, type ProjectInvariant, type ProjectLocalized, type PostInvariant, type PostLocalized } from './types';
import type { Locale } from '@/lib/i18n/config';
import { toISODate } from './loader';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9-]+$/;
const FOUR_ALLOWED = new Set(['virgil-ai-health-insurance-agent', 'ai-lead-scoring-churn-crm']);
const PROJECT_INVARIANTS = ['date', 'lastmod', 'client', 'cover', 'categories', 'stack', 'links', 'featured', 'order', 'draft'] as const;
const POST_INVARIANTS = ['date', 'lastmod', 'cover', 'tags', 'articleSection', 'author', 'draft', 'readingMinutes'] as const;

export class ContentError extends Error {}

function fail(file: string, msg: string): never {
  throw new ContentError(`[content] ${file}: ${msg}`);
}

export function assertSlug(slug: string, file: string) {
  if (!SLUG.test(slug) || slug.length > 60) fail(file, `invalid slug "${slug}"`);
}

export function parseProjectInvariant(d: Record<string, unknown>, file: string): ProjectInvariant {
  const date = toISODate(d.date);
  if (!ISO.test(date)) fail(file, `date must be YYYY-MM-DD (got ${String(d.date)})`);
  const lastmod = d.lastmod !== undefined ? toISODate(d.lastmod) : undefined;
  if (lastmod !== undefined && !ISO.test(lastmod)) fail(file, 'lastmod must be YYYY-MM-DD');
  const cover = typeof d.cover === 'string' ? d.cover : fail(file, 'cover is required');
  if (!cover.startsWith('/images/')) fail(file, 'cover must start with /images/');
  const categories = Array.isArray(d.categories) ? (d.categories as string[]) : fail(file, 'categories must be an array');
  const max = FOUR_ALLOWED.has(file.split('/').pop()?.replace(/\.mdx$/, '') ?? '') ? 4 : 3;
  if (categories.length < 1 || categories.length > max) fail(file, `categories must have 1–${max} entries`);
  for (const c of categories) if (!(CATEGORY_IDS as readonly string[]).includes(c)) fail(file, `unknown category "${c}"`);
  const stackIn = (d.stack ?? {}) as Record<string, unknown>;
  const stack = {} as ProjectInvariant['stack'];
  for (const layer of STACK_LAYERS) {
    const v = stackIn[layer];
    if (v === undefined) fail(file, `stack.${layer} is required (use [] if empty)`);
    if (!Array.isArray(v)) fail(file, `stack.${layer} must be an array`);
    stack[layer] = (v as unknown[]).map(String);
  }
  const links = (d.links ?? {}) as ProjectInvariant['links'];
  return {
    date,
    lastmod,
    client: typeof d.client === 'string' && d.client ? d.client : undefined,
    cover,
    categories: categories as CategoryId[],
    stack,
    links,
    featured: Boolean(d.featured),
    order: typeof d.order === 'number' ? d.order : undefined,
    draft: Boolean(d.draft),
  };
}

export function parseProjectLocalized(d: Record<string, unknown>, file: string, locale: Locale): ProjectLocalized {
  const title = str(d.title, file, 'title');
  if (title.length > 70) fail(file, `title longer than 70 chars (${title.length})`);
  const description = str(d.description, file, 'description');
  if (/this is meta description/i.test(description)) fail(file, 'placeholder description');
  if (description.length < 100 || description.length > 185) fail(file, `description must be 100–185 chars (${description.length})`);
  const summary = str(d.summary, file, 'summary');
  const coverAlt = str(d.coverAlt, file, 'coverAlt');
  const outcomes = Array.isArray(d.outcomes) ? (d.outcomes as unknown[]).map(String) : [];
  if (locale === 'es') {
    for (const k of PROJECT_INVARIANTS) if (d[k] !== undefined) fail(file, `ES file must not declare invariant "${k}"`);
  }
  let metrics: { label: string; value: string }[] | undefined;
  if (d.metrics !== undefined) {
    if (!Array.isArray(d.metrics) || d.metrics.length > 6) fail(file, 'metrics must be a list of at most 6 items');
    metrics = (d.metrics as unknown[]).map((it, i) => {
      const o = (it ?? {}) as Record<string, unknown>;
      if (typeof o.label !== 'string' || typeof o.value !== 'string' || !o.label.trim() || !String(o.value).trim()) fail(file, `metrics[${i}] needs string label and value`);
      return { label: String(o.label).trim(), value: String(o.value).trim() };
    });
  }
  return { title, description, summary, coverAlt, outcomes, metrics, clientNote: typeof d.clientNote === 'string' ? d.clientNote : undefined };
}

export function parsePostInvariant(d: Record<string, unknown>, file: string): PostInvariant {
  const date = toISODate(d.date);
  const lastmod = d.lastmod !== undefined ? toISODate(d.lastmod) : date;
  if (!ISO.test(date)) fail(file, 'date must be YYYY-MM-DD');
  if (!ISO.test(lastmod)) fail(file, 'lastmod must be YYYY-MM-DD');
  const cover = str(d.cover, file, 'cover');
  if (!cover.startsWith('/images/')) fail(file, 'cover must start with /images/');
  return {
    date,
    lastmod,
    cover,
    tags: Array.isArray(d.tags) ? (d.tags as unknown[]).map(String) : [],
    articleSection: typeof d.articleSection === 'string' ? d.articleSection : 'Blog',
    author: typeof d.author === 'string' ? d.author : 'David Gadyan',
    draft: Boolean(d.draft),
    readingMinutes: typeof d.readingMinutes === 'number' ? d.readingMinutes : undefined,
  };
}

export function parsePostLocalized(d: Record<string, unknown>, file: string, locale: Locale): PostLocalized {
  const title = str(d.title, file, 'title');
  const description = str(d.description, file, 'description');
  if (description.length < 80 || description.length > 230) fail(file, `description must be 80–230 chars (${description.length})`);
  if (locale === 'es') {
    for (const k of POST_INVARIANTS) if (d[k] !== undefined) fail(file, `ES file must not declare invariant "${k}"`);
  }
  const faqIn = Array.isArray(d.faq) ? (d.faq as { q?: unknown; a?: unknown }[]) : [];
  return {
    title,
    description,
    summary: typeof d.summary === 'string' ? d.summary : description,
    coverAlt: typeof d.coverAlt === 'string' ? d.coverAlt : title,
    about: Array.isArray(d.about) ? (d.about as unknown[]).map(String) : [],
    takeaways: Array.isArray(d.takeaways) ? (d.takeaways as unknown[]).map(String) : [],
    faq: faqIn.filter((f) => f && typeof f.q === 'string' && typeof f.a === 'string').map((f) => ({ q: String(f.q), a: String(f.a) })),
  };
}

function str(v: unknown, file: string, key: string): string {
  if (typeof v !== 'string' || !v.trim()) fail(file, `${key} is required`);
  return v.trim();
}
