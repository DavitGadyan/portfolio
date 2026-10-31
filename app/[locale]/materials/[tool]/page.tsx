import { MaterialPage, materialMetadata, materialIds } from '@/components/pages/MaterialsPage';
import { secondaryLocales, type Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; tool: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return secondaryLocales.flatMap((locale) => materialIds.map((tool) => ({ locale, tool }))); }
export async function generateMetadata({ params }: P) { const { locale, tool } = await params; return materialMetadata(locale as Locale, tool); }
export default async function Page({ params }: P) { const { locale, tool } = await params; return <MaterialPage locale={locale as Locale} id={tool} />; }
