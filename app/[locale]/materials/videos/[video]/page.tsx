import { VideoPage, videoMetadata, videoIds } from '@/components/pages/VideosPage';
import { secondaryLocales, type Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; video: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return secondaryLocales.flatMap((locale) => videoIds.map((video) => ({ locale, video }))); }
export async function generateMetadata({ params }: P) { const { locale, video } = await params; return videoMetadata(locale as Locale, video); }
export default async function Page({ params }: P) { const { locale, video } = await params; return <VideoPage locale={locale as Locale} id={video} />; }
