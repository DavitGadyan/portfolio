export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const secondaryLocales = locales.filter((l) => l !== defaultLocale) as Locale[];

export function isLocale(x: string | undefined | null): x is Locale {
  return (locales as readonly string[]).includes(x ?? '');
}

export const ogLocale: Record<Locale, string> = { en: 'en_US', es: 'es_ES' };
export const htmlLang: Record<Locale, string> = { en: 'en', es: 'es' };
export const localeLabel: Record<Locale, { code: string; name: string }> = {
  en: { code: 'EN', name: 'English' },
  es: { code: 'ES', name: 'Español' },
};
export function otherLocale(l: Locale): Locale {
  return l === 'en' ? 'es' : 'en';
}
