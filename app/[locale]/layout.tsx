import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { RootShell } from '@/components/layout/RootShell';
import { rootMetadata, rootViewport } from '@/lib/seo/metadata';
import { isLocale, secondaryLocales, type Locale } from '@/lib/i18n/config';

export const dynamicParams = false;
export const viewport = rootViewport;

export function generateStaticParams() {
  return secondaryLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return rootMetadata(isLocale(locale) ? locale : 'en');
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <RootShell locale={locale as Locale}>{children}</RootShell>;
}
