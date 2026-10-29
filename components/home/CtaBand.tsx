import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import bg from '@/assets/images/backgrounds/need-service.jpg';

export function CtaBand({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="cta" className="relative isolate overflow-hidden bg-ink-700 py-24 text-white">
      <Img src={bg} alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="container-dg relative z-10 text-center">
        <SectionTitle align="center" light reveal>{m.cta.title}</SectionTitle>
        <Reveal stagger delay={150}>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-100">{m.cta.sub}</p>
          <a href="#book" className="btn btn-pill mt-8" data-track="book_call_click">{m.cta.button}</a>
        </Reveal>
      </div>
    </section>
  );
}
