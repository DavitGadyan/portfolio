import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { faq } from '@/data/faq';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Faq({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="faq" className="section bg-paper-0">
      <div className="container-dg">
        <Reveal className="text-center"><SectionTitle align="center">{m.sections.faq}</SectionTitle></Reveal>
        <Reveal className="faq mx-auto mt-12 max-w-3xl [--stagger-step:45ms]" stagger delay={100}>
          {faq.map((f, i) => (
            <details key={f.id} open={i === 0}>
              <summary className="faq-q">{f.q[locale]}</summary>
              <div className="faq-a"><p className="m-0">{f.a[locale]}</p></div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
