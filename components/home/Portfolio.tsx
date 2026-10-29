import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { getFeaturedProjects } from '@/lib/content/projects';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { PortfolioGrid } from './PortfolioGrid';

export function Portfolio({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const projects = getFeaturedProjects(locale, 6);
  return (
    <section id="portfolio" className="section bg-paper-0">
      <div className="container-dg">
        <Reveal className="mx-auto max-w-3xl text-center" stagger>
          <SectionTitle align="center">{m.sections.portfolio}</SectionTitle>
          <p className="mt-6 text-[1.02rem] leading-relaxed">{m.portfolio.intro}</p>
        </Reveal>
        <div className="mt-12">
          <PortfolioGrid locale={locale} projects={projects} seeMore />
        </div>
      </div>
    </section>
  );
}
