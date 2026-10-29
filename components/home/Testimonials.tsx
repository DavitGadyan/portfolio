import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { testimonials } from '@/data/testimonials';
import { CardCarousel } from '@/components/ui/CardCarousel';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Testimonials({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const items = testimonials.map((t) => ({ name: t.name, image: t.image, role: t.role[locale], quote: t.quote[locale] }));
  return (
    <section id="testimonials" className="section bg-paper-100">
      <div className="container-dg">
        <Reveal className="text-center">
          <SectionTitle align="center">{m.sections.testimonials}</SectionTitle>
        </Reveal>
        <Reveal className="mt-12" delay={120}>
          <CardCarousel
            items={items}
            t={{ prev: m.a11y.prev, next: m.a11y.next, goTo: m.a11y.goTo, pause: m.a11y.pause, play: m.a11y.play, label: m.a11y.testimonialsCarousel, quote: m.a11y.quote,
              translatedNote: locale === 'es' ? 'Reseñas originales en inglés, traducidas al español.' : undefined }}
          />
        </Reveal>
      </div>
    </section>
  );
}
