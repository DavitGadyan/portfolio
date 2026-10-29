'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { locales, localeLabel, type Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/locale-path';
import { FlagIcon } from '@/components/ui/FlagIcon';

export function LanguageSwitcher({ locale, label, variant = 'light', onNavigate }: { locale: Locale; label: string; variant?: 'light' | 'dark'; onNavigate?: () => void }) {
  const pathname = usePathname() ?? '/';
  const [hash, setHash] = useState('');
  useEffect(() => {
    const h = () => setHash(window.location.hash);
    h();
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return (
    <nav aria-label={label} className={`lang ${variant === 'dark' ? 'lang--dark' : ''}`}>
      {locales.map((l) =>
        l === locale ? (
          <span key={l} className="lang__seg is-current" aria-current="true" lang={l}>
            <FlagIcon locale={l} />
            {localeLabel[l].code}
            <span className="visually-hidden"> – {localeLabel[l].name}</span>
          </span>
        ) : (
          <Link
            key={l}
            className="lang__seg"
            href={localizePath(pathname, l, hash)}
            hrefLang={l}
            lang={l}
            title={localeLabel[l].name}
            data-track="language_switch"
            data-track-from={locale}
            data-track-to={l}
            onClick={() => {
              try { localStorage.setItem('dg_lang', l); } catch { /* ignore */ }
              onNavigate?.();
            }}
          >
            <FlagIcon locale={l} />
            {localeLabel[l].code}
            <span className="visually-hidden"> – {localeLabel[l].name}</span>
          </Link>
        ),
      )}
    </nav>
  );
}
