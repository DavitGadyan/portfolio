import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { occupations } from '@/data/occupations';
import { site } from '@/data/site';
import { Img } from '@/components/ui/Img';
import { HeroSlides } from './HeroSlides';
import { Typewriter } from './Typewriter';
import slide1 from '@/assets/images/slider/black-white.png';

// Entrance delays and ping offsets per trust chip; static strings so Tailwind can see the classes.
const chipMotion = ['[--d:250ms] [--i:0]', '[--d:350ms] [--i:1]', '[--d:450ms] [--i:2]', '[--d:550ms] [--i:3]'];

export function Hero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const words = occupations[locale];
  return (
    <section id="home" className="relative isolate flex min-h-dvh min-h-[600px] items-center overflow-hidden bg-ink-800 text-white">
      <div id="hero-sentinel" aria-hidden="true" className="absolute left-0 top-20 h-px w-px" />
      <Img src={slide1} alt={m.hero.slideAlt} fill priority sizes="(max-width: 640px) 640px, 100vw" className="hero-slide object-cover object-[65%_center]" />
      <HeroSlides />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container-dg relative z-10 py-28 md:py-36">
        <h1 className="hero-in hero-in--lcp m-0 text-[clamp(2.4rem,6.5vw,4.75rem)] font-semibold leading-[1.02] tracking-tight">{site.name}</h1>
        <p className="hero-in [--d:150ms] mt-4 text-[clamp(1.5rem,3.4vw,2.3rem)] font-medium leading-tight" aria-live="off">
          <span className="sr-only">{words.join(', ')}</span>
          <Typewriter words={words} />
        </p>
        <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[1.05rem] font-medium uppercase tracking-[0.12em] text-ink-100">
          {m.hero.trust.map((t, i) => (
            <li key={t} className={`hero-in ${chipMotion[i] ?? chipMotion[chipMotion.length - 1]} flex items-start gap-2.5`}>
              <span aria-hidden="true" className="hero-dot mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-accent" />{t}
            </li>
          ))}
        </ul>
        <div className="hero-in [--d:600ms] mt-9 flex flex-wrap gap-3">
          <a href="#contact" className="btn btn-outline-light" data-track="hire_me_click">{m.hero.hireMe}</a>
          <a href="#book" className="btn btn-outline-light" data-track="book_call_click">{m.hero.primaryCta}</a>
        </div>
      </div>
    </section>
  );
}
