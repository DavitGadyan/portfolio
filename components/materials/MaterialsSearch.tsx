'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { SearchEntry, SearchKind } from '@/lib/materials-search';

export type SearchStrings = { label: string; placeholder: string; hint: string; results: string; none: string; clear: string; kinds: Record<SearchKind, string> };

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const fmt = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? `{${k}}`));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const noop = () => () => {};

function Mark({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp(`(${tokens.map(esc).join('|')})`, 'gi');
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}</>;
}

/**
 * Search box of the Materials index: every word of the query must appear in a topic (title, then subtitle, then text;
 * accents ignored), the best ten are listed, and each result links to its card. Pure client state over a static index.
 */
export function MaterialsSearch({ entries, s }: { entries: SearchEntry[]; s: SearchStrings }) {
  const [q, setQ] = useState('');
  const ready = useSyncExternalStore(noop, () => true, () => false); // the box works once hydrated; tests wait for it
  const folded = useMemo(() => entries.map((e) => ({ e, title: fold(e.title), short: fold(e.short), text: fold(e.text) })), [entries]);
  const tokens = fold(q).split(/\s+/).filter((t) => t.length >= 2);
  const raw = q.toLowerCase().split(/\s+/).filter((t) => t.length >= 2);
  const hits = tokens.length
    ? folded
        .flatMap(({ e, title, short, text }) => {
          let score = 0;
          for (const t of tokens) {
            if (title.includes(t)) score += title.startsWith(t) ? 6 : 4;
            else if (short.includes(t)) score += 3;
            else if (text.includes(t)) score += 1;
            else return [];
          }
          return [{ e, score }];
        })
        .sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title))
        .slice(0, 10)
    : [];
  const snippet = (e: SearchEntry) => {
    const low = e.text.toLowerCase();
    const at = Math.min(...raw.map((t) => low.indexOf(t)).filter((i) => i >= 0), Infinity);
    if (!Number.isFinite(at)) return e.text.slice(0, 170);
    const start = Math.max(0, at - 50);
    return `${start ? '…' : ''}${e.text.slice(start, start + 170)}`;
  };
  const state = !tokens.length ? s.hint : hits.length ? fmt(s.results, { n: hits.length, q: q.trim() }) : fmt(s.none, { q: q.trim() });
  return (
    <div className="msrch" role="search" data-ready={ready ? '' : undefined}>
      <label className="msrch__label" htmlFor="msrch-q">{s.label}</label>
      <div className="msrch__box">
        <Search size={18} aria-hidden="true" />
        <input id="msrch-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.placeholder} autoComplete="off" spellCheck={false} aria-describedby="msrch-state" onKeyDown={(e) => { if (e.key === 'Escape') setQ(''); }} />
        {q && <button type="button" className="msrch__clear" aria-label={s.clear} onClick={() => setQ('')}><X size={16} aria-hidden="true" /></button>}
      </div>
      <p id="msrch-state" className="msrch__state" role="status">{state}</p>
      {hits.length > 0 && (
        <ul className="msrch__list" role="list">
          {hits.map(({ e }) => (
            <li key={e.id}>
              <Link href={e.href} className="msrch__item" prefetch={false} data-kind={e.kind}>
                <span className="msrch__kind">{s.kinds[e.kind]}{e.source && ` · ${e.source}`}</span>
                <strong><Mark text={e.title} tokens={raw} /></strong>
                {e.short && <small>{e.short}</small>}
                <p><Mark text={snippet(e)} tokens={raw} /></p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
