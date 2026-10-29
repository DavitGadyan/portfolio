import { HomePage } from '@/components/pages/HomePage';
import { homeMetadata } from '@/lib/seo/home-metadata';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return homeMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <HomePage locale={locale as Locale} />; }
