import { Boxes, BrainCircuit, CodeXml, Database, PenTool, ScanEye, ServerCog, ShieldCheck, TrendingUp, Workflow } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { services } from '@/data/services';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ServiceCard } from './ServiceCard';

const lucide = { BrainCircuit, Workflow, CodeXml, PenTool, Boxes, ScanEye, Database, ServerCog, ShieldCheck, TrendingUp };

export function Services({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="services" className="section bg-paper-50">
      <div className="container-dg">
        <Reveal className="mx-auto max-w-3xl text-center" stagger>
          <SectionTitle align="center">{m.sections.services}</SectionTitle>
          <p className="mt-6 text-[1.02rem] leading-relaxed">{m.services.intro}</p>
        </Reveal>
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" role="list">
          {services.map((s, i) => {
            const Icon = lucide[s.icon.name];
            return (
              <ServiceCard
                key={s.id} id={s.id} title={s.title[locale]} delay={(i % 5) * 60}
                icon={<span className="mx-auto grid h-24 w-24 place-items-center"><Icon size={76} strokeWidth={2} className="text-ink-600" aria-hidden="true" /></span>}
              >
                <p className="m-0 text-[0.88rem] leading-relaxed text-ink-500">{s.blurb[locale]}</p>
              </ServiceCard>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
