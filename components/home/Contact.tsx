import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { absUrl } from '@/lib/site';
import { pagePath } from '@/lib/locale-path';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactForm } from './ContactForm';
import bg from '@/assets/images/backgrounds/contact-us-bg.jpg';

export function Contact({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink-700 py-24 text-white">
      <Img src={bg} alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="container-dg relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center"><SectionTitle align="center" light reveal>{m.sections.contact}</SectionTitle></div>
          <Reveal className="mt-10" delay={150}>
            <ContactForm locale={locale} t={m.contact} nextUrl={absUrl(pagePath(locale, '/thank-you/'))} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
