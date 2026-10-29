import { ProjectPage, projectMetadata } from '@/components/pages/ProjectPage';
import { getProjectSlugs } from '@/lib/content/projects';
import type { Locale } from '@/lib/i18n/config';
type P = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getProjectSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: P) { const { locale, slug } = await params; return projectMetadata(locale as Locale, slug); }
export default async function Page({ params }: P) { const { locale, slug } = await params; return <ProjectPage locale={locale as Locale} slug={slug} />; }
