import type { Metadata } from 'next';
import Link from 'next/link';
import { getRelatedProjectsForPost } from '@/lib/content/projects';
import { ProjectCard } from '@/components/home/PortfolioGrid';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPost } from '@/lib/content/posts';
import { postGraph } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { Markdown } from '@/components/content/Markdown';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/seo/JsonLd';

function fmtDate(d: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T00:00:00Z`));
}

export function postMetadata(locale: Locale, slug: string): Metadata {
  const p = getPost(locale, slug);
  return buildMetadata({ locale, path: `/blog/${slug}/`, title: p.title, description: p.description, image: p.cover, imageAlt: p.coverAlt, type: 'article', published: p.date, modified: p.lastmod });
}

export function PostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const m = getMessages(locale);
  const p = getPost(locale, slug);
  const wordCount = p.body.split(/\s+/).filter(Boolean).length;
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={postGraph(locale, p, wordCount)} />
      <article className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.blog, href: pagePath(locale, '/blog/') }, { label: p.title }]} />
            <header className="mt-8">
              <p className="eyebrow">{p.articleSection}</p>
              <h1 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight text-ink-700">{p.title}</h1>
              <p className="mt-4 text-sm text-ink-400">
                {m.blog.by} {p.author} · {m.blog.published} <time dateTime={p.date}>{fmtDate(p.date, locale)}</time>
                {p.lastmod !== p.date && <> · {m.blog.updated} <time dateTime={p.lastmod}>{fmtDate(p.lastmod, locale)}</time></>}
                {' '}· {fmt(m.blog.minRead, { n: p.readingMinutes })}
              </p>
            </header>
            <figure className="mt-8">
              <Img src={p.cover} alt={p.coverAlt} width={1000} height={731} priority sizes="(min-width: 1024px) 768px, 100vw" className="h-auto w-full" />
            </figure>
            <p className="lead mt-8 font-medium text-ink-700">{p.summary}</p>
            {p.takeaways.length > 0 && (
              <aside className="mt-8 border-l-4 border-ink-500 bg-paper-50 p-5" aria-labelledby="takeaways">
                <h2 id="takeaways" className="eyebrow m-0">{m.blog.takeaways}</h2>
                <ul className="prose-dg mt-3 space-y-2 text-[0.95rem]">
                  {p.takeaways.map((t) => <li key={t}><Markdown source={t} /></li>)}
                </ul>
              </aside>
            )}
            <div className="prose-dg mt-10">
              <Markdown source={p.body} playLabel={fmt(m.a11y.playVideo, { title: p.title })} />
            </div>
            {p.faq.length > 0 && (
              <section className="faq mt-14" aria-labelledby="post-faq">
                <h2 id="post-faq" className="section-title section-title--sm mb-6">{m.blog.faq}</h2>
                {p.faq.map((f) => (
                  <details key={f.q}>
                    <summary className="faq-q">{f.q}</summary>
                    <div className="faq-a"><p className="m-0">{f.a}</p></div>
                  </details>
                ))}
              </section>
            )}
            {p.tags.length > 0 && (
              <p className="mt-10 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-ink-400">
                <span>{m.blog.tags}:</span>
                {p.tags.map((t) => <span key={t} className="border border-ink-200 px-2 py-0.5">{t}</span>)}
              </p>
            )}
            <section className="mt-14" aria-labelledby="post-related">
              <h2 id="post-related" className="section-title section-title--sm mb-6">{m.blog.related}</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {getRelatedProjectsForPost(locale, [...p.tags, ...p.about]).map((r) => <ProjectCard key={r.slug} p={r} locale={locale} />)}
              </div>
              <p className="mt-6 text-sm text-ink-500">
                {m.blog.servicesHint} <Link href={`${homePath(locale)}#services`} className="underline">{m.nav.services}</Link> · <Link href={pagePath(locale, '/portfolio/')} className="underline">{m.nav.portfolio}</Link> · <Link href={`${homePath(locale)}#book`} className="underline">{m.hero.primaryCta}</Link>
              </p>
            </section>
            <p className="mt-10"><Link href={pagePath(locale, '/blog/')} className="btn btn-outline-dark btn-sm">← {m.blog.back}</Link></p>
          </div>
        </div>
      </article>
    </SiteFrame>
  );
}
