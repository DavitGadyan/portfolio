import { MindMapPage, mindMapMetadata, mapIds } from '@/components/pages/MindMapsPage';
import { secondaryLocales, type Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; map: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return secondaryLocales.flatMap((locale) => mapIds.map((map) => ({ locale, map }))); }
export async function generateMetadata({ params }: P) { const { locale, map } = await params; return mindMapMetadata(locale as Locale, map); }
export default async function Page({ params }: P) { const { locale, map } = await params; return <MindMapPage locale={locale as Locale} id={map} />; }
