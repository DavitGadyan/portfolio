import type { Locale } from '@/lib/i18n/config';
import { funfacts } from '@/data/funfacts';
import { CountUp } from '@/components/ui/CountUp';
import { Img } from '@/components/ui/Img';
import { Reveal } from '@/components/ui/Reveal';

export function FunFacts({ locale }: { locale: Locale }) {
  return (
    <section id="facts" className="bg-ink-800 py-16 text-white">
      <div className="container-dg">
        <ul className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4" role="list">
          {funfacts.map((f, i) => (
            <Reveal as="li" key={f.label.en} delay={i * 80}>
              <Img src={f.icon} alt="" width={64} height={64} sizes="64px" className="mx-auto h-14 w-14 object-contain opacity-90 invert" loading="lazy" />
              <p className="m-0 mt-3 text-4xl font-bold tracking-tight"><CountUp value={f.value} suffix={f.suffix} locale={locale} /></p>
              <p className="m-0 mt-1 text-xs uppercase tracking-[0.18em] text-ink-200">{f.label[locale]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
