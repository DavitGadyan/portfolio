import { VideosPage, videosMetadata } from '@/components/pages/VideosPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return videosMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <VideosPage locale={locale as Locale} />; }
