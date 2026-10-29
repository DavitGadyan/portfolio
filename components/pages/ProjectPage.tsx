import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { getProject, getRelatedProjects } from '@/lib/content/projects';
import { projectGraph } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { categoryById } from '@/data/categories';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { Markdown } from '@/components/content/Markdown';
import { StackTable } from '@/components/content/StackTable';
import { ProjectCard } from '@/components/home/PortfolioGrid';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/seo/JsonLd';

function fmtDate(d: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T00:00:00Z`));
}

export function projectMetadata(locale: Locale, slug: string): Metadata {
  const p = getProject(locale, slug);
  const cat = categoryById[p.categories[0]].label[locale];
  const withCat = `${p.title} | ${cat}`;
  // the layout appends " | David Gadyan" (15 chars); keep the whole <title> at or under 70 characters
  return buildMetadata({
    locale, path: `/portfolio/${slug}/`, title: withCat.length <= 55 ? withCat : p.title, description: p.description,
    image: p.cover, imageAlt: p.coverAlt, type: 'article', published: p.date, modified: p.lastmod ?? p.date,
  });
}

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const m = getMessages(locale);
  const p = getProject(locale, slug);
  const related = getRelatedProjects(locale, p, 3);
  const links = p.links;
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={projectGraph(locale, p)} />
      <article className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <div className="flex items-center gap-3">
            <Link href={pagePath(locale, '/portfolio/')} className="pback" aria-label={m.project.back} title={m.project.back}><ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" /></Link>
            <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.portfolio, href: pagePath(locale, '/portfolio/') }, { label: p.title }]} />
          </div>
          <header className="mt-8 max-w-4xl">
            <p className="eyebrow">
              {p.categories.map((c, i) => (
                <span key={c}>{i > 0 && ' · '}<Link href={`${pagePath(locale, '/portfolio/')}#f-${c}`} className="hover:underline">{categoryById[c].label[locale]}</Link></span>
              ))}
            </p>
            <h1 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight text-ink-700">{p.title}</h1>
            <p className="mt-4 text-sm text-ink-400">
              {m.project.by} David Gadyan · {m.project.published} <time dateTime={p.date}>{fmtDate(p.date, locale)}</time>
              {p.lastmod && p.lastmod !== p.date && <> · {m.project.updated} <time dateTime={p.lastmod}>{fmtDate(p.lastmod, locale)}</time></>}
              {p.client && <> · {m.project.client}: <span className="text-ink-700">{p.client}</span></>}
            </p>
          </header>
          <figure className="mt-8 max-w-4xl">
            <Img src={p.cover} alt={p.coverAlt} width={1000} height={731} priority sizes="(min-width: 1024px) 896px, 100vw" className="h-auto w-full" />
          </figure>
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="lead font-medium text-ink-700">{p.summary}</p>
              <div className="prose-dg mt-8">
                <Markdown source={p.body} playLabel={fmt(m.a11y.playVideo, { title: p.title })} />
              </div>
              {p.clientNote && <p className="mt-8 text-sm italic text-ink-400">{p.clientNote}</p>}
            </div>
            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <section>
                <h2 className="eyebrow mb-3">{m.project.stack}</h2>
                <StackTable stack={p.stack} locale={locale} />
              </section>
              {p.outcomes.length > 0 && (
                <section>
                  <h2 className="eyebrow mb-3">{m.project.outcome}</h2>
                  <ul className="space-y-2 text-[0.95rem]" role="list">
                    {p.outcomes.map((o) => <li key={o} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{o}</li>)}
                  </ul>
                </section>
              )}
              {p.metrics && p.metrics.length > 0 && (
                <section>
                  <h2 className="eyebrow mb-3">{m.project.metrics}</h2>
                  <dl className="metrics">
                    {p.metrics.map((x) => <div key={x.label} className="metrics__item"><dd className="metrics__value">{x.value}</dd><dt className="metrics__label">{x.label}</dt></div>)}
                  </dl>
                </section>
              )}
              {(links.live || links.github || links.video?.length || links.archived?.length) && (
                <section>
                  <h2 className="eyebrow mb-3">{m.project.links}</h2>
                  <ul className="space-y-2 text-[0.95rem]" role="list">
                    {links.live && <li><a href={links.live} target="_blank" rel="noopener noreferrer" className="underline">{m.project.live}</a></li>}
                    {links.github && <li><a href={links.github} target="_blank" rel="noopener noreferrer" className="underline">{m.project.github}</a></li>}
                    {links.video?.map((v) => <li key={v}><a href={v} target="_blank" rel="noopener noreferrer" className="underline">{m.project.video}</a></li>)}
                    {links.archived?.map((a) => <li key={a.label} className="text-ink-400">{a.label}: {a.note}</li>)}
                  </ul>
                </section>
              )}
            </aside>
          </div>
          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="section-title section-title--sm">{m.project.related}</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => <ProjectCard key={r.slug} p={r} locale={locale} />)}
              </div>
            </section>
          )}
          <p className="mt-12"><Link href={pagePath(locale, '/portfolio/')} className="btn btn-outline-dark btn-sm">← {m.project.back}</Link></p>
        </div>
      </article>
    </SiteFrame>
  );
}
