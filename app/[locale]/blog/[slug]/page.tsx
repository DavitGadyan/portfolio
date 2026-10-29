import { PostPage, postMetadata } from '@/components/pages/PostPage';
import { getPostSlugs } from '@/lib/content/posts';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPostSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: P) { const { locale, slug } = await params; return postMetadata(locale as Locale, slug); }
export default async function Page({ params }: P) { const { locale, slug } = await params; return <PostPage locale={locale as Locale} slug={slug} />; }
