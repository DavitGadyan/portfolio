import { ProjectPage, projectMetadata } from '@/components/pages/ProjectPage';
import { getProjectSlugs } from '@/lib/content/projects';
export const dynamicParams = false;
export function generateStaticParams() { return getProjectSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return projectMetadata('en', slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <ProjectPage locale="en" slug={slug} />; }
