import { QuizPage, quizMetadata, trackIds } from '@/components/pages/QuizzesPage';
import { secondaryLocales, type Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; track: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return secondaryLocales.flatMap((locale) => trackIds.map((track) => ({ locale, track }))); }
export async function generateMetadata({ params }: P) { const { locale, track } = await params; return quizMetadata(locale as Locale, track); }
export default async function Page({ params }: P) { const { locale, track } = await params; return <QuizPage locale={locale as Locale} id={track} />; }
