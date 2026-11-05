import { MindMapsPage, mindmapsMetadata } from '@/components/pages/MindMapsPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return mindmapsMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <MindMapsPage locale={locale as Locale} />; }
