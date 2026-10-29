import { PolicyPage, policyMetadata } from '@/components/pages/PolicyPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return policyMetadata(locale as Locale, 'privacy'); }
export default async function Page({ params }: P) { const { locale } = await params; return <PolicyPage locale={locale as Locale} slug="privacy" />; }
