import { BlogIndexPage, blogMetadata } from '@/components/pages/BlogIndexPage';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P) { const { locale } = await params; return blogMetadata(locale as Locale); }
export default async function Page({ params }: P) { const { locale } = await params; return <BlogIndexPage locale={locale as Locale} />; }
