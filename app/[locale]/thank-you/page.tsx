import { ThankYouPage, thankYouMetadata } from '@/components/pages/ThankYouPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return thankYouMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <ThankYouPage locale={locale as Locale} />; }
