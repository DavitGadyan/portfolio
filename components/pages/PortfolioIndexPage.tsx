import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { buildMetadata } from '@/lib/seo/metadata';
import { countByCategory, getProjectsShowcase } from '@/lib/content/projects';
import { portfolioGraph } from '@/lib/seo/jsonld';
import { homePath } from '@/lib/locale-path';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PortfolioGrid } from '@/components/home/PortfolioGrid';
import { JsonLd } from '@/components/seo/JsonLd';

export function portfolioMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: '/portfolio/', title: m.meta.portfolioTitle, description: m.meta.portfolioDescription });
}

export function PortfolioIndexPage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const projects = getProjectsShowcase(locale);
  return (
    <SiteFrame locale={locale}>
      <JsonLd data={portfolioGraph(locale, projects)} />
      <section className="section pt-10 lg:pt-14">
        <div className="container-dg">
          <Breadcrumbs items={[{ label: m.nav.home, href: homePath(locale) }, { label: m.nav.portfolio }]} />
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <SectionTitle as="h1" align="center">{m.sections.portfolio}</SectionTitle>
            <p className="mt-6 text-[1.02rem] leading-relaxed">{m.portfolio.intro}</p>
            <p className="mt-2 text-sm text-ink-400">{fmt(m.portfolio.count, { n: projects.length })}</p>
          </div>
          <div className="mt-12">
            <PortfolioGrid locale={locale} projects={projects} filter counts={countByCategory(locale)} headingLevel="h2" />
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
