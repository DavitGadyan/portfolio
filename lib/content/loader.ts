import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/lib/i18n/config';

export type Kind = 'projects' | 'blog' | 'pages';
const ROOT = path.join(process.cwd(), 'content');

export interface RawDoc { data: Record<string, unknown>; content: string; file: string }

const rawCache = new Map<string, RawDoc | null>();
const slugCache = new Map<string, string[]>();

export function listSlugs(kind: Kind, locale: Locale): string[] {
  const key = `${kind}/${locale}`;
  const hit = slugCache.get(key);
  if (hit) return hit;
  const dir = path.join(ROOT, locale, kind);
  const slugs = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => f.replace(/\.mdx$/, '')).sort()
    : [];
  slugCache.set(key, slugs);
  return slugs;
}

export function readRaw(kind: Kind, locale: Locale, slug: string): RawDoc | null {
  const key = `${kind}/${locale}/${slug}`;
  if (rawCache.has(key)) return rawCache.get(key) ?? null;
  const file = path.join(ROOT, locale, kind, `${slug}.mdx`);
  if (!fs.existsSync(file)) { rawCache.set(key, null); return null; }
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const doc = { data: data as Record<string, unknown>, content: content.trim(), file };
  rawCache.set(key, doc);
  return doc;
}

export function readingMinutes(text: string): number {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toISODate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.slice(0, 10);
  return '';
}
