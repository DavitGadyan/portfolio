import type { Locale } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/messages';
import { homePath, sectionHref } from '@/lib/locale-path';
import { CV_PATH, withBasePath } from '@/lib/site';

export type NavItem = { id: string; label: string; href: string; kind: 'section' | 'page' | 'file' };

export function getNav(locale: Locale, m: Messages): NavItem[] {
  const sec = (id: string, label: string): NavItem => ({ id, label, href: sectionHref(locale, id), kind: 'section' });
  return [
    sec('home', m.nav.home),
    sec('about', m.nav.about),
    sec('services', m.nav.services),
    sec('portfolio', m.nav.portfolio),
    sec('testimonials', m.nav.testimonials),
    sec('contact', m.nav.contact),
    { id: 'blog', label: m.nav.blog, href: `${homePath(locale)}blog/`, kind: 'page' },
    { id: 'cv', label: m.about.cv, href: withBasePath(CV_PATH), kind: 'file' },
  ];
}

export const SECTION_IDS = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'] as const;
