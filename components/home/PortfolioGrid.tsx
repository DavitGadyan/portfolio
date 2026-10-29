import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { pagePath } from '@/lib/locale-path';
import type { Project } from '@/lib/content/types';
import { categories, categoryById } from '@/data/categories';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';
import { FilterFromHash } from './FilterFromHash';

function fmtDate(d: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(`${d}T00:00:00Z`));
}

export function ProjectCard({ p, locale, priority = false, headingLevel = 'h3' }: { p: Project; locale: Locale; priority?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const m = getMessages(locale);
  const href = pagePath(locale, `/portfolio/${p.slug}/`);
  return (
    <article className="pcard" data-cat={p.categories.join(' ')} data-testid="project-card">
      <Link href={href} className="block" aria-label={`${m.portfolio.viewProject}: ${p.title}`}>
        <Img src={p.cover} alt={p.coverAlt} width={1000} height={731} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 640px" className="pcard__img aspect-[1000/731] object-cover" priority={priority} loading={priority ? undefined : 'lazy'} />
      </Link>
      <div className="pcard__cap">
        <H className="m-0 text-base font-semibold leading-snug"><Link href={href} className="text-white no-underline hover:underline">{p.title}</Link></H>
        <p className="m-0 mt-1 text-[0.72rem] uppercase tracking-[0.1em] text-ink-200">{p.categories.map((c) => categoryById[c].label[locale]).join(' · ')}</p>
        <p className="m-0 mt-1 text-xs text-ink-300"><time dateTime={p.date}>{fmtDate(p.date, locale)}</time></p>
      </div>
    </article>
  );
}

export function PortfolioGrid({ locale, projects, filter = false, seeMore = false, counts, headingLevel = 'h3' }: { locale: Locale; projects: Project[]; filter?: boolean; seeMore?: boolean; counts?: Partial<Record<string, number>>; headingLevel?: 'h2' | 'h3' }) {
  const m = getMessages(locale);
  const present = new Set(projects.flatMap((p) => p.categories));
  const eager = filter ? 3 : 0; // first row without the reveal transition
  const preload = filter ? 1 : 0; // only the first card is a realistic LCP candidate
  return (
    <div className="pwrap">
      {filter && (
        <fieldset className="pfilter mb-10 border-0 p-0">
          <legend className="visually-hidden">{m.portfolio.filterLabel}</legend>
          <input type="radio" name="pf" id="f-all" defaultChecked />
          <label htmlFor="f-all">{m.portfolio.filterAll} <span className="pfilter__n">{projects.length}</span></label>
          {categories.filter((c) => present.has(c.id)).map((c) => (
            <span key={c.id} className="contents">
              <input type="radio" name="pf" id={`f-${c.id}`} />
              <label htmlFor={`f-${c.id}`}>{c.label[locale]} <span className="pfilter__n">{counts?.[c.id] ?? ''}</span></label>
            </span>
          ))}
        </fieldset>
      )}
      {filter && <FilterFromHash />}
      {filter && <p className="pnote mb-6 text-center text-sm text-ink-400">{m.portfolio.securityNote}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="project-grid">
        {projects.map((p, i) =>
          i < eager ? (
            // First row on the index page: no reveal transition and eager loading so the LCP card paints immediately.
            <div key={p.slug} data-cat={p.categories.join(' ')}><ProjectCard p={p} locale={locale} headingLevel={headingLevel} priority={i < preload} /></div>
          ) : (
            <Reveal key={p.slug} delay={(i % 3) * 80} data-cat={p.categories.join(' ')}>
              <ProjectCard p={p} locale={locale} headingLevel={headingLevel} />
            </Reveal>
          ),
        )}
      </div>
      {seeMore && (
        <div className="mt-12 text-center">
          <Link href={pagePath(locale, '/portfolio/')} className="btn btn-outline-dark">{m.portfolio.seeMore}</Link>
        </div>
      )}
    </div>
  );
}
