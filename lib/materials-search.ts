import type { Locale } from '@/lib/i18n/config';
import { pagePath } from '@/lib/locale-path';
import { materials } from '@/data/materials';
import { tracks, trackPath } from '@/data/quizzes';
import { videos, videoPath } from '@/data/videos';
import { mindmaps, mapPath } from '@/data/mindmaps';

export type SearchKind = 'map' | 'quiz' | 'video' | 'mindmap';
/** One searchable topic under /materials/; `href` ends in `#c-<id>`, which opens the card on its page and anchors it in the no-JS list. */
export interface SearchEntry { id: string; kind: SearchKind; source: string; title: string; short: string; text: string; href: string }

const clip = (s: string, n = 220) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t; };

/** Every technique card, quiz pattern, video and mind-map concept, localised, built at render time for the search box on the index. */
export function buildSearchIndex(locale: Locale): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const m of materials) for (const k of m.techniques) out.push({ id: `${m.id}:${k.id}`, kind: 'map', source: m.name, title: k.title[locale], short: k.short[locale], text: clip(`${k.when[locale]} ${k.action[locale]}`), href: `${pagePath(locale, `/materials/${m.id}/`)}#c-${k.id}` });
  for (const t of tracks) for (const n of t.nodes) out.push({ id: `${t.id}:${n.id}`, kind: 'quiz', source: t.name, title: n.title[locale], short: n.short[locale], text: clip(`${n.what[locale]} ${n.syntax}`), href: `${pagePath(locale, trackPath(t.id))}#c-${n.id}` });
  for (const v of videos) out.push({ id: `video:${v.id}`, kind: 'video', source: '', title: v.title[locale], short: '', text: clip(v.description[locale]), href: pagePath(locale, videoPath(v.id)) });
  for (const x of mindmaps) for (const n of x.nodes) out.push({ id: `${x.id}:${n.id}`, kind: 'mindmap', source: x.name, title: n.title[locale], short: n.short[locale], text: clip(`${n.what[locale]} ${n.useCase?.[locale] ?? ''} ${n.ai?.[locale] ?? ''} ${(n.commands ?? []).join(' ')}`), href: `${pagePath(locale, mapPath(x.id))}#c-${n.id}` });
  return out;
}
