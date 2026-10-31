import { MaterialsPage, materialsMetadata } from '@/components/pages/MaterialsPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return materialsMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <MaterialsPage locale={locale as Locale} />; }
