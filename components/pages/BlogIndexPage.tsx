import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPosts } from '@/lib/content/posts';
import { blogGraph } from '@/lib/seo/jsonld';
import { homePath, pagePath } from '@/lib/locale-path';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/seo/JsonLd';

function fmtDate(d: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T00:00:00Z`));
}

export function blogMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: '/blog/', title: m.meta.blogTitle, description: m.meta.blogDescription });
}

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const posts = getPosts(locale);
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={blogGraph(locale, posts)} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.blog }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.blog.title}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.blog.intro}</p>
          </div>
          <ul className="mt-14 grid gap-10 md:grid-cols-2" role="list">
            {posts.map((p, i) => {
              const href = pagePath(locale, `/blog/${p.slug}/`);
              return (
                <li key={p.slug} className="group">
                  <article>
                    <Link href={href} className="block overflow-hidden bg-ink-700" aria-label={p.title}>
                      <Img src={p.cover} alt={p.coverAlt} width={1000} height={731} sizes="(min-width: 768px) 45vw, 92vw" className="aspect-[1000/731] w-full object-cover transition duration-500 group-hover:scale-[1.03]" priority={i < 2} loading={i < 2 ? undefined : 'lazy'} />
                    </Link>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-400"><time dateTime={p.date}>{fmtDate(p.date, locale)}</time> · {fmt(m.blog.minRead, { n: p.readingMinutes })}</p>
                    <h2 className="mt-2 text-xl font-semibold leading-snug text-ink-700"><Link href={href} className="hover:underline">{p.title}</Link></h2>
                    <p className="mt-2 text-[0.95rem] leading-relaxed">{p.summary}</p>
                    <p className="mt-3"><Link href={href} className="text-sm font-medium uppercase tracking-[0.12em] text-ink-700 underline underline-offset-4">{m.blog.readMore}</Link></p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </SiteFrame>
  );
}
