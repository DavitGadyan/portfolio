import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getMessages } from '@/lib/i18n/messages';
import { buildMetadata } from './metadata';

export function homeMetadata(locale: Locale): Metadata {
  const m = getMessages(locale);
  return buildMetadata({ locale, path: '/', title: m.meta.homeTitle, description: m.meta.homeDescription, absoluteTitle: true });
}
