import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbNode, personNode, webPageNode, websiteNode } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { absUrl, withBasePath } from '@/lib/site';
import { logoScale, logoSrc } from '@/data/skillLogos';
import { QUIZ_SIZE, QUIZZES_PATH, trackPath, tracks, type Track } from '@/data/quizzes';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { TechIcon } from '@/components/materials/icons';
import { QuizLab } from '@/components/materials/QuizLab';
import type { GraphStrings, ToolView } from '@/components/materials/TechniqueGraph';
import type { QuestionView } from '@/components/materials/Quiz';

const MATERIALS = '/materials/';
export const trackIds = tracks.map((t) => t.id);
export const getTrack = (id: string) => tracks.find((t) => t.id === id);

// ---------------------------------------------------------------- the folder: one tile per track

export function quizzesMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: QUIZZES_PATH, title: m.meta.quizzesTitle, description: m.meta.quizzesDescription });
}

export function QuizzesPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const bc = breadcrumbNode(locale, QUIZZES_PATH, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: m.quizzes.heading, path: QUIZZES_PATH }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path: QUIZZES_PATH, name: m.meta.quizzesTitle, description: m.meta.quizzesDescription, type: 'CollectionPage', breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: tracks.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title[locale], url: absUrl(pagePath(locale, trackPath(t.id))) })) } },
    bc] };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: m.quizzes.heading }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.quizzes.heading}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.quizzes.intro}</p>
          </div>
          <ul className="tg__tiles" role="list">
            {tracks.map((t) => (
              <li key={t.id}>
                <Link href={pagePath(locale, trackPath(t.id))} className="tg__tile" prefetch={false}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(t.logo))} alt="" width={56} height={56} style={{ '--k': logoScale(t.logo) } as CSSProperties} />
                  <strong>{t.name}</strong>
                  <p>{t.tagline[locale]}</p>
                  <small>{fmt(m.quizzes.patterns, { n: t.nodes.length })} · {fmt(m.quizzes.questions, { n: t.questions.length })} · {m.quizzes.openTrack} →</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
}

// ---------------------------------------------------------------- one track: the syntax map, then the quiz

export function quizMetadata(locale: Locale, id: string): Metadata {
  const t = getTrack(id);
  if (!t) return {};
  return buildMetadata({ locale, path: trackPath(id), title: t.title[locale], description: t.description[locale] });
}

function toolView(t: Track, locale: Locale): ToolView {
  return {
    id: t.id, name: t.name, logo: withBasePath(logoSrc(t.logo)), scale: logoScale(t.logo),
    techniques: t.nodes.map((n) => ({ id: n.id, group: t.groups[n.group][locale], icon: n.icon, title: n.title[locale], sub: n.short[locale], syntax: n.syntax, when: n.when[locale], what: n.what[locale], why: n.gotcha[locale], example: n.example, code: true })),
  };
}

/** The bank, localised; the correct option is the first one by convention (data/quizzes/types.ts), the quiz shuffles them on screen. */
function questionViews(t: Track, locale: Locale): QuestionView[] {
  const byId = new Map(t.nodes.map((n) => [n.id, n]));
  return t.questions.map((q) => {
    const n = byId.get(q.node)!;
    return { id: q.id, node: q.node, nodeTitle: n.title[locale], group: t.groups[n.group][locale], q: q.q[locale], ...(q.code ? { code: q.code } : {}), options: q.options.map((o) => o[locale]), answer: 0, why: q.why[locale] };
  });
}

export function QuizPage({ locale, id }: { locale: Locale; id: string }) {
  const m = getMessages(locale);
  const q = m.quizzes;
  const t = getTrack(id)!;
  const path = trackPath(t.id);
  const size = Math.min(QUIZ_SIZE, t.questions.length);
  const bc = breadcrumbNode(locale, path, [{ name: m.nav.home, path: '/' }, { name: m.nav.materials, path: MATERIALS }, { name: q.heading, path: QUIZZES_PATH }, { name: t.name, path }]);
  const graph = { '@context': 'https://schema.org', '@graph': [personNode(locale), websiteNode(),
    { ...webPageNode({ locale, path, name: t.title[locale], description: t.description[locale], breadcrumbId: bc['@id'] }),
      mainEntity: { '@type': 'ItemList', itemListElement: t.nodes.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.title[locale] })) } },
    bc] };
  const gs: GraphStrings = { label: q.graphLabel, close: q.close, when: q.when, what: q.what, why: q.why, example: q.example, syntax: q.syntax, hint: q.hint };
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={graph} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.materials, href: pagePath(locale, MATERIALS) }, { label: q.heading, href: pagePath(locale, QUIZZES_PATH) }, { label: t.name }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{t.title[locale]}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{t.tagline[locale]}</p>
          </div>
          <ul className="tg__tools" role="list" aria-label={q.pick}>
            {tracks.map((x) => (
              <li key={x.id}>
                <Link href={pagePath(locale, trackPath(x.id))} className="tg__tool" aria-current={x.id === t.id ? 'page' : undefined} prefetch={false}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- brand mark served as-is from public/logos */}
                  <img src={withBasePath(logoSrc(x.logo))} alt="" width={32} height={32} style={{ '--k': logoScale(x.logo) } as CSSProperties} />
                  <span>{x.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-14 max-w-3xl text-center">
            <SectionTitle as="h2" align="center" size="sm" id="cheatsheet">{q.cheatsheet}</SectionTitle>
            <p className="mt-4 leading-relaxed">{fmt(q.cheatsheetIntro, { n: t.nodes.length })}</p>
          </div>
          <div className="tgwrap tgwrap--code">
            <ol className="tglist" role="list">
              {t.nodes.map((n) => (
                <li key={n.id}>
                  <p className="m-0 text-[0.68rem] uppercase tracking-[0.14em] text-ink-400">{t.groups[n.group][locale]}</p>
                  <h3><TechIcon id={n.icon} size={16} />{n.title[locale]}</h3>
                  <p className="tglist__sub">{n.short[locale]}</p>
                  <dl>
                    <dt>{q.syntax}</dt><dd><pre className="tglist__code"><code>{n.syntax}</code></pre></dd>
                    <dt>{q.when}</dt><dd>{n.when[locale]}</dd>
                    <dt>{q.what}</dt><dd>{n.what[locale]}</dd>
                    <dt>{q.why}</dt><dd>{n.gotcha[locale]}</dd>
                    <dt>{q.example}</dt><dd className="tg__ex tg__ex--code">{n.example}</dd>
                  </dl>
                </li>
              ))}
            </ol>
            <QuizLab tool={toolView(t, locale)} t={gs} questions={questionViews(t, locale)} size={size} s={q} headings={{ quiz: q.quiz, quizIntro: fmt(q.quizIntro, { n: size, total: t.questions.length }) }} />
          </div>
          <p className="tg__sources mx-auto max-w-3xl text-center">{t.sources[locale]}</p>
        </div>
      </section>
    </SiteFrame>
  );
}
