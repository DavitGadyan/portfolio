import { QuizzesPage, quizzesMetadata } from '@/components/pages/QuizzesPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return quizzesMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <QuizzesPage locale={locale as Locale} />; }
