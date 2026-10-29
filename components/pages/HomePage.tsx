import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { SITE_URL } from '@/lib/site';
import { SiteFrame } from '@/components/layout/SiteFrame';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { CapabilityMap } from '@/components/home/CapabilityMap';
import { Services } from '@/components/home/Services';
import { CtaBand } from '@/components/home/CtaBand';
import { Portfolio } from '@/components/home/Portfolio';
import { Testimonials } from '@/components/home/Testimonials';
import { FunFacts } from '@/components/home/FunFacts';
import { Faq } from '@/components/home/Faq';
import { BookCall } from '@/components/home/BookCall';
import { Contact } from '@/components/home/Contact';
import { JsonLd } from '@/components/seo/JsonLd';
import { homeGraph } from '@/lib/seo/jsonld';

export function HomePage({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <SiteFrame locale={locale} variant="overlay">
      <JsonLd data={homeGraph(locale)} />
      <Hero locale={locale} />
      <About locale={locale} />
      <CapabilityMap locale={locale} />
      <Services locale={locale} />
      <CtaBand locale={locale} />
      <Portfolio locale={locale} />
      <Testimonials locale={locale} />
      <FunFacts locale={locale} />
      <Faq locale={locale} />
      <BookCall t={m.book} embedDomain={new URL(SITE_URL).hostname} />
      <Contact locale={locale} />
    </SiteFrame>
  );
}
