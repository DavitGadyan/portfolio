'use client';
import Link from 'next/link';
import { useEffect, useRef, type RefObject } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { NavItem } from '@/lib/nav';
import { Img } from '@/components/ui/Img';
import { SocialLinks } from '@/components/ui/SocialIcons';
import { LanguageSwitcher } from './LanguageSwitcher';
import navBack from '@/assets/images/backgrounds/nav-back.jpg';

export interface NavStrings { menu: string; closeMenu: string; mainNav: string; switchLang: string }

export function FullscreenNav({ id, open, onClose, returnFocusTo, locale, nav, t, name }: {
  id: string; open: boolean; onClose: () => void; returnFocusTo: RefObject<HTMLButtonElement | null>;
  locale: Locale; nav: NavItem[]; t: NavStrings; name: { first: string; last: string };
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open && !d.open) {
      d.showModal();
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => d.setAttribute('data-state', 'open'));
      d.querySelector<HTMLElement>('.fsnav__links a')?.focus();
    }
    if (!open && d.open) {
      const finish = () => {
        if (d.open) d.close();
        document.body.style.overflow = '';
        returnFocusTo.current?.focus();
      };
      d.removeAttribute('data-state');
      if (reduced) finish();
      else {
        const t = setTimeout(finish, 320);
        d.addEventListener('transitionend', () => { clearTimeout(t); finish(); }, { once: true });
      }
    }
  }, [open, returnFocusTo]);

  return (
    <dialog
      id={id}
      ref={dlg}
      className="fsnav"
      aria-label={t.menu}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dlg.current) onClose(); }}
    >
      <Img src={navBack} alt="" fill sizes="100vw" className="object-cover" loading="lazy" />
      <div className="fsnav__overlay" aria-hidden="true" />
      <button type="button" className="burger is-open fsnav__close" aria-label={t.closeMenu} onClick={onClose}>
        <span /><span /><span />
      </button>
      <div className="fsnav__content">
        <p className="m-0">
          <span className="fsnav__first">{name.first}</span>
          <span className="fsnav__last">{name.last}</span>
        </p>
        <nav aria-label={t.mainNav}>
          <ul role="list" className="fsnav__links">
            {nav.map((n) => (
              <li key={n.id}>{n.kind === 'file' ? <a href={n.href} download onClick={onClose}>{n.label}</a> : <Link href={n.href} onClick={onClose}>{n.label}</Link>}</li>
            ))}
          </ul>
        </nav>
        <SocialLinks className="fsnav__social" />
        <LanguageSwitcher locale={locale} label={t.switchLang} onNavigate={onClose} />
      </div>
    </dialog>
  );
}
