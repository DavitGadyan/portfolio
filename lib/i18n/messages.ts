import en from '@/messages/en.json';
import es from '@/messages/es.json';
import type { Locale } from './config';

export type Messages = typeof en;
const all: Record<Locale, Messages> = { en, es: es as Messages };

export function getMessages(locale: Locale): Messages {
  return all[locale];
}

/** Tiny interpolation: fmt('Hello {name}', { name: 'David' }) */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}
