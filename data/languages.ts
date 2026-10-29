import type { Localized } from '@/lib/content/types';

export type LangCode = 'en' | 'ru' | 'es';
/** Spoken languages shown under Study & experience (flag + level). */
export const spokenLanguages: { code: LangCode; name: Localized<string>; level: Localized<string> }[] = [
  { code: 'en', name: { en: 'English', es: 'Inglés' }, level: { en: 'Native', es: 'Nativo' } },
  { code: 'ru', name: { en: 'Russian', es: 'Ruso' }, level: { en: 'Native', es: 'Nativo' } },
  { code: 'es', name: { en: 'Spanish', es: 'Español' }, level: { en: 'Conversational', es: 'Conversacional' } },
];
