'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { withBasePath } from '@/lib/site';
import type { NavItem } from '@/lib/nav';
import { homePath } from '@/lib/locale-path';
import { Img } from '@/components/ui/Img';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FullscreenNav, type NavStrings } from './FullscreenNav';
import logo from '@/assets/images/my-logo.png';

export interface HeaderStrings extends NavStrings { openMenu: string; homeAria: string }

function useScrolled(sentinelId: string | undefined, threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = sentinelId ? document.getElementById(sentinelId) : null;
    if (sentinel && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { rootMargin: `-${threshold}px 0px 0px 0px` });
      io.observe(sentinel);
      return () => io.disconnect();
    }
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setScrolled(window.scrollY > threshold)); };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [sentinelId, threshold]);
  return scrolled;
}

function useScrollSpy(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) return;
    const els = ids.map((id) => document.getElementById(id)).filter((x): x is HTMLElement => Boolean(x));
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set((e.target as HTMLElement).id, e.isIntersecting);
      const first = ids.find((id) => visible.get(id));
      if (first) setActive(first);
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);
  return active;
}

export function Header({ locale, variant = 'solid', nav, t, name }: {
  locale: Locale; variant?: 'overlay' | 'solid'; nav: NavItem[]; t: HeaderStrings; name: { first: string; last: string };
}) {
  const scrolled = useScrolled(variant === 'overlay' ? 'hero-sentinel' : undefined);
  const solid = variant === 'solid' || scrolled;
  const sectionIds = nav.filter((n) => n.kind === 'section').map((n) => n.id);
  const active = useScrollSpy(sectionIds, variant === 'overlay');
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className={`hdr ${solid ? 'hdr--solid' : 'hdr--transparent'}`} data-scrolled={scrolled || undefined}>
        {/* plain anchor on purpose: a full navigation, which reloads the page when you are already on the home page */}
        <a href={withBasePath(homePath(locale))} className="hdr__logo inline-flex items-center" aria-label={t.homeAria}>
          <Img src={logo} alt="" width={44} height={43} priority sizes="44px" className="h-10 w-auto" />
        </a>
        <nav aria-label={t.mainNav} className={`hdr__nav ${variant === 'overlay' && !scrolled ? 'hdr__nav--hidden' : ''}`}>
          <ul role="list">
            {nav.map((n) => {
              if (n.kind === 'file') return <li key={n.id}><a href={n.href} download className="hdr__cv">{n.label}</a></li>;
              const current = n.kind === 'section'
                ? (variant === 'overlay' && active === n.id ? 'location' : undefined)
                : (pathname.startsWith(n.href.replace(/#.*$/, '')) ? 'page' : undefined);
              return (
                <li key={n.id}>
                  <Link href={n.href} aria-current={current}>{n.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hdr__right">
          <LanguageSwitcher locale={locale} label={t.switchLang} />
          <button
            ref={burgerRef}
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-controls="fullscreen-nav"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
      <FullscreenNav id="fullscreen-nav" open={open} onClose={() => setOpen(false)} returnFocusTo={burgerRef} locale={locale} nav={nav} t={t} name={name} />
    </>
  );
}
