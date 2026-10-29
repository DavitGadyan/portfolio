import { defaultLocale, type Locale } from './i18n/config';

/** 'en' for '/', '/portfolio/x/'; 'es' for '/es', '/es/portfolio/x/'. Pathname must NOT include the basePath. */
export function getLocaleFromPath(pathname: string): Locale {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
}

/** Remove the locale prefix and normalise to a trailing slash: '/es/portfolio/x' -> '/portfolio/x/', '/es' -> '/'. */
export function stripLocale(pathname: string): string {
  const [pathOnly, hash] = splitHash(pathname);
  let p = pathOnly === '/es' ? '/' : pathOnly.startsWith('/es/') ? pathOnly.slice(3) : pathOnly;
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;
  return hash ? `${p}${hash}` : p;
}

/** Same page in another locale. localizePath('/portfolio/x/', 'es') -> '/es/portfolio/x/'; localizePath('/es/', 'en') -> '/'. */
export function localizePath(pathname: string, locale: Locale, hash = ''): string {
  const [base, existingHash] = splitHash(stripLocale(pathname));
  const h = hash || existingHash;
  const out = locale === defaultLocale ? base : base === '/' ? `/${locale}/` : `/${locale}${base}`;
  return h ? `${out}${h.startsWith('#') ? h : `#${h}`}` : out;
}

export function homePath(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`;
}

/** Path to a page in a locale: pagePath('es', '/blog/x/') -> '/es/blog/x/' */
export function pagePath(locale: Locale, path: string): string {
  return localizePath(path, locale);
}

/** Anchor on the home page that works from any page: sectionHref('es','about') -> '/es/#about' */
export function sectionHref(locale: Locale, id: string): string {
  return `${homePath(locale)}#${id}`;
}

function splitHash(p: string): [string, string] {
  const i = p.indexOf('#');
  return i === -1 ? [p, ''] : [p.slice(0, i), p.slice(i)];
}
