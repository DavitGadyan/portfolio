import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages, fmt } from '@/lib/i18n/messages';
import { withBasePath, CV_PATH } from '@/lib/site';
import { site } from '@/data/site';
import { experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { spokenLanguages } from '@/data/languages';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import portrait from '@/assets/images/backgrounds/portrait-about-laptop-shirt-final.png';

/** Minimal inline emphasis: **text** → <strong>. */
function rich(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} className="font-bold text-ink-700">{part}</strong> : part));
}

export function About({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section id="about" className="section bg-paper-0">
      <div className="container-dg">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionTitle>{m.sections.about}</SectionTitle>
            <div className="prose-dg mt-6" data-stagger>
              <p className="lead">{rich(site.about[locale][0])}</p>
              {site.about[locale].slice(1).map((p) => <p key={p.slice(0, 24)}>{rich(p)}</p>)}
            </div>
            <a href={withBasePath(CV_PATH)} className="btn btn-outline-dark mt-8" download>{m.about.cv}</a>
          </Reveal>
          <Reveal className="mx-auto w-full max-w-md lg:max-w-none" delay={120}>
            <figure className="portrait">
              <Img
                src={portrait}
                alt={m.about.portraitAlt}
                width={1040}
                height={1156}
                sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 92vw"
                className="portrait__img"
                loading="lazy"
              />
            </figure>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-2">
          <Reveal className="reveal-lift">
            <SectionTitle size="sm" as="h3">{m.sections.experience}</SectionTitle>
            <ol className="timeline mt-8 space-y-7 [--stagger-step:90ms]" role="list" data-stagger>
              {experience.map((e) => (
                <li key={e.org + e.period} className="timeline__item">
                  <h4 className="m-0 text-[19px] font-bold leading-snug text-ink-500">{e.role[locale]}</h4>
                  <p className="m-0 mt-1 text-sm font-bold uppercase tracking-[0.12em] text-ink-400">{e.org} · <time>{e.period}</time></p>
                  <p className="m-0 mt-2 text-[0.95rem] leading-relaxed text-ink-400">{e.line[locale]}</p>
                </li>
              ))}
            </ol>
            <SectionTitle size="sm" as="h3" className="mt-12">{m.sections.languages}</SectionTitle>
            <ul className="langs mt-6" role="list" data-stagger>
              {spokenLanguages.map((l) => (
                <li key={l.code} className="langs__item">
                  <FlagIcon code={l.code} size={24} />
                  <span className="langs__name">{l.name[locale]}</span>
                  <span className="langs__level">{l.level[locale]}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div>
            <Reveal>
              <SectionTitle size="sm" as="h3">{m.sections.skills}</SectionTitle>
            </Reveal>
            <Reveal as="ul" group replay className="mt-8 space-y-5" role="list">
              {skills.map((s) => (
                <li key={s.label.en} className="skill" style={{ '--pct': `${s.pct}%`, '--pn': s.pct } as CSSProperties}>
                  <div className="mb-2 flex items-baseline justify-between gap-4 text-base font-bold text-ink-500">
                    <span className="skill__name">{s.label[locale]}</span>
                    <span className="skill__num" aria-hidden="true" />
                  </div>
                  <div className="skillbar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.pct} aria-label={fmt(m.a11y.skillLevel, { name: s.label[locale], pct: s.pct })}>
                    <div className="skillbar__fill" />
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
