import { Check } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { withBasePath } from '@/lib/site';
import { capabilityStages, capabilityBranch } from '@/data/capabilityMap';
import { logos, logoSrc, logoScale } from '@/data/skillLogos';
import { certs, certSrc } from '@/data/certs';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SkillsBrain } from './SkillsBrain';

export function CapabilityMap({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const nodes = [...capabilityStages, capabilityBranch].map((s) => ({
    id: s.id, order: s.order, title: s.title[locale], short: s.short[locale], line: s.line[locale],
    skills: s.skills.map((id) => {
      const c = certs[id];
      const cert = c ? { src: withBasePath(certSrc(c)), title: c.title[locale], issued: c.issued, expires: c.expires, id: c.id } : undefined;
      return { id, src: withBasePath(logoSrc(id)), label: logos[id][1], scale: logoScale(id), cert };
    }),
  }));
  return (
    <section id="capabilities" className="section bg-ink-800 text-white" aria-labelledby="capmap-title">
      <div className="container-dg">
        <Reveal className="mx-auto max-w-3xl text-center" stagger>
          <SectionTitle id="capmap-title" align="center" light>{m.sections.capability}</SectionTitle>
          <p className="mx-auto mt-6 max-w-3xl text-[1.05rem] font-medium leading-relaxed text-white">{m.capability.intro}</p>
          <ul className="vprop mx-auto mt-5 max-w-2xl text-center" role="list">
            {m.capability.points.map((p) => (
              <li key={p}><Check size={18} strokeWidth={2.5} className="vprop__check" aria-hidden="true" /><span>{p}</span></li>
            ))}
          </ul>
        </Reveal>
        <div className="capwrap mt-14">
          <ol className="capmap grid gap-8 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4" role="list">
            {capabilityStages.map((s, i) => (
              <Reveal as="li" key={s.id} className="capmap__item text-center lg:px-1" delay={i * 70}>
                <span className="capmap__num" aria-hidden="true">{s.order}</span>
                <span className="visually-hidden">{fmt(m.capability.stage, { n: s.order })}: </span>
                <h3 className="mt-4 text-[0.95rem] font-semibold uppercase leading-snug tracking-[0.08em] text-white">{s.title[locale]}</h3>
                <p className="m-0 mt-2 text-[0.84rem] leading-relaxed text-ink-200">{s.line[locale]}</p>
              </Reveal>
            ))}
          </ol>
          <SkillsBrain nodes={nodes} locale={locale} t={{ label: m.capability.graphLabel, close: m.capability.back, tools: m.capability.tools, certHint: m.capability.certHint, closeCert: m.capability.closeCert, issued: m.capability.issued, validUntil: m.capability.validUntil, certId: m.capability.certId }} />
        </div>
      </div>
    </section>
  );
}
