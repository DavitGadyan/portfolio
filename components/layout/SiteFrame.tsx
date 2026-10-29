import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { getNav } from '@/lib/nav';
import { site } from '@/data/site';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

/** Header + main + footer around a page. variant="overlay" only on the home page (transparent over the hero). */
export function SiteFrame({ locale, variant = 'solid', children, mainClassName = '' }: { locale: Locale; variant?: 'overlay' | 'solid'; children: ReactNode; mainClassName?: string }) {
  const m = getMessages(locale);
  const nav = getNav(locale, m);
  return (
    <>
      <Header
        locale={locale}
        variant={variant}
        nav={nav}
        name={{ first: site.firstName, last: site.lastName }}
        t={{ menu: m.nav.menu, closeMenu: m.nav.closeMenu, openMenu: m.nav.openMenu, mainNav: m.nav.mainNav, switchLang: m.lang.switch, homeAria: m.nav.homeAria }}
      />
      <main id="main" tabIndex={-1} className={`${variant === 'solid' ? 'pt-16' : ''} outline-none ${mainClassName}`}>
        {children}
      </main>
      <Footer locale={locale} />
      <ScrollToTop label={m.nav.backToTop} />
    </>
  );
}
